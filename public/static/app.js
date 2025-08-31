// Estado da aplicação
let currentCategory = 'women'
let generatedImages = []
let currentAPIConfig = null

// Configurações das APIs
const API_PROVIDERS = {
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
    description: 'Controle avançado e modelos customizáveis. Ideal para ajustes específicos.',
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
function selectCategory(category) {
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
}

// Função para gerar imagens
async function generateImages() {
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
            ${img.nationality !== 'N/A' ? `${img.nationality.charAt(0).toUpperCase() + img.nationality.slice(1)}` : ''}
            ${img.style !== 'N/A' ? ` • ${img.style.charAt(0).toUpperCase() + img.style.slice(1)}` : ''}
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
function clearGallery() {
  if (generatedImages.length === 0) return
  
  if (confirm('Tem certeza que deseja limpar toda a galeria?')) {
    generatedImages = []
    updateGallery()
    updateStats()
    showNotification('🗑️ Galeria limpa!', 'info')
  }
}

// Fazer download da imagem
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${filename}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
    
    showNotification('📥 Download iniciado!', 'success')
  } catch (error) {
    showNotification('❌ Erro no download', 'error')
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
function openConfigModal() {
  document.getElementById('config-modal').classList.remove('hidden')
  document.body.style.overflow = 'hidden'
  
  // Carregar configuração atual se existir
  const config = loadAPIConfig()
  if (config && config.provider) {
    selectAPIProvider(config.provider)
    document.getElementById('api-key-input').value = config.apiKey || ''
    document.getElementById('api-model-select').value = config.model || ''
    document.getElementById('max-images-input').value = config.maxImages || 10
    document.getElementById('timeout-input').value = config.timeout || 60
  }
}

function closeConfigModal() {
  document.getElementById('config-modal').classList.add('hidden')
  document.body.style.overflow = 'auto'
}

function selectAPIProvider(provider) {
  // Remover seleção anterior
  document.querySelectorAll('.api-provider-btn').forEach(btn => {
    btn.classList.remove('border-purple-500', 'bg-purple-500/20')
    btn.classList.add('border-white/20', 'bg-white/5')
  })
  
  // Selecionar novo
  const selectedBtn = document.querySelector(`[data-provider="${provider}"]`)
  selectedBtn.classList.remove('border-white/20', 'bg-white/5')
  selectedBtn.classList.add('border-purple-500', 'bg-purple-500/20')
  
  // Atualizar seção de configuração
  const config = API_PROVIDERS[provider]
  document.getElementById('selected-api-title').textContent = config.name
  document.getElementById('selected-api-description').textContent = config.description
  document.getElementById('api-signup-link').href = config.signupUrl
  document.getElementById('signup-text').textContent = config.signupText
  document.getElementById('api-key-format').textContent = config.keyFormat
  
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
  
  if (!provider || !apiKey) {
    showNotification('❌ Selecione uma API e insira a chave', 'error')
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
  const apiKey = document.getElementById('api-key-input').value.trim()
  const model = document.getElementById('api-model-select').value
  const maxImages = parseInt(document.getElementById('max-images-input').value) || 10
  const timeout = parseInt(document.getElementById('timeout-input').value) || 60
  
  if (!provider || !apiKey) {
    showNotification('❌ Selecione uma API e insira a chave', 'error')
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
})

// Modal para visualização de imagem
function openImageModal(imageUrl, prompt) {
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
            onclick="copyPrompt(\`${prompt.replace(/`/g, '\\`')}\`)"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            📋 Copiar Prompt
          </button>
          <button 
            onclick="shareImage('${imageUrl}')"
            class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            📤 Compartilhar
          </button>
        </div>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  document.body.style.overflow = 'hidden'
}

function closeImageModal() {
  const modal = document.querySelector('.fixed.inset-0.bg-black\\/80')
  if (modal) {
    document.body.removeChild(modal)
    document.body.style.overflow = 'auto'
  }
}

function downloadImageFromModal(imageUrl) {
  downloadImage(imageUrl, `creative_${Date.now()}`)
  showNotification('📥 Download iniciado em alta qualidade!', 'success')
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

// Batch actions
function downloadAllImages() {
  if (generatedImages.length === 0) {
    showNotification('❌ Nenhuma imagem para download', 'error')
    return
  }
  
  generatedImages.forEach((img, index) => {
    setTimeout(() => {
      downloadImage(img.url, `creative_batch_${index + 1}_${img.id}`)
    }, index * 500) // Delay para evitar muitos downloads simultâneos
  })
  
  showNotification(`📦 Iniciando download de ${generatedImages.length} imagens...`, 'success')
}

function exportPrompts() {
  if (generatedImages.length === 0) {
    showNotification('❌ Nenhum prompt para exportar', 'error')
    return
  }
  
  const prompts = generatedImages.map((img, index) => 
    `${index + 1}. [${img.category}] ${img.prompt}`
  ).join('\n\n')
  
  const blob = new Blob([prompts], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `prompts_${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  showNotification('📄 Prompts exportados com sucesso!', 'success')
}

// Atalhos de teclado
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
})