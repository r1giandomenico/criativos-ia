# 🎨 Gerador de Criativos para Meta Ads

## Visão Geral
Sistema avançado de geração de imagens com IA especializado em criar criativos para Meta Ads (Facebook/Instagram). Focado no nicho de relacionamento com múltiplas opções de personalização.

### URLs
- **Desenvolvimento**: https://3000-ix26c1zvlwzzljkxj8h4x-6532622b.e2b.dev
- **API Base**: `/api/generate`

## ✨ Funcionalidades Implementadas

### 🎯 Categorias de Criativos
1. **👩 Mulheres para Relacionamento**
   - Nacionalidades: Brasileira, Árabe, Mexicana, Americana, Europeia, Asiática
   - Estilos: Sexy, Bikini, Casual, Formal, Fitness
   - Prompts otimizados para conversão

2. **🤝 Benefício Social**
   - Educação, Saúde, Meio Ambiente, Comunidade, Tecnologia
   - Imagens inspiradoras e positivas

### 🔧 Recursos Técnicos
- **Formatos**: Quadrado (1:1), Vertical (9:16), Horizontal (16:9), Retrato (4:3)
- **Geração em Massa**: 1, 3, 5 ou 10 imagens simultâneas
- **Galeria Interativa**: Visualização, download, cópia de prompts
- **Modal de Detalhes**: Visualização completa das imagens
- **Exportação**: Download em lote e exportação de prompts
- **Responsivo**: Interface otimizada para desktop e mobile

### ⚡ Funcionalidades Avançadas
- **Prompts Inteligentes**: Geração automática com variações
- **Estatísticas**: Contadores por categoria e tempo
- **Atalhos de Teclado**: Ctrl+Enter (gerar), Ctrl+Del (limpar), Esc (fechar modal)
- **Notificações**: Sistema de feedback em tempo real
- **Cache de Sessão**: Manutenção das imagens durante a navegação

## 🛠️ Arquitetura Técnica

### Stack
- **Backend**: Hono Framework + TypeScript
- **Frontend**: JavaScript Vanilla + TailwindCSS
- **Deploy**: Cloudflare Pages/Workers
- **Gerenciamento**: PM2 (desenvolvimento)

### Estrutura de Dados
```json
{
  "id": "img_timestamp_index",
  "prompt": "Beautiful Brazilian woman, sexy style...",
  "url": "https://image-url.com/image.jpg",
  "aspectRatio": "9:16",
  "category": "women",
  "nationality": "brazilian",
  "style": "sexy",
  "timestamp": "2025-08-30T23:15:30.783Z"
}
```

### Endpoints da API
- `GET /` - Interface principal
- `POST /api/generate` - Geração de imagens
- `POST /api/generate-with-ai` - Template para integração com API real
- `GET /api/stats` - Estatísticas do sistema

## 🎨 Tipos de Prompts Gerados

### Mulheres
```
Beautiful [Nationality] woman, [style], professional photography, 
high quality, detailed, beautiful lighting, 4k resolution, 
[variation], [technical_specs]
```

### Benefício Social
```
[theme], inspiring, positive impact, professional photography, 
high quality, meaningful, uplifting, 4k resolution, 
[variation], [technical_specs]
```

## 🚀 Como Usar

### Interface Web
1. **Selecione a Categoria**: Mulheres ou Benefício Social
2. **Configure os Parâmetros**: 
   - Nacionalidade/Tema
   - Estilo
   - Formato da imagem
   - Quantidade (1-10)
3. **Clique em "Gerar Imagens"**
4. **Gerencie na Galeria**: 
   - Visualizar detalhes
   - Download individual
   - Copiar prompts
   - Remover imagens

### Ações em Massa
- **📦 Download Todas**: Baixa todas as imagens geradas
- **📄 Exportar Prompts**: Salva todos os prompts em arquivo .txt
- **🗑️ Limpar Galeria**: Remove todas as imagens

### API Direct
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "women",
    "nationality": "brazilian", 
    "style": "sexy",
    "aspectRatio": "9:16",
    "quantity": 3
  }'
```

## 📊 Estratégias para Meta Ads

### Melhores Práticas Implementadas
- **Diversidade de Nacionalidades**: Teste diferentes públicos
- **Variação de Estilos**: Do casual ao sexy para diferentes audiências
- **Formatos Otimizados**: Stories (9:16), Feed (1:1), Display (16:9)
- **Prompts Únicos**: Cada imagem tem variações para evitar repetição

### Recomendações de Teste A/B
1. **Por Nacionalidade**: Brasil vs EUA vs Árabe
2. **Por Estilo**: Casual vs Sexy vs Bikini  
3. **Por Formato**: Stories vs Feed vs Display
4. **Por Variação**: Diferentes lighting e poses

## 🔮 Próximos Passos Recomendados

### Integração com API Real
1. **Configurar API de IA**: Substituir placeholders por API real
2. **Adicionar Modelos**: ideogram/V_3, DALL-E, Midjourney
3. **Cache Inteligente**: Sistema de cache para imagens geradas
4. **Banco de Dados**: Persistência das imagens e metadados

### Melhorias de UX
1. **Preview em Tempo Real**: Pré-visualização antes da geração
2. **Templates**: Prompts salvos e reutilizáveis  
3. **Histórico**: Sistema de favoritos e histórico
4. **Campanhas**: Agrupamento por campanha/projeto

### Analytics e Otimização
1. **Métricas**: CTR, conversão por tipo de imagem
2. **A/B Testing**: Framework integrado de testes
3. **Feedback Loop**: Aprendizado baseado em performance
4. **Relatórios**: Dashboard de performance das imagens

### Compliance e Segurança
1. **Moderação**: Sistema de aprovação de conteúdo
2. **LGPD/GDPR**: Conformidade com regulamentações
3. **Rate Limiting**: Controle de uso da API
4. **Watermark**: Marca d'água opcional

## 🛡️ Status do Deploy
- **Status**: ✅ Ativo (Desenvolvimento)
- **Plataforma**: Cloudflare Pages
- **Última Atualização**: 30/08/2025
- **Performance**: ~2s por imagem, suporte a batch de 10

---

**Desenvolvido com foco em conversão para Meta Ads no nicho de relacionamento** 💖