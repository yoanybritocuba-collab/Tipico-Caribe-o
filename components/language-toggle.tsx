'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/lib/i18n'

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  const currentLanguage = languages.find(l => l.code === language) || languages[0]

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12">
        <span className="text-xl sm:text-2xl">🇪🇸</span>
      </Button>
    )
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
            onClick={() => setLanguage(lang.code as any)}
            className={`cursor-pointer gap-2 ${language === lang.code ? 'bg-yellow-500/20 text-yellow-500' : 'text-gray-300'}`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && <span className="ml-auto text-yellow-500">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}