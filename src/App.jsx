import { useState } from 'react'
import './App.css'

function App() {
  const [categories, setCategories] = useState([
    { id: 'work', name: 'Trabalho', conversations: [] },
    { id: 'friends', name: 'Amigos', conversations: [] }
  ])
  const [draggedConversation, setDraggedConversation] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const mockConversations = [
    { id: 1, name: 'João Silva', message: 'Olá! Como você está?', avatar: 'JO' },
    { id: 2, name: 'Maria Santos', message: 'Reunião amanhã às 14h', avatar: 'MA' },
    { id: 3, name: 'Pedro Costa', message: 'Projeto finalizado!', avatar: 'PE' },
    { id: 4, name: 'Ana Empresa', message: 'Proposta comercial', avatar: 'AE' },
    { id: 5, name: 'Carlos Amigo', message: 'Vamos jogar futebol?', avatar: 'CA' }
  ]

  const handleDragStart = (conversation) => {
    setDraggedConversation(conversation)
  }

  const handleDragEnd = () => {
    setDraggedConversation(null)
  }

  const handleDrop = (e, categoryId) => {
    e.preventDefault()
    if (draggedConversation) {
      // Remove conversation from all categories
      setCategories(prev => prev.map(cat => ({
        ...cat,
        conversations: cat.conversations.filter(conv => conv.id !== draggedConversation.id)
      })))

      // Add to new category if not "uncategorized"
      if (categoryId !== 'uncategorized') {
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, conversations: [...cat.conversations, draggedConversation] }
            : cat
        ))
      }
      
      alert(`Conversa "${draggedConversation.name}" movida para categoria "${categoryId === 'uncategorized' ? 'Sem Categoria' : categories.find(c => c.id === categoryId)?.name}"!`)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: 'category_' + Date.now(),
        name: newCategoryName.trim(),
        conversations: []
      }
      setCategories(prev => [...prev, newCategory])
      setNewCategoryName('')
      setShowAddForm(false)
    }
  }

  const deleteCategory = (categoryId) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    }
  }

  const getCategorizedConversations = () => {
    const categorizedIds = categories.flatMap(cat => cat.conversations.map(conv => conv.id))
    return mockConversations.filter(conv => !categorizedIds.includes(conv.id))
  }

  return (
    <div className="demo-app">
      <div className="demo-header">
        <h1>📋 WhatsApp CRM - Demo Interativa</h1>
        <p>Teste o sistema de drag & drop das conversas</p>
      </div>
      
      <div className="demo-container">
        <div className="whatsapp-mock">
          <div className="mock-header">
            WhatsApp Web - Simulação
          </div>
          
          {mockConversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`mock-conversation ${draggedConversation?.id === conversation.id ? 'dragging' : ''}`}
              draggable
              onDragStart={() => handleDragStart(conversation)}
              onDragEnd={handleDragEnd}
            >
              <div className="mock-avatar">{conversation.avatar}</div>
              <div className="mock-info">
                <div className="mock-name">{conversation.name}</div>
                <div className="mock-message">{conversation.message}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="crm-panel">
          <div className="crm-header">
            <h3>📋 Categorias CRM</h3>
            <button 
              className="crm-add-category" 
              onClick={() => setShowAddForm(!showAddForm)}
              title="Adicionar Categoria"
            >
              +
            </button>
          </div>
          
          <div className="crm-content">
            <div className="crm-categories">
              {/* Categoria "Sem Categoria" */}
              <div 
                className="crm-category default-category"
                onDrop={(e) => handleDrop(e, 'uncategorized')}
                onDragOver={handleDragOver}
              >
                <div className="category-header">
                  <span className="category-name">📥 Sem Categoria</span>
                  <span className="category-count">{getCategorizedConversations().length}</span>
                </div>
              </div>

              {/* Categorias personalizadas */}
              {categories.map(category => (
                <div 
                  key={category.id}
                  className="crm-category"
                  onDrop={(e) => handleDrop(e, category.id)}
                  onDragOver={handleDragOver}
                >
                  <div className="category-header">
                    <span className="category-name">📁 {category.name}</span>
                    <span className="category-count">{category.conversations.length}</span>
                    <button 
                      className="delete-category"
                      onClick={() => deleteCategory(category.id)}
                      title="Excluir Categoria"
                    >
                      ×
                    </button>
                  </div>
                  <div className="category-conversations">
                    {category.conversations.map(conv => (
                      <div key={conv.id} className="categorized-conversation">
                        {conv.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {showAddForm && (
              <div className="crm-add-form">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  className="category-input"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNewCategory()}
                />
                <div className="form-buttons">
                  <button className="save-category" onClick={addNewCategory}>
                    Salvar
                  </button>
                  <button 
                    className="cancel-category" 
                    onClick={() => {
                      setShowAddForm(false)
                      setNewCategoryName('')
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
