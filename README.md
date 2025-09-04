# 📋 WhatsApp CRM - Extensão Chrome

Uma extensão para Chrome que permite organizar suas conversas do WhatsApp Web em categorias arrastáveis.

## ✨ Funcionalidades

- **Categorização Visual**: Organize conversas em categorias personalizadas
- **Drag & Drop**: Arraste conversas facilmente entre categorias
- **Persistência**: Suas categorias são salvas automaticamente
- **Interface Intuitiva**: Painel lateral elegante e fácil de usar
- **Estatísticas**: Veja quantas conversas você organizou
- **Responsivo**: Funciona em diferentes tamanhos de tela

## 🚀 Como Instalar

### Instalação Manual (Developer Mode)

1. **Clone ou baixe este repositório**

2. **Abra o Chrome e vá para extensões**:
   - Digite `chrome://extensions/` na barra de endereços
   - Ou vá em Menu > Mais ferramentas > Extensões

3. **Ative o Modo Desenvolvedor**:
   - Toggle no canto superior direito da página

4. **Carregue a extensão**:
   - Clique em "Carregar sem compactação"
   - Selecione a pasta do projeto (`whatsapp-crm`)

5. **Pronto!** A extensão será instalada e você verá o ícone na barra do Chrome

## 📱 Como Usar

1. **Abra o WhatsApp Web**: Vá para https://web.whatsapp.com
2. **Veja o painel CRM**: Aparecerá no canto direito da tela
3. **Crie categorias**: Clique no botão "+" para adicionar novas categorias
4. **Organize conversas**: Arraste as conversas para as categorias desejadas
5. **Gerencie categorias**: Use o "×" para excluir categorias não utilizadas

## 🎯 Recursos Principais

### Painel de Categorias
- **Sem Categoria**: Conversas não organizadas aparecem aqui
- **Categorias Personalizadas**: Crie quantas quiser
- **Contadores**: Veja quantas conversas tem em cada categoria
- **Drag & Drop**: Interface intuitiva de arrastar e soltar

### Indicadores Visuais
- **📁 Ícone verde**: Conversas categorizadas
- **Barra laranja**: Conversas sem categoria
- **Animações**: Feedback visual durante o drag & drop

### Popup da Extensão
- **Status**: Veja se a extensão está ativa
- **Estatísticas**: Quantas categorias e conversas organizadas
- **Controles**: Abrir WhatsApp Web e limpar dados

## 🛠️ Estrutura dos Arquivos

```
whatsapp-crm/
├── manifest.json      # Configuração da extensão
├── content.js         # Script principal que roda no WhatsApp Web
├── styles.css         # Estilos da interface
├── popup.html         # Interface do popup
├── popup.js           # Lógica do popup
└── icons/            # Ícones da extensão (você precisa adicionar)
```

## 🔧 Desenvolvimento

### Tecnologias Utilizadas
- **Manifest V3**: Última versão das extensões Chrome
- **Vanilla JavaScript**: Sem dependências externas
- **CSS3**: Animações e gradientes modernos
- **Chrome Storage API**: Persistência de dados
- **Drag and Drop API**: Interface de arrastar e soltar

### APIs Utilizadas
- `chrome.storage.local`: Salvar categorias
- `chrome.tabs`: Gerenciar abas do WhatsApp Web
- `MutationObserver`: Detectar novas conversas
- `Drag and Drop Events`: Interface de arrastar

## 🎨 Personalização

### Cores Principais
- **Verde WhatsApp**: `#25D366`
- **Verde Escuro**: `#128C7E`
- **Amarelo Aviso**: `#ffa500`
- **Vermelho Erro**: `#ff4757`

### Modificar Estilos
Edite o arquivo `styles.css` para personalizar:
- Posição do painel
- Cores e tamanhos
- Animações
- Responsividade

## 🔒 Privacidade

- **Dados Locais**: Tudo é salvo apenas no seu navegador
- **Sem Telemetria**: Não enviamos dados para servidores
- **WhatsApp Only**: Funciona apenas no WhatsApp Web
- **Permissões Mínimas**: Acesso apenas ao necessário

## 🐛 Troubleshooting

### A extensão não aparece
- Verifique se está no WhatsApp Web
- Recarregue a página (Ctrl+F5)
- Verifique se a extensão está ativa

### Conversas não estão sendo detectadas
- Aguarde a página carregar completamente
- Verifique se há conversas na lista
- Tente recarregar a extensão

### Painel não aparece
- Verifique o Developer Console (F12)
- Certifique-se de que não há conflitos CSS
- Teste em modo anônimo

## 📋 TODO / Melhorias Futuras

- [ ] Ícones personalizados para a extensão
- [ ] Filtros por categoria no WhatsApp
- [ ] Exportar/Importar categorias
- [ ] Temas de cores
- [ ] Atalhos de teclado
- [ ] Sincronização entre dispositivos
- [ ] Estatísticas avançadas

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

## ⚠️ Disclaimer

Esta extensão não é oficial do WhatsApp. Use por sua própria conta e risco. O WhatsApp pode alterar sua interface a qualquer momento, o que pode afetar o funcionamento da extensão.