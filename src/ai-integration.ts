// Integração com APIs de IA para geração de imagens

interface AIConfig {
  provider: string
  apiKey: string
  endpoint: string
  model: string
}

interface GenerateImageRequest {
  prompt: string
  aspectRatio: string
  model?: string
}

interface GenerateImageResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

// Configurações das APIs suportadas
const AI_PROVIDERS = {
  pollinations: {
    endpoint: 'https://pollinations.ai/p',
    defaultModel: 'flux',
    headers: (apiKey: string) => ({}), // Pollinations é gratuito, sem headers
    formatRequest: (prompt: string, aspectRatio: string, model: string) => {
      // Mapear aspect ratio para dimensões
      const sizeMap: Record<string, { width: number, height: number }> = {
        '1:1': { width: 1024, height: 1024 },
        '16:9': { width: 1365, height: 768 },
        '9:16': { width: 768, height: 1365 },
        '4:5': { width: 820, height: 1024 },
        '3:2': { width: 1365, height: 910 }
      }
      
      const size = sizeMap[aspectRatio] || sizeMap['1:1']
      const seed = Math.floor(Math.random() * 1000000)
      
      return {
        prompt,
        width: size.width,
        height: size.height,
        seed,
        model: model || 'flux'
      }
    },
    parseResponse: (data: any, imageUrl: string) => ({
      success: true,
      imageUrl: imageUrl
    })
  },

  ideogram: {
    endpoint: 'https://api.ideogram.ai/generate',
    defaultModel: 'V_3',
    headers: (apiKey: string) => ({
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    }),
    formatRequest: (prompt: string, aspectRatio: string, model: string) => ({
      image_request: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        model: model || 'V_3',
        magic_prompt_option: 'AUTO'
      }
    }),
    parseResponse: (data: any) => ({
      success: true,
      imageUrl: data.data?.[0]?.url || null
    })
  },

  openai: {
    endpoint: 'https://api.openai.com/v1/images/generations',
    defaultModel: 'dall-e-3',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    formatRequest: (prompt: string, aspectRatio: string, model: string) => {
      // DALL-E só suporta alguns aspectos específicos
      const sizeMap: Record<string, string> = {
        '1:1': '1024x1024',
        '16:9': '1792x1024', 
        '9:16': '1024x1792'
      }
      return {
        model: model || 'dall-e-3',
        prompt: prompt,
        size: sizeMap[aspectRatio] || '1024x1024',
        quality: 'hd',
        n: 1
      }
    },
    parseResponse: (data: any) => ({
      success: true,
      imageUrl: data.data?.[0]?.url || null
    })
  },

  flux: {
    endpoint: 'https://api.bfl.ml/v1/flux-pro-1.1',
    defaultModel: 'flux-pro-1.1',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    formatRequest: (prompt: string, aspectRatio: string, model: string) => ({
      prompt: prompt,
      width: aspectRatio === '16:9' ? 1344 : aspectRatio === '9:16' ? 768 : 1024,
      height: aspectRatio === '16:9' ? 768 : aspectRatio === '9:16' ? 1344 : 1024,
      prompt_upsampling: false,
      seed: Math.floor(Math.random() * 1000000),
      safety_tolerance: 2,
      output_format: 'jpeg'
    }),
    parseResponse: (data: any) => ({
      success: true,
      imageUrl: data.result?.sample || null
    })
  },

  stability: {
    endpoint: 'https://api.stability.ai/v2beta/stable-image/generate/core',
    defaultModel: 'core',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'image/*'
      // Não incluir Content-Type para FormData
    }),
    formatRequest: (prompt: string, aspectRatio: string, model: string) => {
      // Stability AI requer FormData
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('output_format', 'jpeg')
      
      // Mapear aspect ratio
      const ratioMap: Record<string, string> = {
        '1:1': '1:1',
        '16:9': '16:9',
        '9:16': '9:16',
        '4:3': '4:3'
      }
      formData.append('aspect_ratio', ratioMap[aspectRatio] || '1:1')
      
      return formData
    },
    parseResponse: async (response: Response) => {
      // Stability AI retorna imagem binária
      if (response.ok) {
        try {
          const arrayBuffer = await response.arrayBuffer()
          // Converter ArrayBuffer para base64 de forma segura
          const bytes = new Uint8Array(arrayBuffer)
          let binary = ''
          const chunkSize = 8192
          
          for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize)
            binary += String.fromCharCode.apply(null, Array.from(chunk))
          }
          
          const base64 = btoa(binary)
          
          return {
            success: true,
            imageUrl: `data:image/jpeg;base64,${base64}`
          }
        } catch (error) {
          console.error('Error processing image data:', error)
          return { success: false, error: 'Failed to process image data' }
        }
      }
      
      // Em caso de erro HTTP, tentar ler como JSON
      try {
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.errors ? errorData.errors.join(', ') : 'Failed to generate image' 
        }
      } catch {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
      }
    }
  }
}

export async function generateImageWithAI(
  config: AIConfig,
  request: GenerateImageRequest
): Promise<GenerateImageResponse> {
  try {
    const provider = AI_PROVIDERS[config.provider as keyof typeof AI_PROVIDERS]
    
    if (!provider) {
      return { success: false, error: `Provider ${config.provider} not supported` }
    }

    console.log(`Generating image with ${config.provider}:`, {
      prompt: request.prompt.substring(0, 100) + '...',
      aspectRatio: request.aspectRatio
    })

    // Pollinations tem implementação especial (GET request via URL)
    if (config.provider === 'pollinations') {
      const params = provider.formatRequest(
        request.prompt,
        request.aspectRatio,
        request.model || provider.defaultModel
      )
      
      // Construir URL com parâmetros
      const url = new URL(config.endpoint + '/' + encodeURIComponent(params.prompt))
      url.searchParams.set('width', params.width.toString())
      url.searchParams.set('height', params.height.toString())
      url.searchParams.set('seed', params.seed.toString())
      url.searchParams.set('model', params.model)
      url.searchParams.set('nologo', 'true') // Remove watermark
      
      const finalUrl = url.toString()
      console.log('Pollinations URL:', finalUrl)
      
      // Para Pollinations, a URL já é a imagem final
      return provider.parseResponse(null, finalUrl)
    }

    const headers = provider.headers(config.apiKey)
    const requestBody = provider.formatRequest(
      request.prompt, 
      request.aspectRatio, 
      request.model || provider.defaultModel
    )

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers,
      body: requestBody instanceof FormData ? requestBody : JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error (${response.status}):`, errorText)
      return { 
        success: false, 
        error: `API Error: ${response.status} - ${errorText.substring(0, 200)}` 
      }
    }

    // Parse response baseado no provider
    if (config.provider === 'stability') {
      // Stability AI tem parseResponse especial que lida com Response diretamente
      return await provider.parseResponse(response)
    } else {
      // Outros providers usam JSON
      const data = await response.json()
      return provider.parseResponse(data)
    }

  } catch (error) {
    console.error('Image generation error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Função auxiliar para validar configuração
export function validateAIConfig(env: any): AIConfig | null {
  const provider = env.AI_API_PROVIDER || 'pollinations' // Pollinations como padrão (gratuito)
  
  const apiKeyMap = {
    pollinations: 'free', // Pollinations não precisa de API key
    ideogram: env.IDEOGRAM_API_KEY,
    openai: env.OPENAI_API_KEY, 
    flux: env.FLUX_API_KEY,
    stability: env.STABILITY_API_KEY
  }

  const apiKey = apiKeyMap[provider as keyof typeof apiKeyMap]
  
  if (!apiKey) {
    console.error(`No API key found for provider: ${provider}`)
    return null
  }

  const providerConfig = AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS]
  
  return {
    provider,
    apiKey,
    endpoint: env.AI_API_ENDPOINT || providerConfig.endpoint,
    model: env.AI_MODEL_DEFAULT || providerConfig.defaultModel
  }
}

// Função para validar configuração do usuário
export function validateUserAPIConfig(userConfig: any): AIConfig | null {
  if (!userConfig || !userConfig.provider) {
    return null
  }
  
  const provider = userConfig.provider
  const providerConfig = AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS]
  
  if (!providerConfig) {
    console.error(`Unsupported provider: ${provider}`)
    return null
  }
  
  // Pollinations não precisa de API key
  if (provider === 'pollinations') {
    return {
      provider,
      apiKey: 'free',
      endpoint: providerConfig.endpoint,
      model: userConfig.model || providerConfig.defaultModel
    }
  }
  
  // Outros providers precisam de API key
  if (!userConfig.apiKey) {
    return null
  }

  return {
    provider,
    apiKey: userConfig.apiKey,
    endpoint: providerConfig.endpoint,
    model: userConfig.model || providerConfig.defaultModel
  }
}