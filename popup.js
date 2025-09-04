// WhatsApp CRM - Popup Script
document.addEventListener('DOMContentLoaded', async function() {
  await checkWhatsAppStatus();
  await loadStatistics();
  setupEventListeners();
});

async function checkWhatsAppStatus() {
  try {
    const tabs = await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' });
    const statusElement = document.getElementById('extension-status');
    const warningElement = document.getElementById('status-warning');
    const successElement = document.getElementById('status-success');
    
    if (tabs.length > 0) {
      statusElement.textContent = 'Ativo';
      statusElement.style.color = '#25D366';
      successElement.style.display = 'block';
      warningElement.style.display = 'none';
    } else {
      statusElement.textContent = 'WhatsApp Web fechado';
      statusElement.style.color = '#ff4757';
      warningElement.style.display = 'block';
      successElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    document.getElementById('extension-status').textContent = 'Erro';
  }
}

async function loadStatistics() {
  try {
    const result = await chrome.storage.local.get('whatsappCrmCategories');
    const categories = result.whatsappCrmCategories || [];
    
    const categoriesCount = categories.length;
    const categorizedCount = categories.reduce((total, category) => {
      return total + (category.conversations ? category.conversations.length : 0);
    }, 0);
    
    document.getElementById('categories-count').textContent = categoriesCount;
    document.getElementById('categorized-count').textContent = categorizedCount;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
    document.getElementById('categories-count').textContent = 'Erro';
    document.getElementById('categorized-count').textContent = 'Erro';
  }
}

function setupEventListeners() {
  // Botão para abrir WhatsApp Web
  document.getElementById('open-whatsapp').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://web.whatsapp.com' });
    window.close();
  });

  // Botão para limpar dados
  document.getElementById('reset-data').addEventListener('click', async () => {
    const confirmed = confirm('Tem certeza que deseja limpar todas as categorias? Esta ação não pode ser desfeita.');
    
    if (confirmed) {
      try {
        await chrome.storage.local.remove('whatsappCrmCategories');
        
        // Recarregar estatísticas
        await loadStatistics();
        
        // Recarregar a página do WhatsApp Web se estiver aberta
        const tabs = await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' });
        tabs.forEach(tab => {
          chrome.tabs.reload(tab.id);
        });
        
        // Mostrar feedback
        showNotification('Dados limpos com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao limpar dados:', error);
        showNotification('Erro ao limpar dados', 'error');
      }
    }
  });
}

function showNotification(message, type) {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = type === 'success' ? 'success' : 'warning';
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '10px';
  notification.style.left = '10px';
  notification.style.right = '10px';
  notification.style.zIndex = '10000';
  
  document.body.appendChild(notification);
  
  // Remover após 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Atualizar estatísticas quando a storage mudar
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.whatsappCrmCategories) {
    loadStatistics();
  }
});

// Atualizar status quando as tabs mudarem
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes('web.whatsapp.com')) {
    checkWhatsAppStatus();
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Pequeno delay para dar tempo da tab ser removida
  setTimeout(checkWhatsAppStatus, 100);
});