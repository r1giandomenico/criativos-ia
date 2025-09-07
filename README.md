# 🎨 Criativos IA - Meta Ads Studio

Sistema completo de geração e edição de criativos para Meta Ads usando Inteligência Artificial.

## 🌟 Funcionalidades

### 🖼️ **Gerador de Criativos**
- **Mulheres de diferentes nacionalidades**: Brasileiras, Árabes, Mexicanas, Americanas, Europeias, Asiáticas
- **Estilos variados**: Sexy, Sedutora, Glamour, Bikini, Moderna, Casual, Formal, Fitness
- **Benefício Social**: Minha Casa Minha Vida, Bienestar México, Família, Educação, Saúde
- **Formatos otimizados**: Instagram Feed, Stories, Facebook, Posts Verticais
- **Geração em massa**: 1, 3, 5 ou 10 imagens por vez

### ✏️ **Editor de Imagens (Página Separada)**
- **Upload drag & drop**: Arraste e solte imagens
- **Formatos Facebook**: 1080x1080, 1200x1200, Stories, Instagram
- **Modos de ajuste**: Cover, Contain, Fill, Crop
- **Botões Play**: 4 estilos diferentes (YouTube, Círculo, Quadrado, Gradiente)
- **Download funcional**: Canvas.toBlob() otimizado
- **Canvas em tempo real**: Preview instantâneo das edições

### 📦 **Sistema de Downloads**
- **Download ZIP**: Todas as imagens em formato compactado
- **Download individual**: Imagens em alta qualidade
- **Metadados incluídos**: Informações detalhadas de cada criativo

## 🔗 URLs

### 🎨 **Gerador Principal**
- **Produção**: https://criativos-ia.pages.dev
- **Desenvolvimento**: http://localhost:3000

### 🖼️ **Editor de Imagens**  
- **Produção**: https://criativos-ia.pages.dev/editor
- **Desenvolvimento**: http://localhost:3000/editor

## 🏗️ Arquitetura Técnica

### **Backend**
- **Hono Framework**: Web framework moderno e rápido
- **Cloudflare Workers**: Runtime serverless na edge
- **TypeScript**: Tipagem estática e desenvolvimento robusto

### **Frontend**
- **Vanilla JavaScript**: Performance otimizada
- **Canvas API**: Edição de imagens em tempo real
- **TailwindCSS**: Estilização utilitária e responsiva
- **FontAwesome**: Iconografia profissional

### **Integração IA**
- **Pollinations AI**: Geração gratuita (padrão)
- **Ideogram V3**: Qualidade premium para pessoas
- **Flux Pro**: Melhor custo-benefício
- **DALL-E 3**: Qualidade OpenAI
- **Stability AI**: Controle avançado

## 📁 Estrutura do Projeto

```
criativos-ia/
├── src/
│   ├── index.tsx          # Aplicação principal Hono
│   ├── editor.tsx         # Página do editor (não usado)
│   ├── ai-integration.ts  # Integração com APIs de IA
│   └── renderer.tsx       # Renderizador Hono
├── public/static/
│   ├── app.js            # JavaScript principal
│   ├── editor.js         # JavaScript do editor
│   └── style.css         # Estilos customizados  
├── wrangler.toml         # Configuração Cloudflare
├── package.json          # Dependências e scripts
└── README.md            # Documentação
```

## 🚀 Como Usar

### **1. Gerador de Criativos**
1. Acesse a página principal
2. Escolha categoria (Mulheres ou Benefício Social)
3. Configure nacionalidade/tema e estilo
4. Selecione formato e quantidade
5. Clique em "🎨 Gerar Imagens"
6. Use "📦 Download ZIP" para baixar todas

### **2. Editor de Imagens**
1. Clique em "🖼️ Abrir Editor de Imagens"
2. Faça upload ou arraste imagens
3. Selecione formato de saída desejado
4. Configure modo de ajuste
5. Adicione botão play se necessário
6. Clique em "Download" para salvar

## ⚙️ Configuração de APIs

O sistema suporta múltiplas APIs de IA:

1. **Pollinations AI** (Gratuito) - Padrão ativo
2. **Ideogram V3** - Melhor para pessoas (configure API key)
3. **Flux Pro** - Custo-benefício (configure API key)
4. **DALL-E 3** - Premium OpenAI (configure API key)
5. **Stability AI** - Controle avançado (configure API key)

## 🛠️ Desenvolvimento

### **Instalação**
```bash
npm install
```

### **Desenvolvimento Local**
```bash
npm run dev
# Acesse: http://localhost:3000
```

### **Build**
```bash
npm run build
```

### **Deploy Cloudflare Pages**
```bash
npm run deploy
```

## 📊 Métricas de Performance

- **Tempo de geração**: 3-8 segundos por imagem
- **Formatos suportados**: PNG, JPG, WebP
- **Resolução máxima**: 1200x1200px
- **Download ZIP**: Imagens reais (não placeholders)
- **Compatibilidade**: Chrome, Firefox, Safari, Edge

## 🎯 Casos de Uso

### **Marketing Digital**
- Criativos para campanhas Facebook Ads
- Imagens para Instagram Stories
- Materiais para anúncios Meta

### **Benefício Social**  
- Campanhas Minha Casa Minha Vida
- Materiais Bienestar México
- Comunicação governamental

### **Teste A/B**
- Geração de múltiplas variações
- Comparação de estilos diferentes
- Otimização de performance

## 🔒 Segurança

- **API Keys**: Armazenamento seguro no localStorage
- **CORS**: Configuração adequada para APIs externas  
- **Sanitização**: Validação de inputs do usuário
- **Rate Limiting**: Controle de uso das APIs

## 📈 Próximas Funcionalidades

- [ ] Integração com Facebook Graph API
- [ ] Templates predefinidos
- [ ] Histórico de gerações
- [ ] Colaboração em equipe
- [ ] Analytics de performance
- [ ] Programação de posts

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)  
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **GitHub Issues**: [https://github.com/r1giandomenico/criativos-ia/issues](https://github.com/r1giandomenico/criativos-ia/issues)
- **Documentação**: README.md
- **Deploy Status**: [![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange)](https://criativos-ia.pages.dev)

---

**Desenvolvido com ❤️ para otimizar campanhas Meta Ads através de IA**