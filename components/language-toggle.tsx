'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
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

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12">
      <Globe className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-500" />
    </Button>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12">
          <Globe className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('es')} className={language === 'es' ? 'bg-primary/20' : ''}>
          🇪🇸 Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-primary/20' : ''}>
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}