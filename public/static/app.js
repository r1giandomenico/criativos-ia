// Estado da aplicação
console.log('🚀 JavaScript carregado com sucesso!')

// Função de teste global
window.testFunction = function() {
  console.log('✅ Função de teste funcionando!')
  alert('Botões estão funcionando!')
}

let currentCategory = 'women'
let generatedImages = []
let currentAPIConfig = null

// Configurações das APIs
const API_PROVIDERS = {
  pollinations: {
    name: '🆓 Pollinations AI',
    description: '100% gratuito! Geração rápida usando Flux e Stable Diffusion. Perfeito para começar.',
    signupUrl: 'https://pollinations.ai/',
    signupText: 'Acesse Pollinations.ai',
    keyFormat: 'Nenhuma chave necessária (100% gratuito)',
    models: ['flux', 'stable-diffusion', 'turbo'],
    defaultModel: 'flux',
    cost: 'GRATUITO'
  },
  ideogram: {
    name: '🏆 Ideogram V3',
    description: 'Melhor qualidade para pessoas e criativos. Excelente para diferentes etnias e estilos realistas.',
    signupUrl: 'https://ideogram.ai/',
    signupText: 'Cadastre-se no Ideogram.ai',
    keyFormat: 'Ex: ideogram_xxxxxxxx',
    models: ['V_3', 'V_2', 'V_1'],
    defaultModel: 'V_3',
    cost: '~$0.08/imagem'
  },
  flux: {
    name: '⚡ Flux Pro',
    description: 'Melhor custo-benefício. Rápido e eficiente para geração em massa.',
    signupUrl: 'https://replicate.com/account/api-tokens',
    signupText: 'Obtenha token no Replicate',
    keyFormat: 'Ex: r8_xxxxxxxx ou flux_xxxxxxxx',
    models: ['flux-pro-1.1', 'flux-dev', 'flux-schnell'],
    defaultModel: 'flux-pro-1.1',
    cost: '~$0.055/imagem'
  },
  openai: {
    name: '🤖 DALL-E 3 (OpenAI)',
    description: 'Qualidade premium da OpenAI. Excelente seguimento de instruções complexas.',
    signupUrl: 'https://platform.openai.com/api-keys',
    signupText: 'Criar chave na OpenAI',
    keyFormat: 'Ex: sk-xxxxxxxx',
    models: ['dall-e-3', 'dall-e-2'],
    defaultModel: 'dall-e-3',
    cost: '~$0.04-0.12/imagem'
  },
  stability: {
    name: '🎨 Stability AI',
    description: 'Controle avançado e modelos customizáveis. Em fase beta - pode ter limitações.',
    signupUrl: 'https://platform.stability.ai/account/keys',
    signupText: 'Gerar chave na Stability AI',
    keyFormat: 'Ex: sk-xxxxxxxx',
    models: ['core', 'sd3-large', 'sd3-medium'],
    defaultModel: 'core',
    cost: '~$0.04/imagem'
  }
}

// Função para criptografia simples (base64 + chave)
function encryptData(data) {
  return btoa(JSON.stringify(data))
}

function decryptData(encryptedData) {
  try {
    return JSON.parse(atob(encryptedData))
  } catch {
    return null
  }
}

// Carregar configuração salva
function loadAPIConfig() {
  try {
    const saved = localStorage.getItem('webapp_api_config')
    if (saved) {
      currentAPIConfig = decryptData(saved)
      updateAPIStatus()
      return currentAPIConfig
    }
  } catch (error) {
    console.error('Erro ao carregar configuração:', error)
  }
  return null
}

// Salvar configuração
function saveAPIConfigToStorage(config) {
  try {
    localStorage.setItem('webapp_api_config', encryptData(config))
    currentAPIConfig = config
    updateAPIStatus()
  } catch (error) {
    console.error('Erro ao salvar configuração:', error)
    showNotification('❌ Erro ao salvar configuração', 'error')
  }
}

// Seleção de categoria
window.selectCategory = function selectCategory(category) {
  currentCategory = category
  
  // Atualizar botões
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active')
  })
  document.getElementById(`category-${category}`).classList.add('active')
  
  // Mostrar/ocultar configurações
  const womenConfig = document.getElementById('women-config')
  const socialConfig = document.getElementById('social-config')
  
  if (category === 'women') {
    womenConfig.classList.remove('hidden')
    socialConfig.classList.add('hidden')
  } else {
    womenConfig.classList.add('hidden')
    socialConfig.classList.remove('hidden')
  }
  
  // Atualizar preview do prompt
  updatePromptPreview()
}

// Atualizar preview do prompt
function updatePromptPreview() {
  const category = currentCategory
  const promptPreview = document.getElementById('prompt-preview')
  
  if (!promptPreview) return
  
  let preview = ''
  
  if (category === 'women') {
    const nationality = document.getElementById('nationality')?.value || 'brazilian'
    const style = document.getElementById('style')?.value || 'casual'
    
    let styleDesc = ''
    let additionalDesc = ''
    
    switch(style) {
      case 'sexy':
        styleDesc = 'attractive sensual style, fashionable outfit, confident pose, alluring look, stylish appearance'
        additionalDesc = ', attractive pose, confident expression, stylish outfit with subtle elegance, charming smile'
        break
      case 'seductive':
        styleDesc = 'seductive pose, attractive clothing, charming smile, confident attitude'
        additionalDesc = ', alluring gaze, confident expression, stylish pose'
        break
      case 'glamour':
        styleDesc = 'glamorous outfit, stunning appearance, elegant pose, fashion model style'
        additionalDesc = ', glamorous makeup, luxury fashion, model pose, studio lighting'
        break
      case 'bikini':
        styleDesc = 'wearing bikini, beach setting, summer vibes, swimwear fashion'
        additionalDesc = ', beach bikini, tropical setting, summer vibes, confident pose'
        break
      case 'trendy':
        styleDesc = 'trendy modern outfit, stylish look, contemporary fashion, chic appearance'
        additionalDesc = ', modern fashion, contemporary style, trendy accessories, stylish pose'
        break
      case 'casual':
        styleDesc = 'casual elegant outfit, natural beauty, comfortable style'
        additionalDesc = ', smiling naturally, bright eyes, professional pose'
        break
      case 'formal':
        styleDesc = 'elegant formal dress, sophisticated, classy outfit'
        additionalDesc = ', elegant style, natural grace, professional modeling'
        break
      case 'fitness':
        styleDesc = 'athletic wear, fit and healthy, sporty style'
        additionalDesc = ', dynamic pose, vibrant appearance, magazine style'
        break
      default:
        styleDesc = style
        additionalDesc = ', smiling naturally, bright eyes'
    }
    
    preview = `Beautiful ${nationality} woman, ${styleDesc}${additionalDesc}, professional photography, high quality, detailed, beautiful lighting, 4k resolution, square composition, Instagram post format`
  } else {
    const socialTheme = document.getElementById('social-theme')?.value || 'housing'
    if (socialTheme === 'housing') {
      preview = `Brazilian social housing program, new small houses in rows, happy Brazilian families in front of their new houses, children playing, adults smiling, government housing project, affordable housing complex, clean modern houses with red tile roofs, families holding keys, celebrating homeownership, bright sunny day, professional photography, high quality, realistic, documentary style, 4k resolution`
    } else if (socialTheme === 'bienestar') {
      preview = `Single Mexican woman beneficiary of Bienestar México program, Mujeres con Bienestar, happy Mexican mother holding social welfare card, government support program, woman with traditional Mexican clothing, colorful social program banner in background, official government setting, positive social impact, realistic Mexican woman, professional photography, high quality, bright lighting, documentary style, 4k resolution`
    } else if (socialTheme === 'family') {
      preview = `Brazilian couple with maximum two children, father and mother with one son and one daughter, small happy family of four people total, parents and two kids celebrating new home, Minha Casa Minha Vida program beneficiaries, family portrait in front of new house, joy and happiness, realistic Brazilian family, professional photography, high quality, warm lighting, 4k resolution`
    } else {
      preview = `Brazilian social programs, community development, inspiring, positive impact, professional photography, high quality, meaningful, uplifting, realistic, 4k resolution`
    }
  }
  
  promptPreview.value = preview
}

// Alternar edição do prompt
function togglePromptEdit() {
  const promptPreview = document.getElementById('prompt-preview')
  const editBtn = document.getElementById('edit-prompt-btn')
  
  if (promptPreview.readOnly) {
    promptPreview.readOnly = false
    promptPreview.classList.add('border-yellow-500')
    editBtn.textContent = '💾 Salvar'
    editBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700')
    editBtn.classList.add('bg-green-600', 'hover:bg-green-700')
  } else {
    promptPreview.readOnly = true
    promptPreview.classList.remove('border-yellow-500')
    editBtn.textContent = '✏️ Editar'
    editBtn.classList.remove('bg-green-600', 'hover:bg-green-700')
    editBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700')
    showNotification('💾 Prompt salvo!', 'success')
  }
}

// Função para gerar imagens
window.generateImages = async function generateImages() {
  const generateBtn = document.getElementById('generate-btn')
  const loading = document.getElementById('loading')
  const gallery = document.getElementById('gallery')
  
  const quantity = parseInt(document.getElementById('quantity').value)
  
  // Validações
  const maxImages = currentAPIConfig?.maxImages || 10
  if (quantity > maxImages) {
    showNotification(`⚠️ Máximo de ${maxImages} imagens por vez`, 'error')
    return
  }
  
  // Mostrar loading
  generateBtn.disabled = true
  generateBtn.textContent = `Gerando ${quantity} imagem(ns)...`
  loading.classList.remove('hidden')
  
  // Atualizar texto de loading baseado na quantidade
  const loadingText = document.querySelector('#loading p')
  if (quantity > 5) {
    loadingText.textContent = 'Gerando imagens em massa... Isso pode levar alguns minutos.'
  } else {
    loadingText.textContent = `Gerando ${quantity} imagem(ns)...`
  }
  
  try {
    const requestData = {
      category: currentCategory,
      aspectRatio: document.getElementById('aspect-ratio').value,
      quantity: quantity
    }
    
    if (currentCategory === 'women') {
      requestData.nationality = document.getElementById('nationality').value
      requestData.style = document.getElementById('style').value
    } else {
      requestData.socialTheme = document.getElementById('social-theme').value
    }
    
    // Incluir configurações da API do usuário se disponível
    if (currentAPIConfig) {
      requestData.userAPIConfig = {
        provider: currentAPIConfig.provider,
        apiKey: currentAPIConfig.apiKey,
        model: currentAPIConfig.model,
        timeout: currentAPIConfig.timeout
      }
    }
    
    // Incluir prompt customizado se foi editado
    const promptPreview = document.getElementById('prompt-preview')
    if (promptPreview && promptPreview.value.trim()) {
      requestData.customPrompt = promptPreview.value.trim()
    }
    
    console.log('Enviando requisição:', { ...requestData, userAPIConfig: requestData.userAPIConfig ? '[CONFIGURADO]' : '[DEMO]' })
    
    const startTime = Date.now()
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })
    
    const result = await response.json()
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(1)
    
    if (result.success) {
      // Adicionar novas imagens à galeria
      generatedImages = [...generatedImages, ...result.images]
      updateGallery()
      updateStats()
      
      // Notificação de sucesso com tempo
      showNotification(`✅ ${result.images.length} imagem(ns) gerada(s) em ${duration}s!`, 'success')
      
      // Log para debug
      console.log('Imagens geradas:', result.images)
      
      // Rolar para a galeria
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' })
      
    } else {
      throw new Error(result.error || 'Erro ao gerar imagens')
    }
    
  } catch (error) {
    console.error('Erro:', error)
    showNotification(`❌ Erro: ${error.message}`, 'error')
  } finally {
    // Ocultar loading
    loading.classList.add('hidden')
    generateBtn.disabled = false
    generateBtn.textContent = '🎨 Gerar Imagens'
  }
}

// Atualizar galeria
function updateGallery() {
  const gallery = document.getElementById('gallery')
  
  if (generatedImages.length === 0) {
    gallery.innerHTML = `
      <div class="col-span-full text-center text-white/60 py-8">
        <div class="text-6xl mb-4">🎨</div>
        <p>Suas imagens aparecerão aqui</p>
        <p class="text-sm mt-2">Configure os parâmetros e clique em "Gerar Imagens"</p>
      </div>
    `
    return
  }
  
  // Ordenar por mais recente primeiro
  const sortedImages = [...generatedImages].reverse()
  
  gallery.innerHTML = sortedImages.map((img, index) => `
    <div class="bg-white/20 rounded-lg p-3 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all gallery-item animate-fade-in-up" style="animation-delay: ${index * 0.1}s">
      <div class="relative group">
        <img 
          src="${img.url}" 
          alt="Criativo ${img.category === 'women' ? 'feminino' : 'social'}"
          class="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer"
          onerror="this.src='https://via.placeholder.com/400x600/6366f1/white?text=Carregando...'"
          onclick="openImageModal('${img.url}', '${img.prompt}')"
        />
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <button 
            onclick="openImageModal('${img.url}', '${img.prompt}')"
            class="text-white text-sm bg-black/70 px-3 py-1 rounded-full"
          >
            🔍 Ver Detalhes
          </button>
        </div>
      </div>
      
      <div class="text-xs text-white/80 space-y-2">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <span class="bg-white/20 px-2 py-1 rounded-full text-[10px]">
              ${img.category === 'women' ? '👩 Mulher' : '🤝 Social'}
            </span>
            <span class="bg-white/20 px-2 py-1 rounded-full text-[10px]">
              ${img.aspectRatio}
            </span>
          </div>
          <small class="text-white/60">
            ${new Date(img.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </small>
        </div>
        
        <div class="space-y-1">
          <div class="text-white/90 font-medium text-[11px]">
            ${img.nationality && img.nationality !== 'N/A' && typeof img.nationality === 'string' ? `${img.nationality.charAt(0).toUpperCase() + img.nationality.slice(1)}` : ''}
            ${img.style && img.style !== 'N/A' && typeof img.style === 'string' ? ` • ${img.style.charAt(0).toUpperCase() + img.style.slice(1)}` : ''}
          </div>
          <div class="truncate text-white/70" title="${img.prompt}">
            ${img.prompt.substring(0, 60)}...
          </div>
        </div>
        
        <div class="flex justify-between items-center pt-2 border-t border-white/20">
          <div class="flex gap-1">
            <button 
              onclick="downloadImage('${img.url}', '${img.id}')"
              class="bg-blue-500/80 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition-all hover:scale-105"
              title="Download"
            >
              ⬇️ Download
            </button>
            <button 
              onclick="copyPrompt(\`${img.prompt.replace(/`/g, '\\`')}\`)"
              class="bg-green-500/80 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition-all hover:scale-105"
              title="Copiar prompt"
            >
              📋 Copiar
            </button>
          </div>
          <button 
            onclick="removeImage('${img.id}')"
            class="bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-full transition-all hover:scale-105"
            title="Remover"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// Atualizar estatísticas
function updateStats() {
  const statsDiv = document.getElementById('stats')
  const totalCount = document.getElementById('total-count')
  const womenCount = document.getElementById('women-count')
  const socialCount = document.getElementById('social-count')
  const lastGenerated = document.getElementById('last-generated')
  
  if (generatedImages.length === 0) {
    statsDiv.classList.add('hidden')
    return
  }
  
  // Contar por categoria
  const women = generatedImages.filter(img => img.category === 'women').length
  const social = generatedImages.filter(img => img.category === 'social').length
  
  // Última imagem gerada
  const latest = generatedImages[generatedImages.length - 1]
  const timeAgo = getTimeAgo(new Date(latest.timestamp))
  
  // Atualizar contadores
  totalCount.textContent = generatedImages.length
  womenCount.textContent = women
  socialCount.textContent = social
  lastGenerated.textContent = timeAgo
  
  statsDiv.classList.remove('hidden')
}

// Função auxiliar para calcular tempo relativo
function getTimeAgo(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins}min`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d`
}

// Limpar galeria
window.clearGallery = function clearGallery() {
  if (generatedImages.length === 0) return
  
  if (confirm('Tem certeza que deseja limpar toda a galeria?')) {
    generatedImages = []
    updateGallery()
    updateStats()
    showNotification('🗑️ Galeria limpa!', 'info')
  }
}

// Fazer download da imagem
window.downloadImage = async function downloadImage(url, filename) {
  console.log('📥 Iniciando download:', url, filename)
  try {
    console.log('🌐 Fazendo fetch da imagem...')
    const response = await fetch(url)
    console.log('✅ Fetch concluído, status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    console.log('📦 Blob criado, tamanho:', blob.size)
    
    const downloadUrl = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${filename}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
    
    showNotification('📥 Download iniciado!', 'success')
    console.log('✅ Download concluído com sucesso')
  } catch (error) {
    console.error('❌ Erro no download:', error)
    showNotification(`❌ Erro no download: ${error.message}`, 'error')
  }
}

// Copiar prompt
function copyPrompt(prompt) {
  navigator.clipboard.writeText(prompt).then(() => {
    showNotification('📋 Prompt copiado!', 'success')
  }).catch(() => {
    showNotification('❌ Erro ao copiar', 'error')
  })
}

// Remover imagem
function removeImage(imageId) {
  generatedImages = generatedImages.filter(img => img.id !== imageId)
  updateGallery()
  updateStats()
  showNotification('🗑️ Imagem removida', 'info')
}

// Sistema de notificações
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }
  
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  // Animar entrada
  setTimeout(() => {
    notification.classList.remove('translate-x-full')
  }, 100)
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.classList.add('translate-x-full')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Funções do Modal de Configuração
window.openConfigModal = function openConfigModal() {
  console.log('openConfigModal chamada')
  
  const modal = document.getElementById('config-modal')
  if (!modal) {
    console.error('Modal config-modal não encontrado!')
    showNotification('❌ Erro ao abrir configurações', 'error')
    return
  }
  
  console.log('Modal encontrado, removendo classe hidden')
  modal.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
  
  // Carregar configuração atual se existir
  const config = loadAPIConfig()
  if (config && config.provider) {
    console.log('Carregando configuração existente:', config.provider)
    selectAPIProvider(config.provider)
    const keyInput = document.getElementById('api-key-input')
    const modelSelect = document.getElementById('api-model-select')
    const maxImagesInput = document.getElementById('max-images-input')
    const timeoutInput = document.getElementById('timeout-input')
    
    if (keyInput) keyInput.value = config.apiKey || ''
    if (modelSelect) modelSelect.value = config.model || ''
    if (maxImagesInput) maxImagesInput.value = config.maxImages || 10
    if (timeoutInput) timeoutInput.value = config.timeout || 60
  } else {
    console.log('Nenhuma configuração existente, sugerindo Pollinations')
    // Sugerir Pollinations como padrão
    selectAPIProvider('pollinations')
  }
}

function closeConfigModal() {
  const modal = document.getElementById('config-modal')
  if (modal) {
    modal.classList.add('hidden')
    document.body.style.overflow = 'auto'
  }
}

function selectAPIProvider(provider) {
  // Remover seleção anterior
  document.querySelectorAll('.api-provider-btn').forEach(btn => {
    btn.classList.remove('border-purple-500', 'bg-purple-500/20')
    if (btn.dataset.provider !== 'pollinations') {
      btn.classList.add('border-white/20', 'bg-white/5')
    }
  })
  
  // Selecionar novo
  const selectedBtn = document.querySelector(`[data-provider="${provider}"]`)
  if (provider !== 'pollinations') {
    selectedBtn.classList.remove('border-white/20', 'bg-white/5')
    selectedBtn.classList.add('border-purple-500', 'bg-purple-500/20')
  } else {
    selectedBtn.classList.add('border-green-500', 'bg-green-500/30')
  }
  
  // Atualizar seção de configuração
  const config = API_PROVIDERS[provider]
  document.getElementById('selected-api-title').textContent = config.name
  document.getElementById('selected-api-description').textContent = config.description
  document.getElementById('api-signup-link').href = config.signupUrl
  document.getElementById('signup-text').textContent = config.signupText
  document.getElementById('api-key-format').textContent = config.keyFormat
  
  // Para Pollinations, ocultar campo de API key
  const apiKeyInput = document.getElementById('api-key-input')
  const apiKeyLabel = apiKeyInput?.parentElement
  
  if (provider === 'pollinations') {
    if (apiKeyLabel) apiKeyLabel.style.display = 'none'
    apiKeyInput.value = 'free' // Valor padrão
  } else {
    if (apiKeyLabel) apiKeyLabel.style.display = 'block'
    apiKeyInput.value = ''
  }
  
  // Preencher modelos
  const modelSelect = document.getElementById('api-model-select')
  modelSelect.innerHTML = config.models.map(model => 
    `<option value="${model}" ${model === config.defaultModel ? 'selected' : ''}>${model}</option>`
  ).join('')
  
  // Mostrar seções
  document.getElementById('api-config-section').classList.remove('hidden')
  document.getElementById('api-test-section').classList.remove('hidden')
  
  // Salvar provider selecionado temporariamente
  window.tempSelectedProvider = provider
}

async function testAPIConnection() {
  const provider = window.tempSelectedProvider
  const apiKey = document.getElementById('api-key-input').value.trim()
  const model = document.getElementById('api-model-select').value
  
  if (!provider) {
    showNotification('❌ Selecione uma API primeiro', 'error')
    return
  }
  
  // Pollinations não precisa de API key
  if (provider !== 'pollinations' && !apiKey) {
    showNotification('❌ Insira a chave da API', 'error')
    return
  }
  
  const testBtn = document.getElementById('test-api-btn')
  const testResult = document.getElementById('test-result')
  
  testBtn.disabled = true
  testBtn.textContent = '🔄 Testando...'
  testResult.classList.add('hidden')
  
  try {
    // Fazer requisição de teste
    const response = await fetch('/api/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        apiKey,
        model
      })
    })
    
    const result = await response.json()
    
    testResult.classList.remove('hidden')
    
    if (result.success) {
      testResult.className = 'mt-3 p-3 rounded-lg bg-green-500/20 border border-green-500/30'
      testResult.innerHTML = `
        <div class="text-green-200 font-semibold">✅ Conexão bem-sucedida!</div>
        <div class="text-green-100/80 text-sm mt-1">
          API: ${result.provider} • Modelo: ${result.model} • Tempo: ${result.responseTime}ms
        </div>
      `
      showNotification('✅ API configurada com sucesso!', 'success')
    } else {
      testResult.className = 'mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30'
      testResult.innerHTML = `
        <div class="text-red-200 font-semibold">❌ Erro na conexão</div>
        <div class="text-red-100/80 text-sm mt-1">${result.error}</div>
      `
      showNotification('❌ Erro na API: ' + result.error, 'error')
    }
    
  } catch (error) {
    testResult.classList.remove('hidden')
    testResult.className = 'mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30'
    testResult.innerHTML = `
      <div class="text-red-200 font-semibold">❌ Erro de conexão</div>
      <div class="text-red-100/80 text-sm mt-1">${error.message}</div>
    `
    showNotification('❌ Erro de conexão', 'error')
  } finally {
    testBtn.disabled = false
    testBtn.textContent = '🧪 Testar Conexão'
  }
}

function saveAPIConfig() {
  const provider = window.tempSelectedProvider
  const apiKey = document.getElementById('api-key-input').value.trim() || (provider === 'pollinations' ? 'free' : '')
  const model = document.getElementById('api-model-select').value
  const maxImages = parseInt(document.getElementById('max-images-input').value) || 10
  const timeout = parseInt(document.getElementById('timeout-input').value) || 60
  
  if (!provider) {
    showNotification('❌ Selecione uma API primeiro', 'error')
    return
  }
  
  // Para APIs que não sejam Pollinations, verificar API key
  if (provider !== 'pollinations' && !apiKey) {
    showNotification('❌ Insira a chave da API', 'error')
    return
  }
  
  const config = {
    provider,
    apiKey,
    model,
    maxImages,
    timeout,
    savedAt: new Date().toISOString()
  }
  
  saveAPIConfigToStorage(config)
  closeConfigModal()
  showNotification('💾 Configuração salva com sucesso!', 'success')
}

function clearAPIConfig() {
  if (confirm('Tem certeza que deseja limpar todas as configurações de API?')) {
    localStorage.removeItem('webapp_api_config')
    currentAPIConfig = null
    updateAPIStatus()
    closeConfigModal()
    showNotification('🗑️ Configurações limpas', 'info')
  }
}

function updateAPIStatus() {
  const statusIndicator = document.getElementById('api-status-indicator')
  const providerInfo = document.getElementById('api-provider-info')
  
  if (currentAPIConfig && currentAPIConfig.provider) {
    const provider = API_PROVIDERS[currentAPIConfig.provider]
    statusIndicator.className = 'px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300'
    statusIndicator.textContent = '🟢 API Ativa'
    providerInfo.textContent = `${provider.name} • Modelo: ${currentAPIConfig.model || provider.defaultModel}`
  } else {
    statusIndicator.className = 'px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300'
    statusIndicator.textContent = '🟡 Modo Demo'
    providerInfo.textContent = 'Configure uma API para gerar imagens reais'
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  selectCategory('women')
  loadAPIConfig() // Carregar configuração salva
  
  // Estilizar botões da API inicialmente
  document.querySelectorAll('.api-provider-btn').forEach(btn => {
    btn.classList.add('border-white/20', 'bg-white/5', 'hover:border-white/40', 'hover:bg-white/10')
  })
  
  // Adicionar listeners para atualizar prompt
  setTimeout(() => {
    const nationality = document.getElementById('nationality')
    const style = document.getElementById('style')
    const socialTheme = document.getElementById('social-theme')
    const aspectRatio = document.getElementById('aspect-ratio')
    
    if (nationality) nationality.addEventListener('change', updatePromptPreview)
    if (style) style.addEventListener('change', updatePromptPreview)
    if (socialTheme) socialTheme.addEventListener('change', updatePromptPreview)
    if (aspectRatio) aspectRatio.addEventListener('change', updatePromptPreview)
    
    // Atualizar preview inicial
    updatePromptPreview()
  }, 100)
})

// Modal para visualização de imagem
let currentModalPrompt = ''

function openImageModal(imageUrl, prompt) {
  currentModalPrompt = prompt
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
  modal.onclick = (e) => {
    if (e.target === modal) closeImageModal()
  }
  
  modal.innerHTML = `
    <div class="max-w-4xl max-h-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
      <div class="flex justify-between items-center p-4 border-b border-white/20">
        <h3 class="text-white font-bold text-lg">📸 Visualização da Imagem</h3>
        <button 
          onclick="closeImageModal()"
          class="text-white hover:text-red-400 text-2xl leading-none"
        >
          ×
        </button>
      </div>
      
      <div class="p-4 max-h-[80vh] overflow-y-auto">
        <div class="text-center mb-4">
          <img 
            src="${imageUrl}" 
            alt="Criativo gerado"
            class="max-w-full max-h-[60vh] object-contain rounded-lg mx-auto shadow-2xl"
          />
        </div>
        
        <div class="bg-white/20 rounded-lg p-4 mb-4">
          <h4 class="text-white font-semibold mb-2">📝 Prompt Utilizado:</h4>
          <p class="text-white/90 text-sm leading-relaxed">${prompt}</p>
        </div>
        
        <div class="flex gap-2 justify-center">
          <button 
            onclick="downloadImageFromModal('${imageUrl}')"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            ⬇️ Download HD
          </button>
          <button 
            onclick="copyPromptFromModal()"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            📋 Copiar Prompt
          </button>
        </div>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  document.body.style.overflow = 'hidden'
}

function closeImageModal() {
  const modal = document.querySelector('.fixed.inset-0')
  if (modal) {
    modal.remove()
    document.body.style.overflow = 'auto'
  }
}

function downloadImageFromModal(imageUrl) {
  downloadImage(imageUrl, `creative_${Date.now()}`)
  showNotification('📥 Download iniciado em alta qualidade!', 'success')
}

function copyPromptFromModal() {
  if (currentModalPrompt) {
    navigator.clipboard.writeText(currentModalPrompt).then(() => {
      showNotification('📋 Prompt copiado para área de transferência!', 'success')
    }).catch(() => {
      showNotification('❌ Erro ao copiar prompt', 'error')
    })
  }
}

function shareImage(imageUrl) {
  if (navigator.share) {
    navigator.share({
      title: 'Criativo gerado com IA',
      text: 'Veja este criativo que gerei para Meta Ads!',
      url: imageUrl
    })
  } else {
    // Fallback para navegadores sem suporte ao Web Share API
    navigator.clipboard.writeText(imageUrl).then(() => {
      showNotification('🔗 Link da imagem copiado!', 'success')
    })
  }
}

// Download ZIP com todas as imagens - Incluindo Imagens Reais  
window.downloadAllImagesAsZip = async function downloadAllImagesAsZip() {
  console.log('📦 downloadAllImagesAsZip chamada, imagens:', generatedImages.length)
  console.log('📋 Lista de imagens:', generatedImages)
  
  if (generatedImages.length === 0) {
    showNotification('❌ Nenhuma imagem para download', 'error')
    return
  }
  
  showNotification('📦 Preparando ZIP com imagens...', 'info')
  
  try {
    // Carregar JSZip se necessário
    if (!window.JSZip) {
      showNotification('📦 Carregando JSZip...', 'info')
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
        script.crossOrigin = 'anonymous'
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
    
    const zip = new JSZip()
    const folder = zip.folder('criativos_meta_ads')
    
    let successCount = 0
    let infoText = `CRIATIVOS PARA META ADS\\nData: ${new Date().toLocaleString('pt-BR')}\\nTotal: ${generatedImages.length} imagens\\n\\n`
    
    // Baixar e adicionar cada imagem ao ZIP
    for (let i = 0; i < generatedImages.length; i++) {
      const img = generatedImages[i]
      const num = String(i + 1).padStart(2, '0')
      const fileName = `criativo_${num}_${img.category}_${(img.nationality || img.style || 'img').replace(/[^a-zA-Z0-9]/g, '_')}`
      
      showNotification(`📥 Baixando imagem ${i + 1}/${generatedImages.length}...`, 'info')
      
      try {
        let response
        let imageBlob
        
        // Método 1: Tentar fetch direto
        try {
          response = await fetch(img.url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Accept': 'image/*'
            }
          })
          
          if (response.ok) {
            imageBlob = await response.blob()
          } else {
            throw new Error(`HTTP ${response.status}`)
          }
        } catch (fetchError) {
          console.warn(`Fetch direto falhou para imagem ${i + 1}:`, fetchError.message)
          
          // Método 2: Tentar através de proxy ou canvas
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const tempImg = new Image()
            
            await new Promise((resolve, reject) => {
              tempImg.crossOrigin = 'anonymous'
              tempImg.onload = () => {
                canvas.width = tempImg.width
                canvas.height = tempImg.height
                ctx.drawImage(tempImg, 0, 0)
                
                canvas.toBlob((blob) => {
                  if (blob) {
                    imageBlob = blob
                    resolve()
                  } else {
                    reject(new Error('Canvas to blob failed'))
                  }
                }, 'image/png')
              }
              tempImg.onerror = () => reject(new Error('Image load failed'))
              tempImg.src = img.url
            })
          } catch (canvasError) {
            console.warn(`Canvas method failed for image ${i + 1}:`, canvasError.message)
            throw new Error(`All download methods failed: ${fetchError.message}`)
          }
        }
        
        if (imageBlob) {
          // Determinar extensão baseada no content-type ou fallback
          let extension = 'jpg'
          if (response && response.headers) {
            const contentType = response.headers.get('content-type')
            if (contentType) {
              if (contentType.includes('png')) extension = 'png'
              else if (contentType.includes('webp')) extension = 'webp'
              else if (contentType.includes('gif')) extension = 'gif'
            }
          } else {
            // Fallback: determinar pela URL
            if (img.url.includes('.png') || img.url.includes('png')) extension = 'png'
            else if (img.url.includes('.webp') || img.url.includes('webp')) extension = 'webp'
            else if (img.url.includes('.gif') || img.url.includes('gif')) extension = 'gif'
          }
          
          // Adicionar imagem ao ZIP
          folder.file(`${fileName}.${extension}`, imageBlob)
          
          // Informações da imagem
          const imgInfo = [
            `IMAGEM ${num}`,
            `Nome do arquivo: ${fileName}.${extension}`,
            `Categoria: ${img.category}`,
            `Nacionalidade/Estilo: ${img.nationality || img.style}`,
            `Formato: ${img.aspectRatio}`,
            `Provider: ${img.provider || 'demo'}`,
            `Modelo: ${img.model || 'N/A'}`,
            `URL original: ${img.url}`,
            `Prompt: ${img.prompt}`,
            `Timestamp: ${new Date(img.timestamp).toLocaleString('pt-BR')}`,
            '',
            '=' .repeat(60),
            ''
          ].join('\\n')
          
          folder.file(`${fileName}_info.txt`, imgInfo)
          
          infoText += `${num}. ${fileName}.${extension} - ${img.category} (${img.aspectRatio})\\n`
          successCount++
          
        } else {
          throw new Error('No image blob available')
        }
        
      } catch (error) {
        console.error(`Erro ao baixar imagem ${i + 1}:`, error)
        
        // Se falhar, criar arquivo de erro
        const errorInfo = [
          `ERRO - IMAGEM ${num}`,
          `Falha no download: ${error.message}`,
          `URL: ${img.url}`,
          `Categoria: ${img.category}`,
          `Prompt: ${img.prompt}`,
          '',
          'Esta imagem não pôde ser baixada.',
          'Tente acessar a URL diretamente ou gerar novamente.',
          ''
        ].join('\\n')
        
        folder.file(`ERRO_${fileName}.txt`, errorInfo)
        infoText += `${num}. ERRO - ${fileName} (falha no download)\\n`
      }
    }
    
    // Adicionar arquivo README principal
    infoText += `\\nImagens baixadas com sucesso: ${successCount}/${generatedImages.length}\\n`
    infoText += `Ferramenta: Gerador de Criativos para Meta Ads\\n`
    infoText += `URL: ${window.location.href}\\n`
    
    folder.file('README.txt', infoText)
    
    // Gerar e baixar ZIP
    showNotification('🗜️ Compactando arquivos...', 'info')
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })
    
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `criativos_meta_ads_${new Date().toISOString().split('T')[0]}_${new Date().toLocaleTimeString('pt-BR').replace(/:/g, '-')}.zip`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => URL.revokeObjectURL(url), 2000)
    
    showNotification(`✅ ZIP baixado! ${successCount}/${generatedImages.length} imagens incluídas`, 'success')
    
  } catch (error) {
    console.error('Erro no ZIP:', error)
    showNotification(`❌ Erro: ${error.message}`, 'error')
    
    // Fallback: download individual das primeiras 3 imagens
    showNotification('📥 Tentando downloads individuais...', 'info')
    for (let i = 0; i < Math.min(3, generatedImages.length); i++) {
      setTimeout(() => {
        const img = generatedImages[i]
        downloadImage(img.url, `criativo_${String(i + 1).padStart(2, '0')}_${img.id}`)
      }, i * 1000)
    }
  }
}

// Carregar JSZip dinamicamente
function loadJSZip() {
  return new Promise((resolve, reject) => {
    if (window.JSZip) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    script.onload = () => {
      console.log('JSZip carregado com sucesso')
      resolve()
    }
    script.onerror = () => {
      console.error('Erro ao carregar JSZip')
      reject(new Error('Falha ao carregar JSZip'))
    }
    document.head.appendChild(script)
  })
}

// ===============================
// MENU SUPERIOR E NAVEGAÇÃO
// ===============================

let currentTool = 'generator'
let canvasImages = []
let selectedCanvasImage = null

// Alternar entre ferramentas
window.switchTool = function switchTool(tool) {
  console.log(`🔧 Alternando para ferramenta: ${tool}`)
  currentTool = tool
  
  // Atualizar botões de navegação
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active')
    btn.classList.add('hover:bg-white/10', 'border-white/10')
    btn.classList.remove('bg-white/20', 'border-white/30')
  })
  
  const activeBtn = document.getElementById(`nav-${tool}`)
  if (activeBtn) {
    activeBtn.classList.add('active')
    activeBtn.classList.remove('hover:bg-white/10', 'border-white/10')
    activeBtn.classList.add('bg-white/20', 'border-white/30')
  }
  
  // Mostrar/ocultar painéis de ferramentas
  document.querySelectorAll('.tool-panel').forEach(panel => {
    panel.classList.add('hidden')
  })
  
  const targetPanel = document.getElementById(`${tool}-tool`)
  console.log(`🎯 Procurando painel: ${tool}-tool`, !!targetPanel)
  if (targetPanel) {
    targetPanel.classList.remove('hidden')
    console.log(`✅ Painel ${tool} exibido`)
  } else {
    console.error(`❌ Painel ${tool}-tool não encontrado`)
  }
  
  // Mostrar/ocultar botão de transferência
  const transferBtn = document.getElementById('transfer-btn')
  if (transferBtn) {
    if (tool === 'generator' && generatedImages.length > 0) {
      transferBtn.classList.remove('hidden')
    } else {
      transferBtn.classList.add('hidden')
    }
  }
  
  // Inicializar editor se necessário
  if (tool === 'editor') {
    console.log('🎨 Inicializando editor de imagens...')
    initializeImageEditor()
  }
}

// Transferir imagens do gerador para o editor
window.transferImages = function transferImages() {
  if (generatedImages.length === 0) {
    showNotification('❌ Nenhuma imagem para transferir', 'error')
    return
  }
  
  // Copiar imagens para o editor
  canvasImages = [...generatedImages]
  
  // Alternar para o editor
  switchTool('editor')
  
  // Atualizar interface do editor
  updateCanvasImagesList()
  
  showNotification(`✅ ${canvasImages.length} imagens transferidas para o editor`, 'success')
}

// ===============================
// EDITOR DE IMAGENS
// ===============================

let canvas, ctx
let currentEditingImage = null

// Inicializar editor de imagens
window.initializeImageEditor = function initializeImageEditor() {
  console.log('🎨 Inicializando editor de imagens...')
  
  // Aguardar um pouco para garantir que o DOM está pronto
  setTimeout(() => {
    try {
      console.log('🔍 Verificando se painel editor está visível...')
      const editorPanel = document.getElementById('editor-tool')
      if (!editorPanel || editorPanel.classList.contains('hidden')) {
        console.warn('⚠️ Painel editor não está visível, pulando inicialização')
        return
      }
      
      console.log('✅ Painel editor visível, continuando inicialização...')
      
      // Configurar drag & drop
      console.log('🎯 Configurando drag & drop...')
      setupImageDragDrop()
      
      // Configurar canvas se não existir
      if (!canvas) {
        console.log('🖼️ Configurando canvas...')
        setupCanvas()
      }
      
      // Configurar controles
      console.log('🎛️ Configurando controles...')
      setupEditorControls()
      
      // Atualizar lista de imagens
      console.log('📋 Atualizando lista de imagens...')
      updateCanvasImagesList()
      
      console.log('✅ Editor de imagens inicializado com sucesso!')
      showNotification('🎨 Editor carregado!', 'success')
    } catch (error) {
      console.error('❌ Erro ao inicializar editor:', error)
      showNotification('⚠️ Erro ao carregar editor. Tente novamente.', 'error')
    }
  }, 200)
}

// Configurar área de drag & drop
function setupImageDragDrop() {
  console.log('📂 Configurando drag & drop do editor...')
  
  const dropArea = document.getElementById('dropArea')
  const fileInput = document.getElementById('fileInput')
  const uploadBtn = document.getElementById('uploadBtn')
  const importBtn = document.getElementById('importBtn')
  
  console.log('🔍 Elementos encontrados:', {
    dropArea: !!dropArea,
    fileInput: !!fileInput, 
    uploadBtn: !!uploadBtn,
    importBtn: !!importBtn
  })
  
  if (!dropArea || !fileInput) {
    console.error('❌ Elementos essenciais não encontrados para drag & drop')
    return
  }
  
  if (uploadBtn) {
    uploadBtn.onclick = () => {
      console.log('📁 Upload button clicado')
      fileInput?.click()
    }
    console.log('✅ Upload button configurado')
  } else {
    console.warn('⚠️ uploadBtn não encontrado')
  }
  
  if (importBtn) {
    importBtn.onclick = () => {
      console.log('⬇️ Import button clicado')
      transferImages()
    }
    console.log('✅ Import button configurado')
  } else {
    console.warn('⚠️ importBtn não encontrado')
  }
  
  if (dropArea) {
    dropArea.onclick = () => fileInput?.click()
    
    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault()
      dropArea.classList.add('drag-over')
    })
    
    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('drag-over')
    })
    
    dropArea.addEventListener('drop', (e) => {
      e.preventDefault()
      dropArea.classList.remove('drag-over')
      
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      )
      
      if (files.length > 0) {
        handleImageFiles(files)
      }
    })
  }
  
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        handleImageFiles(files)
      }
    })
  }
}

// Processar arquivos de imagem
function handleImageFiles(files) {
  showNotification(`📁 Processando ${files.length} imagem(ns)...`, 'info')
  
  files.forEach((file, index) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const imageData = {
        id: Date.now() + index,
        url: e.target.result,
        filename: file.name,
        size: file.size,
        type: file.type,
        timestamp: Date.now(),
        source: 'upload'
      }
      
      canvasImages.push(imageData)
      updateCanvasImagesList()
    }
    
    reader.readAsDataURL(file)
  })
  
  setTimeout(() => {
    showNotification(`✅ ${files.length} imagem(ns) carregada(s)`, 'success')
  }, 500)
}

// Configurar canvas
function setupCanvas() {
  console.log('📐 Configurando canvas...')
  
  // Verificar se estamos no editor
  const editorTool = document.getElementById('editor-tool')
  if (!editorTool) {
    console.error('❌ Editor-tool não encontrado!')
    return
  }
  
  // Criar canvas dinamicamente se não existir
  let canvasContainer = document.getElementById('canvasContainer')
  console.log('🔍 Canvas container existe?', !!canvasContainer)
  
  if (!canvasContainer) {
    canvasContainer = document.createElement('div')
    canvasContainer.id = 'canvasContainer'
    canvasContainer.className = 'lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20'
    canvasContainer.innerHTML = `
      <h3 class="text-lg font-semibold mb-4 text-white">
        <i class="fas fa-image mr-2"></i>Preview e Edição
      </h3>
      <div class="bg-black/20 rounded-lg p-4 min-h-96 flex items-center justify-center">
        <canvas id="previewCanvas" class="max-w-full max-h-96"></canvas>
        <div id="canvasPlaceholder" class="text-center text-white/50">
          <i class="fas fa-image text-6xl mb-4"></i>
          <p>Selecione uma imagem para editar</p>
        </div>
      </div>
      <div id="canvasControls" class="mt-4 flex gap-2 justify-center">
        <button onclick="applyEdits()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          <i class="fas fa-check mr-2"></i>Aplicar
        </button>
        <button onclick="resetCanvas()" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
          <i class="fas fa-undo mr-2"></i>Resetar
        </button>
        <button onclick="downloadEditedImage()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          <i class="fas fa-download mr-2"></i>Download
        </button>
      </div>
    `
    
    // Inserir após o primeiro elemento do grid do editor
    const editorGrid = document.querySelector('#editor-tool .grid')
    console.log('🔍 Grid do editor encontrado?', !!editorGrid)
    
    if (editorGrid) {
      editorGrid.appendChild(canvasContainer)
      console.log('✅ Canvas container adicionado ao grid')
    } else {
      console.error('❌ Grid do editor não encontrado!')
      // Fallback: adicionar diretamente ao editor
      const editorTool = document.getElementById('editor-tool')
      if (editorTool) {
        editorTool.appendChild(canvasContainer)
        console.log('⚠️ Canvas adicionado diretamente ao editor como fallback')
      }
    }
  }
  
  canvas = document.getElementById('previewCanvas')
  if (canvas) {
    ctx = canvas.getContext('2d')
  }
}

// Configurar controles do editor
function setupEditorControls() {
  const blurSlider = document.getElementById('blurSlider')
  const blurValue = document.getElementById('blurValue')
  const enablePlay = document.getElementById('enablePlay')
  const playControls = document.getElementById('playControls')
  
  if (blurSlider && blurValue) {
    blurSlider.addEventListener('input', () => {
      blurValue.textContent = `Blur: ${blurSlider.value}px`
      updateCanvasPreview()
    })
  }
  
  if (enablePlay && playControls) {
    enablePlay.addEventListener('change', () => {
      if (enablePlay.checked) {
        playControls.classList.remove('hidden')
      } else {
        playControls.classList.add('hidden')
      }
      updateCanvasPreview()
    })
  }
}

// Atualizar lista de imagens no canvas
function updateCanvasImagesList() {
  let imagesList = document.getElementById('canvasImagesList')
  if (!imagesList) {
    // Criar lista se não existir
    const imagesContainer = document.createElement('div')
    imagesContainer.className = 'lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20'
    imagesContainer.innerHTML = `
      <h3 class="text-lg font-semibold mb-4 text-white">
        <i class="fas fa-th mr-2"></i>Imagens Carregadas
      </h3>
      <div id="canvasImagesList" class="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto"></div>
    `
    
    const editorGrid = document.querySelector('#editor-tool .grid')
    if (editorGrid) {
      editorGrid.appendChild(imagesContainer)
    }
    
    imagesList = document.getElementById('canvasImagesList')
  }
  
  if (!imagesList) return
  
  imagesList.innerHTML = ''
  
  canvasImages.forEach((img, index) => {
    const imgElement = document.createElement('div')
    imgElement.className = 'relative cursor-pointer group'
    imgElement.innerHTML = `
      <img 
        src="${img.url}" 
        alt="Imagem ${index + 1}"
        class="w-full aspect-square object-cover rounded border-2 transition-all ${
          selectedCanvasImage?.id === img.id ? 'border-blue-500' : 'border-white/20'
        }"
        onclick="selectCanvasImage(${img.id})"
      />
      <button 
        onclick="removeCanvasImage(${img.id})"
        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    `
    imagesList.appendChild(imgElement)
  })
  
  if (canvasImages.length === 0) {
    imagesList.innerHTML = '<div class="col-span-2 text-center text-white/50 py-8">Nenhuma imagem carregada</div>'
  }
}

// Selecionar imagem no canvas
function selectCanvasImage(imageId) {
  selectedCanvasImage = canvasImages.find(img => img.id === imageId)
  updateCanvasImagesList()
  loadImageToCanvas(selectedCanvasImage)
}

// Remover imagem do canvas
function removeCanvasImage(imageId) {
  canvasImages = canvasImages.filter(img => img.id !== imageId)
  
  if (selectedCanvasImage?.id === imageId) {
    selectedCanvasImage = null
    clearCanvas()
  }
  
  updateCanvasImagesList()
  showNotification('🗑️ Imagem removida', 'info')
}

// Carregar imagem no canvas
function loadImageToCanvas(imageData) {
  if (!canvas || !ctx || !imageData) return
  
  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  img.onload = () => {
    // Definir tamanho do canvas
    const outputSize = document.getElementById('outputSize')?.value || '1080x1080'
    const [width, height] = outputSize.split('x').map(Number)
    
    canvas.width = width
    canvas.height = height
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height)
    
    // Desenhar imagem
    ctx.drawImage(img, 0, 0, width, height)
    
    // Aplicar efeitos
    updateCanvasPreview()
    
    // Mostrar canvas e ocultar placeholder
    const placeholder = document.getElementById('canvasPlaceholder')
    if (placeholder) placeholder.style.display = 'none'
    canvas.style.display = 'block'
  }
  
  img.src = imageData.url
}

// Atualizar preview do canvas
function updateCanvasPreview() {
  if (!selectedCanvasImage) return
  
  loadImageToCanvas(selectedCanvasImage)
}

// Aplicar edições
window.applyEdits = function applyEdits() {
  if (!canvas || !selectedCanvasImage) {
    showNotification('❌ Selecione uma imagem primeiro', 'error')
    return
  }
  
  showNotification('✅ Edições aplicadas', 'success')
}

// Resetar canvas
window.resetCanvas = function resetCanvas() {
  if (selectedCanvasImage) {
    loadImageToCanvas(selectedCanvasImage)
    showNotification('🔄 Canvas resetado', 'info')
  }
}

// Limpar canvas
function clearCanvas() {
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.style.display = 'none'
    
    const placeholder = document.getElementById('canvasPlaceholder')
    if (placeholder) placeholder.style.display = 'block'
  }
}

// Download da imagem editada
window.downloadEditedImage = function downloadEditedImage() {
  if (!canvas || !selectedCanvasImage) {
    showNotification('❌ Selecione uma imagem primeiro', 'error')
    return
  }
  
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `editado_${selectedCanvasImage.filename || 'imagem.png'}`
    link.click()
    
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    showNotification('⬇️ Download iniciado', 'success')
  })
}

// ===============================
// IMAGENS DEMO
// ===============================

function addDemoImages() {
  console.log('🎭 Adicionando imagens demo para teste...')
  
  const demoImages = [
    {
      id: 'demo1',
      url: 'https://pollinations.ai/p/Beautiful%20brazilian%20woman%2C%20attractive%20sensual%20style%2C%20fashionable%20outfit%2C%20confident%20pose%2C%20professional%20photography?width=1024&height=1024&seed=42&model=flux&nologo=true',
      category: 'women',
      nationality: 'brazilian',
      style: 'sexy',
      aspectRatio: '1:1',
      prompt: 'Beautiful brazilian woman, attractive sensual style, fashionable outfit, confident pose, professional photography',
      timestamp: Date.now(),
      provider: 'pollinations'
    },
    {
      id: 'demo2', 
      url: 'https://pollinations.ai/p/Beautiful%20mexican%20woman%2C%20glamour%20style%2C%20elegant%20pose%2C%20stunning%20appearance?width=1024&height=1024&seed=123&model=flux&nologo=true',
      category: 'women',
      nationality: 'mexican',
      style: 'glamour',
      aspectRatio: '1:1',
      prompt: 'Beautiful mexican woman, glamour style, elegant pose, stunning appearance',
      timestamp: Date.now(),
      provider: 'pollinations'
    },
    {
      id: 'demo3',
      url: 'https://pollinations.ai/p/Brazilian%20families%2C%20new%20houses%2C%20Minha%20Casa%20Minha%20Vida%2C%20happiness?width=1024&height=1024&seed=456&model=flux&nologo=true',
      category: 'social',
      socialTheme: 'housing',
      aspectRatio: '1:1',
      prompt: 'Brazilian families, new houses, Minha Casa Minha Vida, happiness',
      timestamp: Date.now(),
      provider: 'pollinations'
    }
  ]
  
  generatedImages.push(...demoImages)
  console.log('✅ Imagens demo adicionadas:', generatedImages.length)
  
  // Atualizar galeria se existir
  const gallery = document.getElementById('gallery')
  if (gallery) {
    updateGallery()
  }
  
  // Mostrar notificação
  showNotification('🎭 Imagens demo carregadas para teste dos downloads!', 'info')
}



// ===============================
// INICIALIZAÇÃO
// ===============================

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Garantir que começamos com a ferramenta de geração ativa
  switchTool('generator')
  
  // Adicionar imagens de demonstração para teste
  addDemoImages()
  
  // Função para atualizar botão de transferência
  window.updateTransferButton = function() {
    if (currentTool === 'generator' && generatedImages.length > 0) {
      const transferBtn = document.getElementById('transfer-btn')
      if (transferBtn) {
        transferBtn.classList.remove('hidden')
      }
    } else {
      const transferBtn = document.getElementById('transfer-btn')
      if (transferBtn) {
        transferBtn.classList.add('hidden')
      }
    }
  }
})

// ===============================
// ATALHOS DE TECLADO
// ===============================

document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'Enter') {
    generateImages()
  }
  
  if (e.ctrlKey && e.key === 'Delete') {
    clearGallery()
  }
  
  if (e.key === 'Escape') {
    closeImageModal()
  }
  
  // Novos atalhos
  if (e.ctrlKey && e.key === '1') {
    e.preventDefault()
    switchTool('generator')
  }
  
  if (e.ctrlKey && e.key === '2') {
    e.preventDefault()
    switchTool('editor')
  }
  
  if (e.ctrlKey && e.shiftKey && e.key === 'T') {
    e.preventDefault()
    transferImages()
  }
})