import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

app.get('/editor', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🖼️ Editor de Imagens Facebook Ads</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            .drag-area {
                transition: all 0.3s ease;
            }
            .drag-area.drag-over {
                border-color: #4299e1;
                background-color: rgba(66, 153, 225, 0.1);
            }
            .preview-canvas {
                max-width: 100%;
                height: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
            }
        </style>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <!-- Header -->
        <nav class="bg-white/10 backdrop-blur-md border-b border-white/20">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">🖼️</div>
                        <h1 class="text-xl font-bold text-white">Editor de Imagens Facebook Ads</h1>
                    </div>
                    <a href="/" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar ao Gerador
                    </a>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Menu Lateral Esquerdo -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Origem das Imagens -->
                    <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h3 class="text-lg font-semibold mb-3 text-white">
                            <i class="fas fa-folder mr-2"></i>Carregar Imagens
                        </h3>
                        
                        <div id="dropArea" class="drag-area p-8 text-center rounded border-2 border-dashed border-white/30 bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                            <i class="fas fa-cloud-upload-alt text-4xl text-white/40 mb-2"></i>
                            <p class="text-white/70 mb-2">Arraste imagens aqui</p>
                            <p class="text-white/50 text-sm">ou clique para selecionar</p>
                            <input type="file" id="fileInput" multiple accept="image/*" class="hidden">
                        </div>
                        
                        <button id="uploadBtn" class="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all">
                            <i class="fas fa-upload mr-2"></i>Selecionar Arquivos
                        </button>
                    </div>

                    <!-- Formato de Saída -->
                    <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h3 class="text-lg font-semibold mb-3 text-white">
                            <i class="fas fa-expand-arrows-alt mr-2"></i>Formato de Saída
                        </h3>
                        <select id="outputSize" class="w-full p-3 border border-white/30 bg-white/20 text-white rounded">
                            <option value="1080x1080">1080×1080 (Facebook padrão)</option>
                            <option value="1200x1200">1200×1200 (Facebook HD)</option>
                            <option value="1080x1920">1080×1920 (Story)</option>
                            <option value="1080x1350">1080×1350 (Instagram Post)</option>
                            <option value="1200x628">1200×628 (Facebook Cover)</option>
                        </select>
                    </div>

                    <!-- Ajuste de Imagem -->
                    <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h3 class="text-lg font-semibold mb-3 text-white">
                            <i class="fas fa-crop-alt mr-2"></i>Ajuste de Imagem
                        </h3>
                        <select id="fitMode" class="w-full p-3 border border-white/30 bg-white/20 text-white rounded mb-3">
                            <option value="cover">Cover (preencher)</option>
                            <option value="contain">Contain (caber)</option>
                            <option value="fill">Fill (esticar)</option>
                            <option value="crop">Crop (cortar)</option>
                        </select>
                    </div>

                    <!-- Botão Play -->
                    <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h3 class="text-lg font-semibold mb-3 text-white">
                            <i class="fas fa-play mr-2"></i>Botão Play
                        </h3>
                        
                        <div class="mb-3">
                            <label class="flex items-center text-white">
                                <input type="checkbox" id="enablePlay" class="mr-2">
                                <span>Ativar Botão Play</span>
                            </label>
                        </div>

                        <div id="playControls" class="space-y-3 hidden">
                            <div>
                                <label class="block text-sm font-medium mb-1 text-white/80">Estilo:</label>
                                <select id="playStyle" class="w-full p-2 border border-white/30 bg-white/20 text-white rounded">
                                    <option value="youtube">YouTube Clássico</option>
                                    <option value="circle">Círculo Moderno</option>
                                    <option value="square">Quadrado Minimalista</option>
                                    <option value="gradient">Gradiente</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-1 text-white/80">Tamanho:</label>
                                <input type="range" id="playSize" min="30" max="120" value="60" class="w-full">
                                <span id="playSizeValue" class="text-sm text-white/60">Tamanho: 60px</span>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-1 text-white/80">Opacidade:</label>
                                <input type="range" id="playOpacity" min="30" max="100" value="90" class="w-full">
                                <span id="playOpacityValue" class="text-sm text-white/60">Opacidade: 90%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Canvas Central -->
                <div class="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h3 class="text-lg font-semibold mb-4 text-white">
                        <i class="fas fa-image mr-2"></i>Preview e Edição
                    </h3>
                    
                    <div class="bg-black/20 rounded-lg p-4 min-h-96 flex items-center justify-center relative">
                        <canvas id="canvas" class="max-w-full max-h-96 border border-white/20 rounded hidden"></canvas>
                        <div id="canvasPlaceholder" class="text-center text-white/50">
                            <i class="fas fa-image text-6xl mb-4"></i>
                            <p>Selecione uma imagem para começar</p>
                        </div>
                    </div>
                    
                    <div id="canvasControls" class="mt-4 flex gap-2 justify-center">
                        <button id="applyBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                            <i class="fas fa-check mr-2"></i>Aplicar
                        </button>
                        <button id="resetBtn" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
                            <i class="fas fa-undo mr-2"></i>Resetar
                        </button>
                        <button id="downloadBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            <i class="fas fa-download mr-2"></i>Download
                        </button>
                    </div>
                </div>

                <!-- Lista de Imagens -->
                <div class="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h3 class="text-lg font-semibold mb-4 text-white">
                        <i class="fas fa-th mr-2"></i>Imagens Carregadas
                    </h3>
                    <div id="imagesList" class="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                        <div class="text-center text-white/50 py-8">
                            <i class="fas fa-images text-4xl mb-2"></i>
                            <p>Nenhuma imagem carregada</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notifications -->
        <div id="notifications" class="fixed top-4 right-4 z-50 space-y-2"></div>

        <script src="/static/editor.js"></script>
    </body>
    </html>
  `)
})

export default app