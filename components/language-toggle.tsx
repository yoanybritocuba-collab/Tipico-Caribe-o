'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()
  const [isChanging, setIsChanging] = useState(false)

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  // Encontrar el idioma actual para mostrar su bandera
  const currentLanguage = languages.find(l => l.code === language) || languages[0]
  
  // Encontrar el siguiente idioma para el tooltip
  const currentIndex = languages.findIndex(l => l.code === language)
  const nextIndex = (currentIndex + 1) % languages.length
  const nextLanguage = languages[nextIndex]

  const handleClick = () => {
    setIsChanging(true)
    setLanguage(nextLanguage.code as any)
  }

  return (
    <>
      {isChanging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
            <p className="text-white text-sm">Cambiando idioma...</p>
          </div>
        </div>
      )}
      <button
        onClick={handleClick}
        className="relative h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-all"
        title={`Cambiar a ${nextLanguage.name}`}
      >
        {/* Mostrar la bandera del idioma ACTUAL */}
        <span className="text-lg">{currentLanguage.flag}</span>
        {/* Mostrar la bandera del próximo idioma en la esquina */}
        <span className="absolute -bottom-1 -right-1 text-[10px] leading-none drop-shadow-md">
          {nextLanguage.flag}
        </span>
      </button>
    </>
  )
}