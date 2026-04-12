'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState('es')

  useEffect(() => {
    const saved = localStorage.getItem('gaby-club-language')
    if (saved) {
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

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0]

  const handleLanguageChange = (code: string) => {
    console.log('Cambiando a:', code)
    localStorage.setItem('gaby-club-language', code)
    setCurrentLang(code)
    // Recargar la página para aplicar cambios
    window.location.href = window.location.href
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12">
          <span className="text-xl sm:text-2xl">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-950 border-gray-800">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer gap-2 ${currentLang === lang.code ? 'bg-yellow-500/20 text-yellow-500' : 'text-gray-300'}`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.name}</span>
            {currentLang === lang.code && <span className="ml-auto text-yellow-500">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}