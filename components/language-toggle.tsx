'use client'

import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es'
    setLanguage(newLanguage)
  }

  return (
    <Button 
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12"
      onClick={toggleLanguage}
      title={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
    >
      <Globe className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
      <span className="absolute -top-0.5 -right-0.5 text-[10px] sm:text-xs leading-none">
        {language === 'es' ? '🇪🇸' : '🇺🇸'}
      </span>
    </Button>
  )
}