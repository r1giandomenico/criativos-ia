import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)
app.use('/api/*', cors())

// Tipos de modelos e configurações
const WOMAN_TYPES = {
  'brazilian': 'Beautiful Brazilian woman',
  'arabic': 'Beautiful Arabic woman',
  'mexican': 'Beautiful Mexican woman', 
  'american': 'Beautiful American woman',
  'european': 'Beautiful European woman',
  'asian': 'Beautiful Asian woman'
}

const STYLES = {
  'sexy': 'attractive sensual style, fashionable outfit, confident pose, alluring look, stylish appearance',
  'bikini': 'wearing bikini, beach setting, summer vibes, swimwear fashion',
  'casual': 'casual elegant outfit, natural beauty, comfortable style',
  'formal': 'elegant formal dress, sophisticated, classy outfit',
  'fitness': 'athletic wear, fit and healthy, sporty style',
  'seductive': 'seductive pose, attractive clothing, charming smile, confident attitude',
  'glamour': 'glamorous outfit, stunning appearance, elegant pose, fashion model style',
  'trendy': 'trendy modern outfit, stylish look, contemporary fashion, chic appearance'
}

const SOCIAL_BENEFIT_THEMES = {
  'housing': 'social housing program, new houses, families with houses, affordable housing, government housing program, Brazilian families, dream house, home ownership',
  'bienestar': 'Mexican social program Bienestar México, Mujeres con Bienestar, Mexican women beneficiaries, social welfare cards, government support program, Mexican families receiving benefits',
  'education': 'education, learning, schools, students, educational programs',
  'health': 'healthcare, medical care, hospitals, health programs',
  'family': 'happy Brazilian families, children, parents, family unity, social programs',
  'community': 'community development, neighborhood, social inclusion, urban development'
}

// Rota do Editor de Imagens separado
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
                        <button onclick="testeEditor()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                            <i class="fas fa-test mr-2"></i>Teste
                        </button>
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

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎨 Gerador de Criativos para Meta Ads</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
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
            .image-thumbnail {
                width: 100px;
                height: 100px;
                object-fit: cover;
                border: 2px solid transparent;
                cursor: pointer;
                transition: border-color 0.2s;
                border-radius: 8px;
            }
            .image-thumbnail.selected {
                border-color: #4299e1;
            }
            .play-button-preview {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            }
            .nav-btn.active {
                background: rgba(255, 255, 255, 0.2) !important;
                border-color: rgba(255, 255, 255, 0.4) !important;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            }
            .tool-panel {
                animation: fadeIn 0.3s ease-in-out;
            }
            .tool-panel.hidden {
                display: none;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <!-- Menu Superior -->
        <nav class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between py-4">
                    <!-- Logo/Brand -->
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">🎨</div>
                        <h1 class="text-xl font-bold text-white">Meta Ads Studio</h1>
                    </div>
                    
                    <!-- Link direto para editor -->
                    <div class="flex items-center space-x-3">
                        <a 
                            href="/editor" 
                            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all font-medium"
                        >
                            🖼️ Abrir Editor de Imagens
                        </a>
                    </div>
                    
                    <!-- Menu Navigation -->
                    <div class="flex space-x-1">
                        <button 
                            onclick="switchTool('generator')" 
                            id="nav-generator"
                            class="nav-btn px-4 py-2 rounded-lg text-white font-medium transition-all bg-white/20 border border-white/30"
                        >
                            <i class="fas fa-magic mr-2"></i>Gerador de Criativos
                        </button>
                        <a 
                            href="/editor"
                            class="nav-btn px-4 py-2 rounded-lg text-white font-medium transition-all bg-blue-600 hover:bg-blue-700 border border-blue-500 inline-block"
                        >
                            <i class="fas fa-edit mr-2"></i>Editor de Imagens
                        </a>
                    </div>
                    
                    <!-- Transfer Button -->
                    <button 
                        onclick="transferImages()" 
                        id="transfer-btn"
                        class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 hidden"
                    >
                        <i class="fas fa-arrow-right mr-2"></i>Enviar para Editor
                    </button>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <!-- Tool Container -->
            <div id="tool-container">
                <!-- Generator Tool -->
                <div id="generator-tool" class="tool-panel">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-white mb-2">🎨 Gerador de Criativos</h2>
                        <p class="text-white/80">Gere imagens com IA para suas campanhas no Meta Ads</p>
                    </div>
            
            <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Painel de Controle -->
                <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">⚙️ Configurações</h2>
                    
                    <div class="space-y-6">
                        <!-- Categoria -->
                        <div>
                            <label class="block text-white font-semibold mb-3">Categoria:</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button 
                                    id="category-women" 
                                    class="category-btn bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-all active"
                                    onclick="selectCategory('women')"
                                >
                                    👩 Mulheres
                                </button>
                                <button 
                                    id="category-social" 
                                    class="category-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
                                    onclick="selectCategory('social')"
                                >
                                    🤝 Benefício Social
                                </button>
                            </div>
                        </div>

                        <!-- Configurações para Mulheres -->
                        <div id="women-config" class="space-y-4">
                            <div>
                                <label class="block text-white font-semibold mb-2">Nacionalidade:</label>
                                <select id="nationality" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                    <option value="brazilian">Brasileira</option>
                                    <option value="arabic">Árabe</option>
                                    <option value="mexican">Mexicana</option>
                                    <option value="american">Americana</option>
                                    <option value="european">Europeia</option>
                                    <option value="asian">Asiática</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-white font-semibold mb-2">Estilo:</label>
                                <select id="style" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                    <option value="sexy">Sexy</option>
                                    <option value="seductive">Sedutora</option>
                                    <option value="glamour">Glamour</option>
                                    <option value="bikini">Bikini</option>
                                    <option value="trendy">Moderna</option>
                                    <option value="casual">Casual</option>
                                    <option value="formal">Formal</option>
                                    <option value="fitness">Fitness</option>
                                </select>
                            </div>
                        </div>

                        <!-- Configurações para Benefício Social -->
                        <div id="social-config" class="space-y-4 hidden">
                            <div>
                                <label class="block text-white font-semibold mb-2">Tema Social:</label>
                                <select id="social-theme" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                    <option value="housing">Habitação (Minha Casa Minha Vida)</option>
                                    <option value="bienestar">Bienestar México (Mujeres con Bienestar)</option>
                                    <option value="family">Família Beneficiária</option>
                                    <option value="education">Educação</option>
                                    <option value="health">Saúde</option>
                                    <option value="community">Comunidade</option>
                                </select>
                            </div>
                        </div>

                        <!-- Configurações Gerais -->
                        <div>
                            <label class="block text-white font-semibold mb-2">Formato:</label>
                            <select id="aspect-ratio" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                <option value="1:1">Quadrado (1:1) - Instagram Feed</option>
                                <option value="9:16">Vertical (9:16) - Stories/Reels</option>
                                <option value="16:9">Horizontal (16:9) - Facebook</option>
                                <option value="4:5">Retrato (4:5) - Posts Verticais</option>
                                <option value="3:2">Paisagem (3:2) - Posts Horizontais</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-white font-semibold mb-2">Quantidade:</label>
                            <select id="quantity" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                <option value="1">1 imagem</option>
                                <option value="3">3 imagens</option>
                                <option value="5">5 imagens</option>
                                <option value="10">10 imagens (massa)</option>
                            </select>
                        </div>

                        <!-- Preview do Prompt -->
                        <div class="mb-4 p-4 bg-white/10 rounded-lg">
                            <label class="block text-white font-semibold mb-2">📝 Preview do Prompt:</label>
                            <textarea 
                                id="prompt-preview"
                                class="w-full h-20 p-3 text-sm rounded-lg bg-white/20 text-white border border-white/30 resize-none"
                                placeholder="O prompt será gerado automaticamente baseado nas suas seleções..."
                                readonly
                            ></textarea>
                            <div class="flex justify-between items-center mt-2">
                                <small class="text-white/60">Você pode editar o prompt antes de gerar</small>
                                <button 
                                    onclick="togglePromptEdit()"
                                    id="edit-prompt-btn"
                                    class="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                                >
                                    ✏️ Editar
                                </button>
                            </div>
                        </div>

                        <!-- Botões -->
                        <div class="space-y-3">
                            <button 
                                id="generate-btn"
                                onclick="generateImages()"
                                class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                🎨 Gerar Imagens
                            </button>
                            
                            <div class="grid grid-cols-2 gap-2">
                                <button 
                                    onclick="downloadAllImagesAsZip()"
                                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                                >
                                    📦 Download ZIP
                                </button>
                                <button 
                                    onclick="clearGallery()"
                                    class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                                >
                                    🗑️ Limpar
                                </button>
                            </div>
                            
                            <button 
                                onclick="openConfigModal()"
                                class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                            >
                                ⚙️ Configurar APIs
                            </button>
                        </div>
                        
                        <!-- Status da API -->
                        <div id="api-status" class="mt-4 p-3 bg-white/10 rounded-lg text-sm">
                            <div class="flex items-center justify-between">
                                <span class="text-white/80">Status da API:</span>
                                <span id="api-status-indicator" class="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">
                                    🟡 Modo Demo
                                </span>
                            </div>
                            <div id="api-provider-info" class="text-xs text-white/60 mt-1">
                                Configure uma API para gerar imagens reais
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Galeria -->
                <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">🖼️ Galeria de Criativos</h2>
                    
                    <div id="loading" class="hidden text-center py-8">
                        <div class="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
                        <p class="text-white">Gerando imagens...</p>
                    </div>

                    <div id="gallery" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        <div class="col-span-full text-center text-white/60 py-8">
                            <div class="text-6xl mb-4">🎨</div>
                            <p>Suas imagens aparecerão aqui</p>
                            <p class="text-sm mt-2">Configure os parâmetros e clique em "Gerar Imagens"</p>
                        </div>
                    </div>

                    <div id="stats" class="mt-4 p-3 bg-white/10 rounded-lg text-sm text-white/80 hidden">
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div>📊 Total: <span id="total-count" class="font-bold">0</span></div>
                            <div>👩 Mulheres: <span id="women-count" class="font-bold">0</span></div>
                            <div>🤝 Social: <span id="social-count" class="font-bold">0</span></div>
                            <div>⏱️ Última: <span id="last-generated" class="font-bold">-</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Seção de Dicas -->
            <div class="max-w-4xl mx-auto mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 class="text-xl font-bold text-white mb-4">💡 Dicas para Meta Ads</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                    <div>
                        <h4 class="font-semibold mb-2">✅ Melhores Práticas:</h4>
                        <ul class="text-sm space-y-1">
                            <li>• Use imagens de alta qualidade</li>
                            <li>• Teste diferentes nacionalidades</li>
                            <li>• Varie os estilos para encontrar o que converte</li>
                            <li>• Stories funcionam bem no formato 9:16</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">📊 Estratégia de Teste:</h4>
                        <ul class="text-sm space-y-1">
                            <li>• Gere múltiplas variações</li>
                            <li>• Teste A/B com diferentes estilos</li>
                            <li>• Monitore métricas de engajamento</li>
                            <li>• Adapte baseado na performance</li>
                        </ul>
                    </div>
                    </div>
                </div>

                <!-- Editor Tool -->
                <div id="editor-tool" class="tool-panel hidden">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-white mb-2">✏️ Editor de Imagens</h2>
                        <p class="text-white/80">Edite e otimize suas imagens para Facebook Ads</p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <!-- Menu Lateral Esquerdo -->
                        <div class="lg:col-span-1 space-y-6">
                            <!-- Origem das Imagens -->
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-folder mr-2"></i>Origem das Imagens</h3>
                                
                                <button id="uploadBtn" class="w-full bg-blue-600 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700 transition-all">
                                    <i class="fas fa-upload mr-2"></i>Upload Local
                                </button>
                                
                                <button id="importBtn" class="w-full bg-green-600 text-white py-2 px-4 rounded mb-4 hover:bg-green-700 transition-all">
                                    <i class="fas fa-download mr-2"></i>Importar do Gerador
                                </button>
                                
                                <div id="dropArea" class="drag-area p-8 text-center rounded border-2 border-dashed border-white/30 bg-white/5">
                                    <i class="fas fa-cloud-upload-alt text-4xl text-white/40 mb-2"></i>
                                    <p class="text-white/70">Arraste imagens aqui ou clique para selecionar</p>
                                    <input type="file" id="fileInput" multiple accept="image/*" class="hidden">
                                </div>
                            </div>

                            <!-- Formato de Saída -->
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-expand-arrows-alt mr-2"></i>Formato de Saída</h3>
                                <select id="outputSize" class="w-full p-2 border border-white/30 bg-white/20 text-white rounded">
                                    <option value="1080x1080">1080×1080 (Facebook padrão)</option>
                                    <option value="1200x1200">1200×1200 (Facebook HD)</option>
                                    <option value="1080x1920">1080×1920 (Story)</option>
                                    <option value="1080x1350">1080×1350 (Instagram Post)</option>
                                </select>
                            </div>

                            <!-- Ajuste Quadrado -->
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-crop-alt mr-2"></i>Ajuste Quadrado</h3>
                                <select id="squareAdjust" class="w-full p-2 border border-white/30 bg-white/20 text-white rounded mb-3">
                                    <option value="none">Sem Ajuste</option>
                                    <option value="crop">Crop Central</option>
                                    <option value="cover">Cover com Bordas</option>
                                    <option value="letterbox">Letterbox</option>
                                    <option value="letterbox-blur">Letterbox + Blur</option>
                                </select>
                            </div>

                            <!-- Controles de Blur -->
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-adjust mr-2"></i>Blur</h3>
                                <div class="flex items-center gap-3">
                                    <span class="text-white/70">0</span>
                                    <input type="range" id="blurSlider" min="0" max="25" value="0" class="flex-1">
                                    <span class="text-white/70">25</span>
                                </div>
                                <span id="blurValue" class="text-sm text-white/60">Blur: 0px</span>
                            </div>

                            <!-- Botão Play -->
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-play mr-2"></i>Botão Play</h3>
                                
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
                                            <option value="neon">Neon</option>
                                            <option value="black-circle">Círculo Preto</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium mb-1 text-white/80">Tamanho (%): <span id="playSizeValue">40</span></label>
                                        <input type="range" id="playSize" min="10" max="100" value="40" class="w-full">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium mb-1 text-white/80">Opacidade (%): <span id="playOpacityValue">90</span></label>
                                        <input type="range" id="playOpacity" min="10" max="100" value="90" class="w-full">
                                    </div>
                                </div>
                            </div>

                            <!-- CTA -->
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-bullhorn mr-2"></i>Call to Action</h3>
                                
                                <div class="mb-3">
                                    <label class="flex items-center text-white">
                                        <input type="checkbox" id="enableCta" class="mr-2">
                                        <span>Ativar CTA</span>
                                    </label>
                                </div>

                                <div id="ctaControls" class="space-y-3 hidden">
                                    <div>
                                        <label class="block text-sm font-medium mb-1 text-white/80">Texto:</label>
                                        <input type="text" id="ctaText" placeholder="Baixe agora!" class="w-full p-2 border border-white/30 bg-white/20 text-white rounded placeholder-white/50">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium mb-1 text-white/80">Posição:</label>
                                        <select id="ctaPosition" class="w-full p-2 border border-white/30 bg-white/20 text-white rounded">
                                            <option value="bottom">Inferior</option>
                                            <option value="center">Centro</option>
                                            <option value="top">Superior</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium mb-1 text-white/80">Opacidade Fundo (%): <span id="ctaOpacityValue">80</span></label>
                                        <input type="range" id="ctaOpacity" min="30" max="100" value="80" class="w-full">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Área Central -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Imagens Carregadas -->
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-images mr-2"></i>Imagens Carregadas</h3>
                                <div id="imageList" class="text-center text-white/60">
                                    Nenhuma imagem carregada
                                </div>
                            </div>

                            <!-- Botão Processar -->
                            <button id="processBtn" class="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
                                <i class="fas fa-cogs mr-2"></i>Processar Lote
                            </button>

                            <!-- Progress -->
                            <div id="progressArea" class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hidden">
                                <h3 class="text-lg font-semibold mb-3 text-white">Progresso</h3>
                                <div class="w-full bg-white/20 rounded-full h-2.5 mb-2">
                                    <div id="progressBar" class="bg-green-600 h-2.5 rounded-full transition-all" style="width: 0%"></div>
                                </div>
                                <p id="progressText" class="text-sm text-white/70">Preparando...</p>
                            </div>
                        </div>

                        <!-- Preview -->
                        <div class="lg:col-span-1">
                            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 sticky top-24">
                                <h3 class="text-lg font-semibold mb-3 text-white"><i class="fas fa-eye mr-2"></i>Preview</h3>
                                <div id="previewArea" class="text-center text-white/60 min-h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded bg-white/5">
                                    Selecione uma imagem para ver o preview
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Configurações de API -->
        <div id="config-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
                    <!-- Header -->
                    <div class="flex justify-between items-center p-6 border-b border-white/20">
                        <h3 class="text-white font-bold text-xl">🔑 Configurações de API</h3>
                        <button 
                            onclick="closeConfigModal()"
                            class="text-white hover:text-red-400 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                    
                    <!-- Content -->
                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        
                        <!-- Seletor de API -->
                        <div class="mb-6">
                            <label class="block text-white font-semibold mb-3">Escolha sua API de IA:</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button 
                                    class="api-provider-btn p-4 rounded-lg border-2 transition-all text-left border-green-500 bg-green-500/20"
                                    data-provider="pollinations"
                                    onclick="selectAPIProvider('pollinations')"
                                >
                                    <div class="font-bold text-white">🆓 Pollinations AI</div>
                                    <div class="text-sm text-white/70">100% GRATUITO • Sem limites</div>
                                    <div class="text-xs text-white/60 mt-1">Flux + Stable Diffusion</div>
                                </button>
                                
                                <button 
                                    class="api-provider-btn p-4 rounded-lg border-2 transition-all text-left"
                                    data-provider="ideogram"
                                    onclick="selectAPIProvider('ideogram')"
                                >
                                    <div class="font-bold text-white">🏆 Ideogram V3</div>
                                    <div class="text-sm text-white/70">Melhor qualidade • ~$0.08/img</div>
                                    <div class="text-xs text-white/60 mt-1">Ideal para mulheres realistas</div>
                                </button>
                                
                                <button 
                                    class="api-provider-btn p-4 rounded-lg border-2 transition-all text-left"
                                    data-provider="flux"
                                    onclick="selectAPIProvider('flux')"
                                >
                                    <div class="font-bold text-white">⚡ Flux Pro</div>
                                    <div class="text-sm text-white/70">Custo-benefício • ~$0.055/img</div>
                                    <div class="text-xs text-white/60 mt-1">Rápido e eficiente</div>
                                </button>
                                
                                <button 
                                    class="api-provider-btn p-4 rounded-lg border-2 transition-all text-left"
                                    data-provider="openai"
                                    onclick="selectAPIProvider('openai')"
                                >
                                    <div class="font-bold text-white">🤖 DALL-E 3</div>
                                    <div class="text-sm text-white/70">Premium • ~$0.04-0.12/img</div>
                                    <div class="text-xs text-white/60 mt-1">OpenAI - Qualidade premium</div>
                                </button>
                                
                                <button 
                                    class="api-provider-btn p-4 rounded-lg border-2 transition-all text-left"
                                    data-provider="stability"
                                    onclick="selectAPIProvider('stability')"
                                >
                                    <div class="font-bold text-white">🎨 Stability AI</div>
                                    <div class="text-sm text-white/70">Customizável • ~$0.04/img</div>
                                    <div class="text-xs text-white/60 mt-1">Controle avançado (Beta)</div>
                                </button>
                            </div>
                        </div>

                        <!-- Configuração da API Selecionada -->
                        <div id="api-config-section" class="mb-6 hidden">
                            <div class="bg-white/10 rounded-lg p-4 mb-4">
                                <h4 id="selected-api-title" class="text-white font-semibold mb-2"></h4>
                                <p id="selected-api-description" class="text-white/70 text-sm mb-4"></p>
                                
                                <!-- Link para obter API key -->
                                <div class="mb-4">
                                    <label class="block text-white/80 text-sm mb-2">Como obter a chave:</label>
                                    <a id="api-signup-link" href="#" target="_blank" 
                                       class="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm">
                                        🔗 <span id="signup-text">Clique aqui para se cadastrar</span> →
                                    </a>
                                </div>
                                
                                <!-- Input da API Key -->
                                <div class="mb-4">
                                    <label class="block text-white font-semibold mb-2">
                                        Chave da API: <span id="api-key-format" class="text-white/60 text-xs"></span>
                                    </label>
                                    <input 
                                        type="password" 
                                        id="api-key-input"
                                        placeholder="Cole sua chave de API aqui..."
                                        class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>
                                
                                <!-- Modelo (opcional) -->
                                <div class="mb-4">
                                    <label class="block text-white font-semibold mb-2">Modelo (opcional):</label>
                                    <select id="api-model-select" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                        <!-- Preenchido dinamicamente -->
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Teste da API -->
                        <div id="api-test-section" class="mb-6 hidden">
                            <button 
                                onclick="testAPIConnection()"
                                id="test-api-btn"
                                class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                            >
                                🧪 Testar Conexão
                            </button>
                            
                            <div id="test-result" class="mt-3 p-3 rounded-lg hidden">
                                <!-- Resultado do teste aparecerá aqui -->
                            </div>
                        </div>

                        <!-- Configurações Avançadas -->
                        <div class="mb-6">
                            <details class="bg-white/10 rounded-lg">
                                <summary class="p-4 cursor-pointer text-white font-semibold">
                                    ⚙️ Configurações Avançadas
                                </summary>
                                <div class="p-4 pt-0 space-y-4">
                                    <div>
                                        <label class="block text-white/80 text-sm mb-2">Máximo de imagens por requisição:</label>
                                        <input 
                                            type="number" 
                                            id="max-images-input"
                                            value="10"
                                            min="1" max="20"
                                            class="w-full p-2 rounded bg-white/20 text-white border border-white/30"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label class="block text-white/80 text-sm mb-2">Timeout (segundos):</label>
                                        <input 
                                            type="number" 
                                            id="timeout-input"
                                            value="60"
                                            min="10" max="300"
                                            class="w-full p-2 rounded bg-white/20 text-white border border-white/30"
                                        />
                                    </div>
                                </div>
                            </details>
                        </div>

                        <!-- Botões de Ação -->
                        <div class="flex gap-3">
                            <button 
                                onclick="saveAPIConfig()"
                                class="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                            >
                                💾 Salvar Configuração
                            </button>
                            
                            <button 
                                onclick="clearAPIConfig()"
                                class="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                            >
                                🗑️ Limpar
                            </button>
                        </div>

                        <!-- Dicas de APIs -->
                        <div class="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                            <h5 class="text-green-200 font-semibold mb-2">💡 Recomendações</h5>
                            <ul class="text-green-100/80 text-sm space-y-1">
                                <li>• <strong>🆓 Para começar:</strong> Use Pollinations (100% gratuito)</li>
                                <li>• <strong>🏆 Para qualidade máxima:</strong> Use Ideogram (melhor resultado)</li>
                                <li>• <strong>⚡ Para economia:</strong> Use Flux Pro (rápido e barato)</li>
                                <li>• <strong>🤖 Para premium:</strong> Use DALL-E 3 (OpenAI)</li>
                            </ul>
                        </div>

                        <!-- Info de Segurança -->
                        <div class="mt-4 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                            <h5 class="text-blue-200 font-semibold mb-2">🔒 Segurança</h5>
                            <ul class="text-blue-100/80 text-sm space-y-1">
                                <li>• Suas chaves ficam armazenadas apenas no seu navegador</li>
                                <li>• Não enviamos suas chaves para nossos servidores</li>
                                <li>• As chaves são criptografadas no localStorage</li>
                                <li>• Você pode apagar suas configurações a qualquer momento</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// API para geração de imagens
app.post('/api/generate', async (c) => {
  try {
    const { env } = c // Acessar variáveis de ambiente no Cloudflare
    const { category, nationality, style, socialTheme, aspectRatio, quantity, userAPIConfig, customPrompt } = await c.req.json()
    
    // Validar limites
    if (quantity > 10) {
      return c.json({ success: false, error: 'Maximum 10 images per request' }, 400)
    }

    // Usar prompt customizado se fornecido, senão gerar automaticamente
    let basePrompt = ''
    
    if (customPrompt && customPrompt.trim()) {
      basePrompt = customPrompt.trim()
    } else {
      if (category === 'women') {
        const womanType = WOMAN_TYPES[nationality] || WOMAN_TYPES.brazilian
        const styleDesc = STYLES[style] || STYLES.casual
        
        let additionalDesc = ''
        if (style === 'sexy' || style === 'seductive') {
          additionalDesc = ', attractive pose, confident expression, stylish outfit with subtle elegance, charming smile'
        } else if (style === 'glamour') {
          additionalDesc = ', glamorous makeup, elegant hairstyle, sophisticated fashion, model-like pose, stunning appearance'
        } else if (style === 'bikini') {
          additionalDesc = ', beach fashion, summer style, confident pose, tropical setting, vacation vibes'
        } else if (style === 'trendy') {
          additionalDesc = ', modern fashion, contemporary style, trendy accessories, stylish pose, urban chic'
        }
        
        basePrompt = `${womanType}, ${styleDesc}${additionalDesc}, professional photography, high quality, detailed, beautiful lighting, 4k resolution`
      } else if (category === 'social') {
        const theme = SOCIAL_BENEFIT_THEMES[socialTheme] || SOCIAL_BENEFIT_THEMES.housing
        
        if (socialTheme === 'housing') {
          basePrompt = `Brazilian social housing program, new small houses in rows, happy Brazilian families in front of their new houses, children playing, adults smiling, government housing project, affordable housing complex, clean modern houses with red tile roofs, families holding keys, celebrating homeownership, bright sunny day, professional photography, high quality, realistic, documentary style, 4k resolution`
        } else if (socialTheme === 'bienestar') {
          basePrompt = `Single Mexican woman beneficiary of Bienestar México program, Mujeres con Bienestar, happy Mexican mother holding social welfare card, government support program, woman with traditional Mexican clothing, colorful social program banner in background, official government setting, positive social impact, realistic Mexican woman, professional photography, high quality, bright lighting, documentary style, 4k resolution`
        } else if (socialTheme === 'family') {
          basePrompt = `Brazilian couple with maximum two children, father and mother with one son and one daughter, small happy family of four people total, parents and two kids celebrating new home, Minha Casa Minha Vida program beneficiaries, family portrait in front of new house, joy and happiness, realistic Brazilian family, professional photography, high quality, warm lighting, 4k resolution`
        } else {
          basePrompt = `${theme}, Brazilian social programs, community development, inspiring, positive impact, professional photography, high quality, meaningful, uplifting, realistic, 4k resolution`
        }
      }
    }

    // Adicionar variações para múltiplas imagens
    const prompts = []
    let variations = []
    
    if (category === 'social' && socialTheme === 'housing') {
      variations = [
        ', aerial view of housing complex with families outside',
        ', close-up of Brazilian family holding house keys and smiling',
        ', row of new houses with families in front celebrating',
        ', children playing in front of new houses, parents watching',
        ', couple with children standing proud in front of their new home',
        ', wide shot of housing development with multiple families',
        ', Brazilian family with "Minha Casa Minha Vida" signage visible',
        ', families moving into new houses, boxes and celebration'
      ]
    } else if (category === 'social' && socialTheme === 'bienestar') {
      variations = [
        ', Mexican woman proudly showing her Bienestar card at government office',
        ', single Mexican mother smiling with social welfare card in hand',
        ', Mexican woman in traditional dress holding government support card',
        ', woman standing in front of Bienestar México banner at official event',
        ', Mexican mother with one child receiving government assistance',
        ', woman beneficiary portrait at Mujeres con Bienestar ceremony',
        ', Mexican woman celebrating social program benefits with government official',
        ', elderly Mexican woman smiling while holding her benefit card'
      ]
    } else if (category === 'social' && socialTheme === 'family') {
      variations = [
        ', Brazilian mother and father with one son and one daughter smiling in front of house',
        ', couple with maximum two children celebrating new home together',
        ', family of four people total, parents with boy and girl, house keys in hand',
        ', family portrait with mother, father and exactly two kids, house in background',
        ', two children playing while parents watch from new house doorway',
        ', small family of four embracing in front of their new home',
        ', parents with son and daughter only, all holding house keys together',
        ', couple with two children maximum, family photo celebrating new house'
      ]
    } else if (category === 'women') {
      if (style === 'sexy' || style === 'seductive') {
        variations = [
          ', alluring gaze, confident expression, stylish pose',
          ', charming smile, attractive styling, elegant composition',
          ', seductive look, fashionable outfit, professional modeling',
          ', captivating pose, beautiful makeup, stunning appearance',
          ', confident attitude, stylish clothing, magnetic presence',
          ', elegant sensuality, sophisticated style, artistic photography',
          ', attractive fashion, charismatic pose, beautiful lighting',
          ', enchanting smile, trendy outfit, glamorous appearance'
        ]
      } else if (style === 'glamour') {
        variations = [
          ', glamorous makeup, luxury fashion, model pose, studio lighting',
          ', elegant hairstyle, designer outfit, sophisticated expression',
          ', high fashion style, professional model pose, dramatic lighting',
          ', stunning beauty, luxury accessories, magazine quality',
          ', glamour photography, elegant pose, perfect styling',
          ', fashion model style, luxury setting, professional makeup',
          ', sophisticated glamour, designer clothing, artistic composition',
          ', elegant beauty, high-end fashion, studio photography'
        ]
      } else if (style === 'bikini') {
        variations = [
          ', beach bikini, tropical setting, summer vibes, confident pose',
          ', swimwear fashion, ocean background, vacation style, sunny day',
          ', beach photography, bikini model, coastal setting, natural beauty',
          ', summer fashion, beachwear style, tropical paradise, relaxed pose',
          ', bikini photoshoot, beach lifestyle, summer elegance, ocean vibes',
          ', swimwear modeling, beach scene, vacation photography, sunny atmosphere',
          ', coastal beauty, bikini fashion, beach setting, summer glow',
          ', tropical bikini, beach paradise, summer style, vacation mood'
        ]
      } else {
        variations = [
          ', smiling naturally, bright eyes, professional pose',
          ', confident expression, beautiful styling, elegant composition',
          ', natural beauty, authentic smile, artistic photography', 
          ', warm lighting, genuine expression, professional quality',
          ', dynamic pose, vibrant appearance, magazine style',
          ', candid moment, charming smile, lifestyle photography',
          ', artistic angle, beautiful lighting, sophisticated pose',
          ', elegant style, natural grace, professional modeling'
        ]
      }
    } else {
      variations = [
        ', inspiring community scene',
        ', positive social impact moment',
        ', people benefiting from social programs',
        ', community development scene',
        ', social inclusion and unity',
        ', government program success story',
        ', diverse Brazilian community',
        ', uplifting social change moment'
      ]
    }

    for (let i = 0; i < quantity; i++) {
      const variation = variations[i % variations.length]
      const finalPrompt = basePrompt + variation
      
      // Adicionar especificações técnicas baseadas no aspecto
      let technicalSpecs = ''
      switch (aspectRatio) {
        case '9:16':
          technicalSpecs = ', vertical composition, portrait orientation, Instagram story format'
          break
        case '16:9':
          technicalSpecs = ', horizontal composition, landscape orientation, Facebook ad format'
          break
        case '4:5':
          technicalSpecs = ', vertical portrait composition, ideal for posts'
          break
        case '3:2':
          technicalSpecs = ', horizontal landscape composition, professional format'
          break
        default:
          technicalSpecs = ', square composition, Instagram post format'
      }
      
      prompts.push(finalPrompt + technicalSpecs)
    }

    // Verificar se há configuração do usuário OU variáveis de ambiente
    const userHasAPI = userAPIConfig && userAPIConfig.provider && (userAPIConfig.apiKey || userAPIConfig.provider === 'pollinations')
    const serverHasAPI = env?.AI_API_PROVIDER === 'pollinations' || (env?.AI_API_PROVIDER && (
      env.IDEOGRAM_API_KEY || 
      env.OPENAI_API_KEY || 
      env.FLUX_API_KEY || 
      env.STABILITY_API_KEY
    ))
    
    const useRealAPI = userHasAPI || serverHasAPI

    const results = []

    if (useRealAPI) {
      // INTEGRAÇÃO COM API REAL
      const { generateImageWithAI, validateAIConfig, validateUserAPIConfig } = await import('./ai-integration')
      
      let aiConfig = null
      
      // Priorizar configuração do usuário
      if (userHasAPI) {
        aiConfig = validateUserAPIConfig(userAPIConfig)
        console.log(`Using user-configured ${aiConfig?.provider} API for ${quantity} images`)
      } else {
        // Usar configuração do servidor
        aiConfig = validateAIConfig(env)
        console.log(`Using server-configured ${aiConfig?.provider} API for ${quantity} images`)
      }
      
      if (!aiConfig || !aiConfig.apiKey) {
        return c.json({ 
          success: false, 
          error: 'AI API not properly configured. Please check your API settings.' 
        }, 500)
      }

      // Gerar imagens com API real
      for (let i = 0; i < prompts.length; i++) {
        try {
          const result = await generateImageWithAI(aiConfig, {
            prompt: prompts[i],
            aspectRatio: aspectRatio,
            model: aiConfig.model
          })

          if (result.success && result.imageUrl) {
            results.push({
              id: `ai_${Date.now()}_${i}`,
              prompt: prompts[i],
              url: result.imageUrl,
              aspectRatio,
              category,
              nationality: nationality || 'N/A',
              style: style || socialTheme || 'N/A',
              timestamp: new Date().toISOString(),
              downloadUrl: result.imageUrl,
              provider: aiConfig.provider,
              model: aiConfig.model
            })
          } else {
            console.error(`Failed to generate image ${i + 1}:`, result.error)
            // Continuar com as outras imagens mesmo se uma falhar
          }

          // Pequeno delay para evitar rate limiting
          if (i < prompts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }

        } catch (error) {
          console.error(`Error generating image ${i + 1}:`, error)
          // Continuar com as outras imagens
        }
      }

      if (results.length === 0) {
        return c.json({ 
          success: false, 
          error: 'Failed to generate any images. Please check your API configuration and try again.' 
        }, 500)
      }

    } else {
      // MODO DEMO COM PLACEHOLDERS
      console.log('Using demo mode with placeholder images')
      
      for (let i = 0; i < prompts.length; i++) {
        let placeholderUrl = ''
        if (category === 'women') {
          const womanCategories = ['fashion', 'portrait', 'beauty', 'lifestyle', 'model']
          const randomCategory = womanCategories[Math.floor(Math.random() * womanCategories.length)]
          placeholderUrl = `https://picsum.photos/seed/${Date.now()}_${i}_${randomCategory}/800/1200`
        } else {
          const socialCategories = ['people', 'community', 'education', 'healthcare', 'technology']
          const randomCategory = socialCategories[Math.floor(Math.random() * socialCategories.length)]
          placeholderUrl = `https://picsum.photos/seed/${Date.now()}_${i}_${randomCategory}/800/1200`
        }

        results.push({
          id: `demo_${Date.now()}_${i}`,
          prompt: prompts[i],
          url: placeholderUrl,
          aspectRatio,
          category,
          nationality: nationality || 'N/A',
          style: style || socialTheme || 'N/A',
          timestamp: new Date().toISOString(),
          downloadUrl: placeholderUrl,
          provider: 'demo',
          model: 'placeholder'
        })

        // Simular tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    return c.json({ 
      success: true, 
      images: results, 
      totalGenerated: results.length,
      mode: useRealAPI ? 'ai' : 'demo',
      provider: useRealAPI ? (userHasAPI ? userAPIConfig.provider : env.AI_API_PROVIDER) : 'placeholder'
    })

  } catch (error) {
    console.error('Erro na geração:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API para testar conexão com a API de IA
app.post('/api/test-connection', async (c) => {
  try {
    const { provider, apiKey, model } = await c.req.json()
    
    if (!provider || !apiKey) {
      return c.json({ success: false, error: 'Provider and API key are required' }, 400)
    }

    const startTime = Date.now()
    
    // Validar configuração do usuário para teste
    const { validateUserAPIConfig, generateImageWithAI } = await import('./ai-integration')
    
    const testConfig = validateUserAPIConfig({
      provider,
      apiKey,
      model: model || 'default'
    })

    if (!testConfig) {
      return c.json({
        success: false,
        error: `Invalid configuration for provider: ${provider}`
      }, 400)
    }
    
    const testResult = await generateImageWithAI(testConfig, {
      prompt: 'A simple test image, minimal style, quick generation',
      aspectRatio: '1:1',
      model: model
    })

    const responseTime = Date.now() - startTime

    if (testResult.success) {
      return c.json({
        success: true,
        provider,
        model,
        responseTime,
        message: 'API connection successful'
      })
    } else {
      return c.json({
        success: false,
        error: testResult.error || 'Failed to generate test image'
      }, 400)
    }

  } catch (error) {
    console.error('Test connection error:', error)
    return c.json({
      success: false,
      error: error.message || 'Connection test failed'
    }, 500)
  }
})

// API para gerar com sua própria API de IA (template para integração)
app.post('/api/generate-with-ai', async (c) => {
  try {
    const { prompts, aspectRatio, model = 'ideogram/V_3' } = await c.req.json()
    
    // Template para integração com API de geração de imagem
    // Você substituiria este bloco pela sua implementação real
    const results = []
    
    for (const prompt of prompts) {
      try {
        // Exemplo de como seria a chamada real:
        /*
        const response = await fetch('SUA_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer SEU_TOKEN'
          },
          body: JSON.stringify({
            query: prompt,
            aspect_ratio: aspectRatio,
            model: model,
            task_summary: 'Generate image for Meta Ads creative'
          })
        })
        
        const result = await response.json()
        const imageUrl = result.image_url // Ajuste conforme sua API
        */
        
        // Por enquanto, simulando resultado
        const imageUrl = `https://picsum.photos/800/1200?random=${Date.now()}_${Math.random()}`
        
        results.push({
          id: `ai_${Date.now()}_${Math.random()}`,
          prompt,
          url: imageUrl,
          aspectRatio,
          model,
          timestamp: new Date().toISOString()
        })
        
      } catch (error) {
        console.error(`Erro ao gerar imagem para prompt: ${prompt}`, error)
        // Continua com as outras imagens mesmo se uma falhar
      }
    }
    
    return c.json({ success: true, images: results })
    
  } catch (error) {
    console.error('Erro na geração com IA:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API para obter estatísticas
app.get('/api/stats', (c) => {
  return c.json({
    totalGenerated: 0, // Implementar contador real
    categories: ['women', 'social'],
    popularNationalities: ['brazilian', 'american', 'arabic'],
    popularStyles: ['sexy', 'bikini', 'casual']
  })
})

export default app
