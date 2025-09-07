// Editor de Imagens Facebook Ads
console.log('🎨 Editor de Imagens carregado!')

// Teste de funcionalidade
window.testeEditor = function() {
    alert('Editor funcionando! 🎨')
    console.log('✅ Teste do editor executado!')
}

// Estado global
let currentImage = null
let canvas = null
let ctx = null
let images = []
let selectedImageIndex = -1

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Editor...')
    
    // Setup do canvas
    setupCanvas()
    
    // Setup dos controles
    setupControls()
    
    // Setup do drag & drop
    setupDragDrop()
    
    console.log('✅ Editor inicializado com sucesso!')
})

// Configurar canvas
function setupCanvas() {
    canvas = document.getElementById('canvas')
    if (canvas) {
        ctx = canvas.getContext('2d')
        console.log('✅ Canvas configurado')
    } else {
        console.error('❌ Canvas não encontrado')
    }
}

// Configurar controles
function setupControls() {
    // Botão de upload
    const uploadBtn = document.getElementById('uploadBtn')
    const fileInput = document.getElementById('fileInput')
    
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click())
    }
    
    // Input de arquivo
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect)
    }
    
    // Controles do botão play
    const enablePlay = document.getElementById('enablePlay')
    const playControls = document.getElementById('playControls')
    const playSize = document.getElementById('playSize')
    const playSizeValue = document.getElementById('playSizeValue')
    const playOpacity = document.getElementById('playOpacity')
    const playOpacityValue = document.getElementById('playOpacityValue')
    
    if (enablePlay && playControls) {
        enablePlay.addEventListener('change', function() {
            if (this.checked) {
                playControls.classList.remove('hidden')
            } else {
                playControls.classList.add('hidden')
            }
            updateCanvas()
        })
    }
    
    if (playSize && playSizeValue) {
        playSize.addEventListener('input', function() {
            playSizeValue.textContent = `Tamanho: ${this.value}px`
            updateCanvas()
        })
    }
    
    if (playOpacity && playOpacityValue) {
        playOpacity.addEventListener('input', function() {
            playOpacityValue.textContent = `Opacidade: ${this.value}%`
            updateCanvas()
        })
    }
    
    // Controles do canvas
    const applyBtn = document.getElementById('applyBtn')
    const resetBtn = document.getElementById('resetBtn')
    const downloadBtn = document.getElementById('downloadBtn')
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyChanges)
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCanvas)
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage)
    }
    
    // Mudança de formato
    const outputSize = document.getElementById('outputSize')
    const fitMode = document.getElementById('fitMode')
    
    if (outputSize) {
        outputSize.addEventListener('change', updateCanvas)
    }
    
    if (fitMode) {
        fitMode.addEventListener('change', updateCanvas)
    }
}

// Configurar drag & drop
function setupDragDrop() {
    const dropArea = document.getElementById('dropArea')
    
    if (!dropArea) return
    
    dropArea.addEventListener('click', () => {
        document.getElementById('fileInput')?.click()
    })
    
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault()
        this.classList.add('drag-over')
    })
    
    dropArea.addEventListener('dragleave', function(e) {
        e.preventDefault()
        this.classList.remove('drag-over')
    })
    
    dropArea.addEventListener('drop', function(e) {
        e.preventDefault()
        this.classList.remove('drag-over')
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        )
        
        if (files.length > 0) {
            handleFiles(files)
        }
    })
}

// Processar seleção de arquivos
function handleFileSelect(event) {
    const files = Array.from(event.target.files)
    if (files.length > 0) {
        handleFiles(files)
    }
}

// Processar arquivos de imagem
function handleFiles(files) {
    console.log(`📁 Processando ${files.length} arquivo(s)...`)
    
    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            
            reader.onload = function(e) {
                const img = new Image()
                img.onload = function() {
                    const imageData = {
                        id: Date.now() + index,
                        name: file.name,
                        size: file.size,
                        width: img.width,
                        height: img.height,
                        src: e.target.result,
                        image: img
                    }
                    
                    images.push(imageData)
                    updateImagesList()
                    
                    // Se for a primeira imagem, selecionar automaticamente
                    if (images.length === 1) {
                        selectImage(0)
                    }
                    
                    showNotification(`✅ ${file.name} carregado!`, 'success')
                }
                img.src = e.target.result
            }
            
            reader.readAsDataURL(file)
        }
    })
}

// Atualizar lista de imagens
function updateImagesList() {
    const imagesList = document.getElementById('imagesList')
    if (!imagesList) return
    
    if (images.length === 0) {
        imagesList.innerHTML = `
            <div class="text-center text-white/50 py-8">
                <i class="fas fa-images text-4xl mb-2"></i>
                <p>Nenhuma imagem carregada</p>
            </div>
        `
        return
    }
    
    imagesList.innerHTML = ''
    
    images.forEach((img, index) => {
        const item = document.createElement('div')
        item.className = `relative cursor-pointer group border-2 rounded-lg overflow-hidden transition-all ${
            index === selectedImageIndex ? 'border-blue-500' : 'border-white/20 hover:border-white/40'
        }`
        
        item.innerHTML = `
            <img 
                src="${img.src}" 
                alt="${img.name}"
                class="w-full aspect-square object-cover"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                    onclick="selectImage(${index})"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs mr-1"
                >
                    Editar
                </button>
                <button 
                    onclick="removeImage(${index})"
                    class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                    ×
                </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                <div class="truncate">${img.name}</div>
                <div class="text-white/70">${img.width}×${img.height}</div>
            </div>
        `
        
        imagesList.appendChild(item)
    })
}

// Selecionar imagem para edição
function selectImage(index) {
    if (index < 0 || index >= images.length) return
    
    selectedImageIndex = index
    currentImage = images[index]
    
    console.log(`🖼️ Selecionando imagem: ${currentImage.name}`)
    
    updateImagesList()
    updateCanvas()
    
    // Mostrar canvas e ocultar placeholder
    const canvas = document.getElementById('canvas')
    const placeholder = document.getElementById('canvasPlaceholder')
    
    if (canvas && placeholder) {
        canvas.classList.remove('hidden')
        placeholder.style.display = 'none'
    }
    
    showNotification(`📝 Editando: ${currentImage.name}`, 'info')
}

// Remover imagem
function removeImage(index) {
    if (index < 0 || index >= images.length) return
    
    const removedImage = images.splice(index, 1)[0]
    console.log(`🗑️ Removendo imagem: ${removedImage.name}`)
    
    // Se a imagem removida estava selecionada
    if (index === selectedImageIndex) {
        selectedImageIndex = -1
        currentImage = null
        
        // Ocultar canvas e mostrar placeholder
        const canvas = document.getElementById('canvas')
        const placeholder = document.getElementById('canvasPlaceholder')
        
        if (canvas && placeholder) {
            canvas.classList.add('hidden')
            placeholder.style.display = 'block'
        }
    } else if (index < selectedImageIndex) {
        selectedImageIndex--
    }
    
    updateImagesList()
    showNotification(`🗑️ ${removedImage.name} removido`, 'info')
}

// Atualizar canvas
function updateCanvas() {
    if (!currentImage || !canvas || !ctx) return
    
    const outputSize = document.getElementById('outputSize')?.value || '1080x1080'
    const fitMode = document.getElementById('fitMode')?.value || 'cover'
    
    const [width, height] = outputSize.split('x').map(Number)
    
    // Definir tamanho do canvas
    canvas.width = width
    canvas.height = height
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height)
    
    // Desenhar imagem
    drawImageWithFit(ctx, currentImage.image, 0, 0, width, height, fitMode)
    
    // Desenhar botão play se ativado
    const enablePlay = document.getElementById('enablePlay')
    if (enablePlay?.checked) {
        drawPlayButton()
    }
}

// Desenhar imagem com diferentes modos de ajuste
function drawImageWithFit(ctx, img, x, y, width, height, mode) {
    const imgRatio = img.width / img.height
    const canvasRatio = width / height
    
    let drawWidth, drawHeight, drawX, drawY
    
    switch (mode) {
        case 'cover':
            if (imgRatio > canvasRatio) {
                drawHeight = height
                drawWidth = height * imgRatio
                drawX = x + (width - drawWidth) / 2
                drawY = y
            } else {
                drawWidth = width
                drawHeight = width / imgRatio
                drawX = x
                drawY = y + (height - drawHeight) / 2
            }
            break
            
        case 'contain':
            if (imgRatio > canvasRatio) {
                drawWidth = width
                drawHeight = width / imgRatio
                drawX = x
                drawY = y + (height - drawHeight) / 2
            } else {
                drawHeight = height
                drawWidth = height * imgRatio
                drawX = x + (width - drawWidth) / 2
                drawY = y
            }
            break
            
        case 'fill':
            drawX = x
            drawY = y
            drawWidth = width
            drawHeight = height
            break
            
        case 'crop':
            // Crop central
            const cropRatio = Math.min(width / img.width, height / img.height)
            const cropWidth = width / cropRatio
            const cropHeight = height / cropRatio
            const cropX = (img.width - cropWidth) / 2
            const cropY = (img.height - cropHeight) / 2
            
            ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, x, y, width, height)
            return
    }
    
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
}

// Desenhar botão play
function drawPlayButton() {
    if (!ctx || !canvas) return
    
    const playSize = parseInt(document.getElementById('playSize')?.value || 60)
    const playOpacity = parseInt(document.getElementById('playOpacity')?.value || 90) / 100
    const playStyle = document.getElementById('playStyle')?.value || 'youtube'
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    ctx.save()
    ctx.globalAlpha = playOpacity
    
    switch (playStyle) {
        case 'youtube':
            drawYouTubePlayButton(centerX, centerY, playSize)
            break
        case 'circle':
            drawCirclePlayButton(centerX, centerY, playSize)
            break
        case 'square':
            drawSquarePlayButton(centerX, centerY, playSize)
            break
        case 'gradient':
            drawGradientPlayButton(centerX, centerY, playSize)
            break
    }
    
    ctx.restore()
}

// Estilos de botão play
function drawYouTubePlayButton(x, y, size) {
    const radius = size / 2
    
    // Círculo vermelho
    ctx.fillStyle = '#ff0000'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    
    // Triângulo branco
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(x - size/6, y - size/4)
    ctx.lineTo(x - size/6, y + size/4)
    ctx.lineTo(x + size/3, y)
    ctx.closePath()
    ctx.fill()
}

function drawCirclePlayButton(x, y, size) {
    const radius = size / 2
    
    // Círculo com borda
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Triângulo
    ctx.fillStyle = '#333333'
    ctx.beginPath()
    ctx.moveTo(x - size/6, y - size/4)
    ctx.lineTo(x - size/6, y + size/4)
    ctx.lineTo(x + size/3, y)
    ctx.closePath()
    ctx.fill()
}

function drawSquarePlayButton(x, y, size) {
    // Quadrado com cantos arredondados
    const halfSize = size / 2
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.beginPath()
    ctx.roundRect(x - halfSize, y - halfSize, size, size, size/10)
    ctx.fill()
    
    // Triângulo
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(x - size/6, y - size/4)
    ctx.lineTo(x - size/6, y + size/4)
    ctx.lineTo(x + size/3, y)
    ctx.closePath()
    ctx.fill()
}

function drawGradientPlayButton(x, y, size) {
    const radius = size / 2
    
    // Gradiente circular
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(64, 224, 208, 0.9)')
    gradient.addColorStop(1, 'rgba(72, 61, 139, 0.9)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    
    // Triângulo
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(x - size/6, y - size/4)
    ctx.lineTo(x - size/6, y + size/4)
    ctx.lineTo(x + size/3, y)
    ctx.closePath()
    ctx.fill()
}

// Aplicar mudanças
function applyChanges() {
    if (!currentImage) {
        showNotification('❌ Nenhuma imagem selecionada', 'error')
        return
    }
    
    updateCanvas()
    showNotification('✅ Mudanças aplicadas!', 'success')
}

// Resetar canvas
function resetCanvas() {
    if (!currentImage) {
        showNotification('❌ Nenhuma imagem selecionada', 'error')
        return
    }
    
    // Resetar controles para padrão
    const enablePlay = document.getElementById('enablePlay')
    const playControls = document.getElementById('playControls')
    const outputSize = document.getElementById('outputSize')
    const fitMode = document.getElementById('fitMode')
    
    if (enablePlay) enablePlay.checked = false
    if (playControls) playControls.classList.add('hidden')
    if (outputSize) outputSize.value = '1080x1080'
    if (fitMode) fitMode.value = 'cover'
    
    updateCanvas()
    showNotification('🔄 Canvas resetado!', 'info')
}

// Download da imagem editada - MÉTODO QUE FUNCIONA
function downloadImage() {
    if (!canvas || !currentImage) {
        showNotification('❌ Nenhuma imagem para download', 'error')
        return
    }
    
    try {
        console.log('📥 Iniciando download...')
        
        // Método 1: Usar canvas.toBlob (mais compatível)
        canvas.toBlob(function(blob) {
            if (!blob) {
                console.error('❌ Falha ao criar blob')
                showNotification('❌ Erro ao gerar arquivo', 'error')
                return
            }
            
            console.log('✅ Blob criado, tamanho:', blob.size)
            
            // Criar URL temporário
            const url = URL.createObjectURL(blob)
            
            // Criar elemento de download
            const link = document.createElement('a')
            link.href = url
            link.download = `editado_${currentImage.name.split('.')[0]}_${Date.now()}.png`
            
            // Adicionar ao DOM temporariamente e clicar
            document.body.appendChild(link)
            link.click()
            
            // Limpar
            document.body.removeChild(link)
            setTimeout(() => URL.revokeObjectURL(url), 1000)
            
            console.log('✅ Download iniciado:', link.download)
            showNotification('📥 Download iniciado!', 'success')
            
        }, 'image/png', 0.95) // PNG com qualidade alta
        
    } catch (error) {
        console.error('❌ Erro no download:', error)
        showNotification('❌ Erro no download: ' + error.message, 'error')
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications')
    if (!notifications) return
    
    const notification = document.createElement('div')
    notification.className = `notification px-4 py-3 rounded-lg text-white font-medium shadow-lg transform translate-x-full transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`
    
    notification.textContent = message
    
    notifications.appendChild(notification)
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full')
    }, 100)
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full')
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification)
            }
        }, 300)
    }, 4000)
}

// Funções globais para os botões
window.selectImage = selectImage
window.removeImage = removeImage

console.log('✅ Editor.js carregado completamente!')