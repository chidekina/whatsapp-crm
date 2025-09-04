// WhatsApp CRM - Content Script
class WhatsAppCRM {
  constructor() {
    this.categories = [];
    this.conversationMap = new Map();
    this.draggedElement = null;
    this.init();
  }

  async init() {
    await this.loadCategories();
    this.waitForWhatsAppLoad();
  }

  waitForWhatsAppLoad() {
    const checkInterval = setInterval(() => {
      const chatList = document.querySelector('[data-testid="chat-list"]');
      if (chatList) {
        clearInterval(checkInterval);
        this.setupCRM();
      }
    }, 1000);
  }

  async setupCRM() {
    this.createCRMInterface();
    this.observeConversations();
    this.restoreConversationCategories();
  }

  createCRMInterface() {
    // Remove interface existente se houver
    const existingCRM = document.getElementById('whatsapp-crm-panel');
    if (existingCRM) {
      existingCRM.remove();
    }

    // Criar painel lateral do CRM
    const crmPanel = document.createElement('div');
    crmPanel.id = 'whatsapp-crm-panel';
    crmPanel.className = 'crm-panel';
    
    crmPanel.innerHTML = `
      <div class="crm-header">
        <h3>📋 Categorias CRM</h3>
        <button class="crm-add-category" title="Adicionar Categoria">+</button>
        <button class="crm-toggle" title="Minimizar/Expandir">─</button>
      </div>
      <div class="crm-content">
        <div class="crm-categories" id="crm-categories">
          <div class="crm-category default-category" data-category="uncategorized">
            <div class="category-header">
              <span class="category-name">📥 Sem Categoria</span>
              <span class="category-count">0</span>
            </div>
            <div class="category-conversations"></div>
          </div>
        </div>
        <div class="crm-add-form" style="display: none;">
          <input type="text" placeholder="Nome da categoria" class="category-input">
          <div class="form-buttons">
            <button class="save-category">Salvar</button>
            <button class="cancel-category">Cancelar</button>
          </div>
        </div>
      </div>
    `;

    // Inserir o painel no DOM
    document.body.appendChild(crmPanel);

    // Carregar categorias existentes
    this.renderCategories();
    
    // Adicionar event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const panel = document.getElementById('whatsapp-crm-panel');
    
    // Toggle panel
    panel.querySelector('.crm-toggle').addEventListener('click', () => {
      const content = panel.querySelector('.crm-content');
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });

    // Adicionar categoria
    panel.querySelector('.crm-add-category').addEventListener('click', () => {
      const form = panel.querySelector('.crm-add-form');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
      if (form.style.display === 'block') {
        form.querySelector('.category-input').focus();
      }
    });

    // Salvar categoria
    panel.querySelector('.save-category').addEventListener('click', () => {
      this.addNewCategory();
    });

    // Cancelar adicionar categoria
    panel.querySelector('.cancel-category').addEventListener('click', () => {
      panel.querySelector('.crm-add-form').style.display = 'none';
      panel.querySelector('.category-input').value = '';
    });

    // Enter na input de categoria
    panel.querySelector('.category-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addNewCategory();
      }
    });
  }

  addNewCategory() {
    const input = document.querySelector('.category-input');
    const categoryName = input.value.trim();
    
    if (categoryName) {
      const categoryId = 'category_' + Date.now();
      const newCategory = {
        id: categoryId,
        name: categoryName,
        conversations: []
      };
      
      this.categories.push(newCategory);
      this.saveCategories();
      this.renderCategories();
      
      input.value = '';
      document.querySelector('.crm-add-form').style.display = 'none';
    }
  }

  renderCategories() {
    const categoriesContainer = document.getElementById('crm-categories');
    
    // Limpar categorias (exceto a default)
    const customCategories = categoriesContainer.querySelectorAll('.crm-category:not(.default-category)');
    customCategories.forEach(cat => cat.remove());
    
    // Adicionar categorias customizadas
    this.categories.forEach(category => {
      const categoryElement = this.createCategoryElement(category);
      categoriesContainer.appendChild(categoryElement);
    });
  }

  createCategoryElement(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'crm-category';
    categoryDiv.dataset.category = category.id;
    
    categoryDiv.innerHTML = `
      <div class="category-header">
        <span class="category-name">📁 ${category.name}</span>
        <span class="category-count">${category.conversations.length}</span>
        <button class="delete-category" title="Excluir Categoria">×</button>
      </div>
      <div class="category-conversations"></div>
    `;

    // Event listener para excluir categoria
    categoryDiv.querySelector('.delete-category').addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteCategory(category.id);
    });

    // Tornar categoria uma zona de drop
    this.setupDropZone(categoryDiv);
    
    return categoryDiv;
  }

  deleteCategory(categoryId) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      // Mover conversas para "Sem Categoria"
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.conversations.forEach(convId => {
          this.conversationMap.delete(convId);
        });
      }
      
      this.categories = this.categories.filter(cat => cat.id !== categoryId);
      this.saveCategories();
      this.renderCategories();
      this.updateConversationStyles();
    }
  }

  observeConversations() {
    const chatList = document.querySelector('[data-testid="chat-list"]');
    if (!chatList) return;

    // Observer para novas conversas
    const observer = new MutationObserver(() => {
      this.setupConversationDrag();
      this.updateCategoryCounts();
    });

    observer.observe(chatList, {
      childList: true,
      subtree: true
    });

    // Setup inicial
    this.setupConversationDrag();
  }

  setupConversationDrag() {
    const conversations = document.querySelectorAll('[data-testid="conversation"]');
    
    conversations.forEach(conversation => {
      if (!conversation.hasAttribute('data-crm-setup')) {
        conversation.setAttribute('data-crm-setup', 'true');
        conversation.draggable = true;
        
        conversation.addEventListener('dragstart', (e) => {
          this.draggedElement = conversation;
          e.dataTransfer.effectAllowed = 'move';
          conversation.classList.add('dragging');
        });

        conversation.addEventListener('dragend', () => {
          conversation.classList.remove('dragging');
          this.draggedElement = null;
        });
      }
    });
  }

  setupDropZone(categoryElement) {
    categoryElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      categoryElement.classList.add('drag-over');
    });

    categoryElement.addEventListener('dragleave', () => {
      categoryElement.classList.remove('drag-over');
    });

    categoryElement.addEventListener('drop', (e) => {
      e.preventDefault();
      categoryElement.classList.remove('drag-over');
      
      if (this.draggedElement) {
        const conversationId = this.getConversationId(this.draggedElement);
        const categoryId = categoryElement.dataset.category;
        
        this.moveConversationToCategory(conversationId, categoryId);
      }
    });
  }

  getConversationId(conversationElement) {
    // Tentar diferentes formas de identificar a conversa
    const titleElement = conversationElement.querySelector('[data-testid="conversation-title"]') ||
                        conversationElement.querySelector('[title]') ||
                        conversationElement.querySelector('span[dir="auto"]');
    
    return titleElement ? titleElement.textContent.trim() : 'unknown_' + Date.now();
  }

  moveConversationToCategory(conversationId, categoryId) {
    // Remover conversa de outras categorias
    this.categories.forEach(category => {
      category.conversations = category.conversations.filter(id => id !== conversationId);
    });
    
    // Remover do mapa se estava em outra categoria
    this.conversationMap.delete(conversationId);
    
    // Adicionar à nova categoria (se não for "uncategorized")
    if (categoryId !== 'uncategorized') {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.conversations.push(conversationId);
        this.conversationMap.set(conversationId, categoryId);
      }
    }
    
    this.saveCategories();
    this.updateConversationStyles();
    this.updateCategoryCounts();
  }

  updateConversationStyles() {
    const conversations = document.querySelectorAll('[data-testid="conversation"]');
    
    conversations.forEach(conversation => {
      const conversationId = this.getConversationId(conversation);
      const categoryId = this.conversationMap.get(conversationId);
      
      // Remover classes de categoria anteriores
      conversation.classList.remove('crm-categorized', 'crm-uncategorized');
      
      if (categoryId) {
        conversation.classList.add('crm-categorized');
        conversation.setAttribute('data-crm-category', categoryId);
      } else {
        conversation.classList.add('crm-uncategorized');
      }
    });
  }

  updateCategoryCounts() {
    // Atualizar contador de "Sem Categoria"
    const uncategorized = document.querySelectorAll('.crm-uncategorized').length;
    const uncategorizedElement = document.querySelector('[data-category="uncategorized"] .category-count');
    if (uncategorizedElement) {
      uncategorizedElement.textContent = uncategorized;
    }
    
    // Atualizar contadores das categorias
    this.categories.forEach(category => {
      const categoryElement = document.querySelector(`[data-category="${category.id}"] .category-count`);
      if (categoryElement) {
        categoryElement.textContent = category.conversations.length;
      }
    });
  }

  restoreConversationCategories() {
    // Reconstruir mapa de conversas
    this.conversationMap.clear();
    this.categories.forEach(category => {
      category.conversations.forEach(convId => {
        this.conversationMap.set(convId, category.id);
      });
    });
    
    this.updateConversationStyles();
    this.updateCategoryCounts();
  }

  async saveCategories() {
    try {
      await chrome.storage.local.set({
        whatsappCrmCategories: this.categories
      });
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
    }
  }

  async loadCategories() {
    try {
      const result = await chrome.storage.local.get('whatsappCrmCategories');
      this.categories = result.whatsappCrmCategories || [];
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      this.categories = [];
    }
  }
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WhatsAppCRM());
} else {
  new WhatsAppCRM();
}