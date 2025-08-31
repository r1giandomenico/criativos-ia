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
  'sexy': 'attractive, sensual, fashionable',
  'bikini': 'wearing bikini, beach setting, summer vibes',
  'casual': 'casual elegant outfit, natural beauty',
  'formal': 'elegant formal dress, sophisticated',
  'fitness': 'athletic wear, fit and healthy'
}

const SOCIAL_BENEFIT_THEMES = {
  'housing': 'social housing program, new houses, families with houses, affordable housing, government housing program, Brazilian families, dream house, home ownership',
  'education': 'education, learning, schools, students, educational programs',
  'health': 'healthcare, medical care, hospitals, health programs',
  'family': 'happy Brazilian families, children, parents, family unity, social programs',
  'community': 'community development, neighborhood, social inclusion, urban development'
}

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
    </head>
    <body class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold text-white text-center mb-8">
                🎨 Gerador de Criativos para Meta Ads
            </h1>
            
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
                                    <option value="bikini">Bikini</option>
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
                                <option value="4:3">Retrato (4:3) - Posts</option>
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
                                    onclick="downloadAllImages()"
                                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                                >
                                    📦 Download Todas
                                </button>
                                <button 
                                    onclick="exportPrompts()"
                                    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                                >
                                    📄 Exportar Prompts
                                </button>
                            </div>
                            
                            <button 
                                onclick="clearGallery()"
                                class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                            >
                                🗑️ Limpar Galeria
                            </button>
                            
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
                                <li>• <strong>Para começar:</strong> Use Ideogram (melhor qualidade)</li>
                                <li>• <strong>Para economia:</strong> Use Flux Pro (rápido e barato)</li>
                                <li>• <strong>Para premium:</strong> Use DALL-E 3 (OpenAI)</li>
                                <li>• <strong>Todas funcionam:</strong> Escolha baseado no seu orçamento</li>
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
    const { category, nationality, style, socialTheme, aspectRatio, quantity, userAPIConfig } = await c.req.json()
    
    // Validar limites
    if (quantity > 10) {
      return c.json({ success: false, error: 'Maximum 10 images per request' }, 400)
    }

    let basePrompt = ''
    if (category === 'women') {
      const womanType = WOMAN_TYPES[nationality] || WOMAN_TYPES.brazilian
      const styleDesc = STYLES[style] || STYLES.casual
      basePrompt = `${womanType}, ${styleDesc}, professional photography, high quality, detailed, beautiful lighting, 4k resolution`
    } else if (category === 'social') {
      const theme = SOCIAL_BENEFIT_THEMES[socialTheme] || SOCIAL_BENEFIT_THEMES.housing
      
      if (socialTheme === 'housing') {
        basePrompt = `Brazilian social housing program, new small houses in rows, happy Brazilian families in front of their new houses, children playing, adults smiling, government housing project, affordable housing complex, clean modern houses with red tile roofs, families holding keys, celebrating homeownership, bright sunny day, professional photography, high quality, realistic, documentary style, 4k resolution`
      } else if (socialTheme === 'family') {
        basePrompt = `Happy Brazilian family with children, parents and kids together, smiling and celebrating, in front of a new house, social program beneficiaries, diverse Brazilian family, joy and happiness, new home celebration, professional photography, high quality, realistic, warm lighting, 4k resolution`
      } else {
        basePrompt = `${theme}, Brazilian social programs, community development, inspiring, positive impact, professional photography, high quality, meaningful, uplifting, realistic, 4k resolution`
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
    } else if (category === 'social' && socialTheme === 'family') {
      variations = [
        ', Brazilian mother with children smiling in front of house',
        ', father and mother with kids celebrating new home',
        ', multi-generational Brazilian family, grandparents to children',
        ', family portrait with house in background',
        ', children playing while parents watch from new house',
        ', family embracing in front of their new home',
        ', parents lifting children in celebration of new house',
        ', extended family gathering at new house celebration'
      ]
    } else if (category === 'women') {
      variations = [
        ', smiling naturally, bright eyes',
        ', confident pose, professional lighting',
        ', elegant composition, soft focus background', 
        ', warm golden lighting, natural expression',
        ', dynamic pose, vibrant colors',
        ', candid moment, authentic smile',
        ', artistic angle, dramatic lighting',
        ', lifestyle photography, relaxed atmosphere'
      ]
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
        case '4:3':
          technicalSpecs = ', balanced composition, classic portrait ratio'
          break
        default:
          technicalSpecs = ', square composition, Instagram post format'
      }
      
      prompts.push(finalPrompt + technicalSpecs)
    }

    // Verificar se há configuração do usuário OU variáveis de ambiente
    const userHasAPI = userAPIConfig && userAPIConfig.provider && userAPIConfig.apiKey
    const serverHasAPI = env?.AI_API_PROVIDER && (
      env.IDEOGRAM_API_KEY || 
      env.OPENAI_API_KEY || 
      env.FLUX_API_KEY || 
      env.STABILITY_API_KEY
    )
    
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
