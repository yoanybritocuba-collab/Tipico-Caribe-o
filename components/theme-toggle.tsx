'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12">
        <Sun className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <Sun className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-red-600" />
      <Moon className="absolute h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-red-600" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}