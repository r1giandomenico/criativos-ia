// Estado da aplicação
let currentCategory = 'women'
let generatedImages = []

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
  if (quantity > 10) {
    showNotification('⚠️ Máximo de 10 imagens por vez para performance', 'error')
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
    
    console.log('Enviando requisição:', requestData)
    
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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  selectCategory('women')
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