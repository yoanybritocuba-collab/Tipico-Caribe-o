'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

// Componente Link que oculta la URL en la barra de estado
function HiddenLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }

  return (
    <Link href={href} className={className} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  )
}

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1920&h=1080&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span>Restaurante Dominicano en Barcelona</span>
        </div>

        <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
          {t('hero.title')}
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <HiddenLink href="/carta">
            <Button size="lg" className="min-w-[160px] bg-primary text-primary-foreground hover:bg-primary/90">
              {t('hero.cta.menu')}
            </Button>
          </HiddenLink>
          <HiddenLink href="/reservas">
            <Button 
              size="lg" 
              variant="outline" 
              className="min-w-[160px] border-white text-white hover:bg-white/20"
            >
              {t('hero.cta.reserve')}
            </Button>
          </HiddenLink>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.8 en Google</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🇩🇴</span>
            <span>Cocina 100% Dominicana</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mar-Dom 12:00-23:00</span>
          </div>
        </div>
      </div>
    </section>
  )
}