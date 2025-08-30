# 🔧 Guia de Integração com API Real de IA

## Substituindo Placeholders pela API Real

### 1. Configuração da API de IA

Para usar sua API real de geração de imagens, você precisa modificar o arquivo `/src/index.tsx`:

```typescript
// Substitua esta seção no endpoint /api/generate:
const results = await Promise.all(prompts.map(async (prompt, index) => {
  // REMOVER: Código de placeholder atual
  
  // ADICIONAR: Sua integração real
  const response = await fetch('SUA_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer SEU_TOKEN'
    },
    body: JSON.stringify({
      query: prompt,
      aspect_ratio: aspectRatio,
      model: 'ideogram/V_3', // ou seu modelo preferido
      task_summary: 'Generate image for Meta Ads creative'
    })
  })
  
  const result = await response.json()
  
  return {
    id: `img_${Date.now()}_${index}`,
    prompt,
    url: result.image_url, // Ajuste conforme sua API
    aspectRatio,
    category,
    nationality: nationality || 'N/A',
    style: style || socialTheme || 'N/A', 
    timestamp: new Date().toISOString(),
    downloadUrl: result.image_url
  }
}))
```

### 2. Configuração de Variáveis de Ambiente

Para deploy no Cloudflare Pages, configure as secrets:

```bash
# Adicionar token da API
npx wrangler pages secret put AI_API_TOKEN --project-name webapp

# Adicionar endpoint da API
npx wrangler pages secret put AI_API_ENDPOINT --project-name webapp
```

### 3. Acessando as Variáveis no Hono

```typescript
// No Hono com Cloudflare Workers
app.post('/api/generate', async (c) => {
  const { env } = c // Acesso às variáveis de ambiente
  
  const response = await fetch(env.AI_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.AI_API_TOKEN}`
    },
    body: JSON.stringify(requestData)
  })
})
```

### 4. Modelos Recomendados

Para criativos de Meta Ads, recomendamos:

```typescript
const AI_MODELS = {
  'women': 'ideogram/V_3',        // Excelente para pessoas
  'social': 'flux-pro/kontext',   // Bom para conceitos
  'batch': 'qwen-image'           // Eficiente para massa
}
```

### 5. Tratamento de Erros

```typescript
try {
  const response = await fetch(apiEndpoint, requestConfig)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  
  const result = await response.json()
  
  // Validar resposta
  if (!result.image_url) {
    throw new Error('No image URL in response')
  }
  
} catch (error) {
  console.error('Generation failed:', error)
  // Retornar erro apropriado ou fallback
}
```

### 6. Cache e Rate Limiting

```typescript
// Implementar cache simples
const cache = new Map()

function getCacheKey(prompt, aspectRatio) {
  return `${prompt}_${aspectRatio}`.substring(0, 100)
}

// Verificar cache antes da API
const cacheKey = getCacheKey(prompt, aspectRatio)
if (cache.has(cacheKey)) {
  return cache.get(cacheKey)
}

// Rate limiting
let requestCount = 0
const MAX_REQUESTS_PER_MINUTE = 60

if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
  throw new Error('Rate limit exceeded')
}
```

### 7. Exemplo Completo de Integração

```typescript
interface AIAPIResponse {
  image_url: string
  prompt: string
  model: string
  processing_time: number
}

async function generateWithAI(prompt: string, aspectRatio: string, env: any): Promise<AIAPIResponse> {
  const response = await fetch(env.AI_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.AI_API_TOKEN}`,
      'User-Agent': 'MetaAdsCreativeGenerator/1.0'
    },
    body: JSON.stringify({
      query: prompt,
      aspect_ratio: aspectRatio,
      model: 'ideogram/V_3',
      image_urls: [], // Para image-to-image se necessário
      task_summary: `Generate ${aspectRatio} image for Meta Ads creative`
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`AI API failed: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

// Usar na função principal
const aiResult = await generateWithAI(prompt, aspectRatio, env)
```

### 8. Configurações de Produção

Para melhor performance em produção:

```typescript
// Configurações otimizadas
const PRODUCTION_CONFIG = {
  maxConcurrent: 3,        // Máximo de gerações simultâneas
  timeoutMs: 30000,        // Timeout de 30s
  retryAttempts: 2,        // Tentar novamente em caso de falha
  cacheTimeMs: 3600000,    // Cache de 1 hora
  maxPromptLength: 500     // Limite de caracteres no prompt
}
```

## ⚠️ Considerações Importantes

1. **Custos**: Monitor o uso da API para controlar custos
2. **Performance**: Implemente cache para prompts similares  
3. **Fallback**: Tenha um sistema de fallback em caso de falha
4. **Moderação**: Considere moderação automática de conteúdo
5. **Logs**: Mantenha logs para debugging e analytics

## 📊 Métricas Recomendadas

- Tempo de resposta da API
- Taxa de sucesso das gerações
- Custos por imagem gerada
- Uso por categoria/estilo
- Performance por modelo de IA

---

**Após a integração, teste thoroughly antes do deploy em produção!** 🚀