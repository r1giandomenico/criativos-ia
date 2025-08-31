# 🔑 Guia Completo de Configuração de APIs

## 1. 🏆 APIs Recomendadas (Ordenadas por Qualidade)

### **Ideogram V3** ⭐⭐⭐⭐⭐ (RECOMENDADO)
- **Melhor para**: Mulheres realistas, diferentes etnias, textos em imagens
- **Preço**: ~$0.08 por imagem
- **Registro**: https://ideogram.ai/
- **Documentação**: https://api-docs.ideogram.ai/

```bash
# Chave necessária
IDEOGRAM_API_KEY=ideogram_********
```

### **Flux Pro** ⭐⭐⭐⭐ (CUSTO-BENEFÍCIO)
- **Melhor para**: Geração rápida, boa qualidade
- **Preço**: ~$0.055 por imagem
- **Registro**: https://replicate.com/ ou https://api.bfl.ml/
- **Velocidade**: ~10-30 segundos

```bash
# Chave necessária  
FLUX_API_KEY=flux_********
```

### **DALL-E 3** ⭐⭐⭐⭐ (PREMIUM)
- **Melhor para**: Qualidade premium, seguir instruções complexas
- **Preço**: ~$0.040-$0.120 por imagem
- **Registro**: https://platform.openai.com/
- **Limite**: Mais restritivo para conteúdo

```bash
# Chave necessária
OPENAI_API_KEY=sk-********
```

### **Stability AI** ⭐⭐⭐ (CUSTOMIZÁVEL)
- **Melhor para**: Controle avançado, modelos customizáveis  
- **Preço**: ~$0.040 por imagem
- **Registro**: https://platform.stability.ai/
- **Documentação**: https://platform.stability.ai/docs

```bash
# Chave necessária
STABILITY_API_KEY=sk-********
```

## 2. 📋 Como Obter as Chaves de API

### **Para Ideogram (RECOMENDADO):**
1. Acesse https://ideogram.ai/
2. Faça cadastro/login
3. Vá em **Account Settings** → **API Keys**
4. Clique em **Create New Key**
5. Copie a chave que começa com `ideogram_`

### **Para OpenAI (DALL-E):**
1. Acesse https://platform.openai.com/
2. Faça login/cadastro
3. Vá em **API Keys** no menu lateral
4. Clique **+ Create new secret key**
5. Copie a chave que começa com `sk-`

### **Para Flux Pro:**
1. **Opção A - Replicate**: https://replicate.com/account/api-tokens
2. **Opção B - BFL**: https://api.bfl.ml/ (cadastro + billing)
3. Crie token de API
4. Copie a chave

### **Para Stability AI:**
1. Acesse https://platform.stability.ai/
2. Vá em **Account** → **API Keys** 
3. Clique **Create API Key**
4. Copie a chave que começa com `sk-`

## 3. ⚙️ Configuração no Projeto

### **Desenvolvimento Local:**

1. **Crie o arquivo `.dev.vars`** (não commitado):
```bash
cd /home/user/webapp
cp .dev.vars.example .dev.vars
```

2. **Edite `.dev.vars`** com suas chaves reais:
```bash
# Escolha UMA API (recomendo Ideogram)
IDEOGRAM_API_KEY=sua_chave_ideogram_aqui
# OU
OPENAI_API_KEY=sua_chave_openai_aqui  
# OU
FLUX_API_KEY=sua_chave_flux_aqui
# OU  
STABILITY_API_KEY=sua_chave_stability_aqui

# Defina qual usar (ideogram, openai, flux, ou stability)
AI_API_PROVIDER=ideogram

# Configurações opcionais
AI_MODEL_DEFAULT=V_3
MAX_IMAGES_PER_REQUEST=10
```

### **Deploy na Produção (Cloudflare Pages):**

```bash
# Configure as secrets no Cloudflare (substitua pelos valores reais)
npx wrangler pages secret put IDEOGRAM_API_KEY --project-name webapp
npx wrangler pages secret put AI_API_PROVIDER --project-name webapp

# Outros providers (configure apenas o que for usar)
npx wrangler pages secret put OPENAI_API_KEY --project-name webapp  
npx wrangler pages secret put FLUX_API_KEY --project-name webapp
npx wrangler pages secret put STABILITY_API_KEY --project-name webapp

# Configurações adicionais
npx wrangler pages secret put AI_MODEL_DEFAULT --project-name webapp
```

## 4. 🧪 Testando a Configuração

### **Teste Local:**
```bash
# Inicie o servidor
cd /home/user/webapp
npm run build
pm2 restart webapp

# Teste a API
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "women",
    "nationality": "brazilian", 
    "style": "casual",
    "aspectRatio": "1:1",
    "quantity": 1
  }'
```

### **Verificar Logs:**
```bash
# Ver se a API está sendo chamada
pm2 logs webapp --nostream
```

## 5. 💰 Estimativa de Custos

### **Para 1000 imagens/mês:**
- **Ideogram**: ~$80/mês (melhor qualidade)
- **Flux Pro**: ~$55/mês (melhor custo-benefício)  
- **DALL-E 3**: ~$40-120/mês (depende do tamanho)
- **Stability**: ~$40/mês (mais técnico)

### **Recomendação por Volume:**
- **Teste/Baixo Volume** (< 100 imgs): DALL-E 3
- **Médio Volume** (100-1000): Ideogram ou Flux
- **Alto Volume** (> 1000): Flux Pro ou Stability

## 6. 🔧 Configuração Avançada

### **Múltiplos Providers (Failover):**
```bash
# Configure múltiplas chaves para redundância
IDEOGRAM_API_KEY=sua_chave_principal
FLUX_API_KEY=sua_chave_backup
AI_API_PROVIDER=ideogram
AI_FALLBACK_PROVIDER=flux
```

### **Rate Limiting:**
```bash
RATE_LIMIT_PER_MINUTE=30
BATCH_SIZE_LIMIT=5
RETRY_ATTEMPTS=2
```

## 7. ⚠️ Considerações Importantes

### **Segurança:**
- ✅ Nunca commite chaves no código
- ✅ Use `.dev.vars` local e secrets no Cloudflare
- ✅ Monitore uso para evitar cobranças inesperadas

### **Performance:**
- ✅ Implemente cache para prompts similares
- ✅ Use batch processing quando possível
- ✅ Configure timeouts adequados (30-60s)

### **Compliance:**
- ✅ Respeite os termos de uso de cada API
- ✅ Evite conteúdo problemático
- ✅ Considere moderação automática

## 8. 🚀 Próximos Passos

1. **Escolha uma API** (recomendo Ideogram para começar)
2. **Obtenha a chave** seguindo o guia acima
3. **Configure no projeto** usando `.dev.vars`
4. **Teste localmente** com uma imagem
5. **Configure no Cloudflare** para produção
6. **Monitore custos** e performance

---

**💡 Dica**: Comece com Ideogram (melhor qualidade) ou Flux (melhor preço). Ambos são excelentes para criativos de Meta Ads!