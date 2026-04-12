'use client'

import { useState, useEffect } from 'react'

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState('es')

  useEffect(() => {
    const saved = localStorage.getItem('gaby-club-language')
    if (saved && ['es', 'en', 'fr', 'de', 'ru'].includes(saved)) {
      setCurrentLang(saved)
    }
  }, [])

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  const handleLanguageChange = (code: string) => {
    if (code === currentLang) return
    localStorage.setItem('gaby-club-language', code)
    setCurrentLang(code)
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`h-9 w-9 rounded-full text-xl transition-all hover:scale-110 ${
            currentLang === lang.code
              ? 'bg-yellow-500/20 ring-2 ring-yellow-500'
              : 'opacity-60 hover:opacity-100'
          }`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  )
}