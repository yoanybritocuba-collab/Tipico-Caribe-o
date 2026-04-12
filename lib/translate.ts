// lib/translate.ts
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') return ''
  
  // Si el texto ya está en el idioma destino, no traducir
  if (targetLang === 'es') return text
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const response = await fetch(url)
    const data = await response.json()
    return data[0][0][0] || text
  } catch (error) {
    console.error(`Error traduciendo a ${targetLang}:`, error)
    return text
  }
}

export async function translateToAllLanguages(text: string): Promise<Record<string, string>> {
  const languages = ['en', 'fr', 'de', 'ru']
  const translations: Record<string, string> = { es: text }
  
  for (const lang of languages) {
    try {
      translations[lang] = await translateText(text, lang)
    } catch (error) {
      console.error(`Error traduciendo a ${lang}:`, error)
      translations[lang] = text
    }
  }
  return translations
}