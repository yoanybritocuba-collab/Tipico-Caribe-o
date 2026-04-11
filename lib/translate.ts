// lib/translate.ts
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') return ''
  
  if (!API_KEY) {
    console.error('❌ Google Translate API Key no configurada en .env.local')
    return text
  }
  
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'es',
        format: 'text'
      })
    })

    const data = await response.json()
    
    if (data?.data?.translations?.[0]?.translatedText) {
      return data.data.translations[0].translatedText
    }
    
    console.error('Error en respuesta de Google:', data)
    return text
  } catch (error) {
    console.error('Error traduciendo:', error)
    return text
  }
}