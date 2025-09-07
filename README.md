# 🎨 Gerador de Criativos para Meta Ads

## Project Overview
- **Name**: Gerador de Criativos para Meta Ads
- **Goal**: Sistema completo de geração de imagens com IA para campanhas no Facebook e Instagram
- **Features**: Geração de mulheres de diferentes nacionalidades, imagens para benefícios sociais (Minha Casa Minha Vida), configuração de APIs e download em lote

## URLs
- **Production**: https://3000-ix26c1zvlwzzljkxj8h4x-6532622b.e2b.dev
- **API Base**: https://3000-ix26c1zvlwzzljkxj8h4x-6532622b.e2b.dev/api
- **GitHub**: Em desenvolvimento

## ✅ Recursos Implementados

### 🎯 Funcionalidades Principais
- **Geração de Mulheres**: 6 nacionalidades (Brasileira, Árabe, Mexicana, Americana, Europeia, Asiática) em 8 estilos (Sexy, Sedutora, Glamour, Bikini, Moderna, Casual, Formal, Fitness)
- **Benefícios Sociais**: Imagens específicas para "Minha Casa Minha Vida" (Brasil) e "Bienestar México" (Mujeres con Bienestar)
- **Múltiplos Formatos**: Quadrado (1:1), Vertical (9:16), Horizontal (16:9), Retrato (4:5), Paisagem (3:2)
- **Geração em Lote**: De 1 a 10 imagens por vez para testes A/B
- **Preview de Prompt**: Visualização e edição do prompt antes de gerar
- **Download ZIP**: Baixar todas as imagens geradas em um arquivo compactado com informações detalhadas

### ⚙️ Configuração de APIs
- **🆓 Pollinations AI**: 100% GRATUITO - Sem limites, usando Flux e Stable Diffusion
- **Ideogram V3**: Melhor qualidade (~$0.08/img)
- **Flux Pro**: Custo-benefício (~$0.055/img) 
- **DALL-E 3**: Premium OpenAI (~$0.04-0.12/img)
- **Stability AI**: Controle avançado (~$0.04/img)
- **Modo Demo**: Imagens placeholder para teste sem API

### 🔧 Funcionalidades Técnicas
- **Armazenamento Seguro**: APIs armazenadas criptografadas no localStorage
- **Teste de Conexão**: Validação automática das APIs configuradas
- **Galeria Interativa**: Visualização, download individual, cópia de prompts
- **Estatísticas**: Contador de imagens geradas por categoria
- **Interface Responsiva**: TailwindCSS com design moderno

## 📊 Endpoints da API

### POST /api/generate
Gerar imagens com IA ou placeholders
```json
{
  "category": "women|social",
  "nationality": "brazilian|arabic|mexican|american|european|asian",
  "style": "sexy|bikini|casual|formal|fitness",
  "socialTheme": "housing|family|education|health|community", 
  "aspectRatio": "1:1|9:16|16:9|4:5|3:2",
  "quantity": 1-10,
  "customPrompt": "prompt personalizado (opcional)",
  "userAPIConfig": { "provider": "ideogram", "apiKey": "xxx", "model": "V_3" }
}
```

### POST /api/test-connection
Testar configuração de API
```json
{
  "provider": "ideogram|flux|openai|stability",
  "apiKey": "sua_chave_api",
  "model": "modelo_específico"
}
```

### GET /api/stats
Obter estatísticas de uso

## 🏗️ Arquitetura de Dados

### Modelos de Dados
```typescript
interface GeneratedImage {
  id: string
  prompt: string
  url: string
  aspectRatio: string
  category: 'women' | 'social'
  nationality?: string
  style?: string
  socialTheme?: string
  timestamp: string
  downloadUrl: string
  provider: string
  model: string
}

interface APIConfig {
  provider: 'ideogram' | 'flux' | 'openai' | 'stability'
  apiKey: string
  model: string
  maxImages: number
  timeout: number
  savedAt: string
}
```

### Armazenamento
- **Frontend**: localStorage (criptografado) para configurações de API
- **Modo Demo**: Placeholder images via Picsum Photos
- **APIs Externas**: Integração com múltiplos provedores de IA

### Fluxo de Dados
1. **Configuração**: Usuário configura API → Validação → Armazenamento seguro
2. **Geração**: Seleções → Prompt automático → Edição opcional → Chamada API → Galeria
3. **Download**: Individual ou ZIP com metadados completos

## 🚀 Guia do Usuário

### 1. Configuração Inicial
1. Clique em "⚙️ Configurar APIs"
2. Escolha seu provedor (recomendado: Ideogram para qualidade)
3. Insira sua chave de API
4. Teste a conexão
5. Salve as configurações

### 2. Geração de Imagens
1. Escolha a categoria (👩 Mulheres ou 🤝 Benefício Social)
2. Configure nacionalidade/estilo ou tema social
3. Selecione formato e quantidade
4. Revise/edite o prompt no preview
5. Clique em "🎨 Gerar Imagens"

### 3. Gerenciamento
- **Visualizar**: Clique na imagem para ver detalhes
- **Download**: Botão individual ou "📦 Download ZIP" para todas
- **Copiar Prompt**: Para reutilizar em outras ferramentas
- **Limpar**: Remover imagens da galeria

## 🔄 Atualizações Recentes (31/08/2025)

### ✅ Atualizações Recentes - Prompts Melhorados e Correções
1. **✅ Novos Estilos Femininos**: Adicionados estilos "Sedutora", "Glamour" e "Moderna"
2. **✅ Prompts Mais Atraentes**: Descrições otimizadas para fotos sensuais (respeitando políticas)
3. **✅ Variações Específicas**: Cada estilo tem 8 variações únicas e personalizadas
4. **✅ Botão APIs Corrigido**: Modal de configuração funcionando com debug melhorado
5. **✅ Download ZIP Simplificado**: Nova implementação mais estável e compatível

### ✅ Nova Funcionalidade - Pollinations AI (GRATUITO)
1. **✅ API 100% Gratuita**: Integração com Pollinations AI - sem custo, sem limites
2. **✅ Modelos Avançados**: Flux, Stable Diffusion e Turbo disponíveis
3. **✅ Fácil Configuração**: Não precisa de API key, funciona imediatamente
4. **✅ Qualidade Excelente**: Resultados profissionais para Meta Ads

### ✅ Nova Funcionalidade - Bienestar México
1. **✅ Programa Social Mexicano**: Adicionada opção "Bienestar México (Mujeres con Bienestar)"
2. **✅ Prompts Específicos**: Geração focada em mulheres mexicanas beneficiárias (1 pessoa por imagem)
3. **✅ Contextualização Cultural**: Roupas tradicionais, cerimônias oficiais, cartões de benefício
4. **✅ Variações Temáticas**: 8 variações específicas do programa social mexicano

## 🔄 Correções Anteriores (31/08/2025)

### ✅ Correções Implementadas
1. **✅ Botão "Configurar APIs"**: Corrigido problema de modal não abrir
2. **✅ Preview de Prompt**: Implementada visualização e edição inline (removido botão export desnecessário)
3. **✅ Download ZIP**: Funcionalidade completamente reformulada com JSZip e tratamento de erros
4. **✅ Prompts de Família**: Corrigidos para gerar máximo 1 casal + 2 filhos (total 4 pessoas)
5. **✅ Aspectos Suportados**: Removido 4:3, adicionado 4:5 e 3:2 compatíveis com APIs

### 🔧 Melhorias Técnicas
- Validação aprimorada de elementos DOM
- Tratamento robusto de erros no download ZIP
- Carregamento dinâmico da biblioteca JSZip
- Prompts mais específicos para famílias brasileiras
- Compatibilidade com formatos aceitos pelas APIs de IA

## 🛠️ Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Ativo e Funcionando
- **Tech Stack**: Hono + TypeScript + TailwindCSS + Vite
- **Build**: Automático via Wrangler
- **Last Updated**: 31 de agosto de 2025

## 📈 Próximos Passos
1. **Integração GitHub**: Configurar repositório e versionamento
2. **Deploy Production**: Migrar para Cloudflare Pages em produção
3. **Analytics**: Implementar métricas de uso
4. **Cache**: Sistema de cache para imagens geradas
5. **Templates**: Prompts salvos e reutilizáveis
6. **Batch Processing**: Melhorar performance para grandes volumes

## 🏆 Destaques do Sistema
- **Interface Intuitiva**: Design moderno e responsivo
- **Flexibilidade**: Suporte a 4 APIs diferentes
- **Segurança**: Chaves criptografadas no navegador
- **Eficiência**: Geração em lote e download organizado
- **Qualidade**: Prompts otimizados para Meta Ads
- **Escalabilidade**: Arquitetura preparada para crescimento