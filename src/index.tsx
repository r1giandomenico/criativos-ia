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
  'education': 'education, learning, books, knowledge',
  'health': 'healthcare, wellness, medical care',
  'environment': 'nature, green environment, sustainability',
  'community': 'community support, helping others, volunteering',
  'technology': 'technology for good, digital inclusion'
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
                                    <option value="education">Educação</option>
                                    <option value="health">Saúde</option>
                                    <option value="environment">Meio Ambiente</option>
                                    <option value="community">Comunidade</option>
                                    <option value="technology">Tecnologia</option>
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

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// API para geração de imagens
app.post('/api/generate', async (c) => {
  try {
    const { category, nationality, style, socialTheme, aspectRatio, quantity } = await c.req.json()
    
    let basePrompt = ''
    if (category === 'women') {
      const womanType = WOMAN_TYPES[nationality] || WOMAN_TYPES.brazilian
      const styleDesc = STYLES[style] || STYLES.casual
      basePrompt = `${womanType}, ${styleDesc}, professional photography, high quality, detailed, beautiful lighting, 4k resolution`
    } else if (category === 'social') {
      const theme = SOCIAL_BENEFIT_THEMES[socialTheme] || SOCIAL_BENEFIT_THEMES.education
      basePrompt = `${theme}, inspiring, positive impact, professional photography, high quality, meaningful, uplifting, 4k resolution`
    }

    // Adicionar variações para múltiplas imagens
    const prompts = []
    const variations = [
      ', smiling naturally, bright eyes',
      ', confident pose, professional lighting',
      ', elegant composition, soft focus background', 
      ', warm golden lighting, natural expression',
      ', dynamic pose, vibrant colors',
      ', candid moment, authentic smile',
      ', artistic angle, dramatic lighting',
      ', lifestyle photography, relaxed atmosphere'
    ]

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

    // Para demonstração, vou usar placeholders de alta qualidade
    // Na implementação real, você substituiria por sua API de geração
    const results = await Promise.all(prompts.map(async (prompt, index) => {
      // Aqui você faria a chamada para sua API de geração de imagem
      // Exemplo: const imageUrl = await generateImageWithAI(prompt, aspectRatio)
      
      // Por enquanto, usando placeholder com diferentes categorias para demonstração
      let placeholderUrl = ''
      if (category === 'women') {
        const womanCategories = ['fashion', 'portrait', 'beauty', 'lifestyle', 'model']
        const randomCategory = womanCategories[Math.floor(Math.random() * womanCategories.length)]
        placeholderUrl = `https://picsum.photos/seed/${Date.now()}_${index}_${randomCategory}/800/1200`
      } else {
        const socialCategories = ['people', 'community', 'education', 'healthcare', 'technology']
        const randomCategory = socialCategories[Math.floor(Math.random() * socialCategories.length)]
        placeholderUrl = `https://picsum.photos/seed/${Date.now()}_${index}_${randomCategory}/800/1200`
      }

      return {
        id: `img_${Date.now()}_${index}`,
        prompt,
        url: placeholderUrl,
        aspectRatio,
        category,
        nationality: nationality || 'N/A',
        style: style || socialTheme || 'N/A',
        timestamp: new Date().toISOString(),
        downloadUrl: placeholderUrl // Para download direto
      }
    }))

    return c.json({ success: true, images: results, totalGenerated: quantity })
  } catch (error) {
    console.error('Erro na geração:', error)
    return c.json({ success: false, error: error.message }, 400)
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
