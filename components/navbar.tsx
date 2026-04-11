'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/carta', labelKey: 'nav.menu' },
  { href: '/sugerencias', labelKey: 'nav.suggestions' },
  { href: '/ubicacion', labelKey: 'nav.location' },
  { href: '/admin/login', labelKey: 'nav.admin' },
]

function HiddenLink({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }

  return (
    <Link href={href} onClick={onClick} className={className} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const pathname = usePathname()
  const { t } = useI18n()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY <= 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-3 sm:px-4">
          {/* Fila: Logo + Iconos */}
          <div className="flex items-center justify-between py-2 sm:py-3">
            {/* Logo - MÁS GRANDE EN MÓVIL */}
            <HiddenLink href="/" className="flex items-center gap-0 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Típico Caribeño" 
                className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-red-600 bg-clip-text text-transparent">
                  Típico
                </span>
                <span className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-red-600 bg-clip-text text-transparent -ml-1 sm:-ml-2">
                  Caribeño
                </span>
              </div>
            </HiddenLink>

            {/* Iconos - MÁS JUNTOS EN MÓVIL */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <HiddenLink href="/admin/login">
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12">
                  <UserCog className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                </Button>
              </HiddenLink>
              {/* Menú hamburguesa ROJO */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Menú desplegable */}
          {isOpen && (
            <div className="border-t mt-2 py-3 sm:py-4">
              <div className="flex flex-col space-y-2 sm:space-y-3 px-2 sm:px-4">
                {navLinks.map((link) => (
                  <HiddenLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium',
                      pathname === link.href
                        ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {t(link.labelKey)}
                  </HiddenLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="h-[85px] sm:h-[95px] md:h-[110px] lg:h-[120px]" />
    </>
  )
}