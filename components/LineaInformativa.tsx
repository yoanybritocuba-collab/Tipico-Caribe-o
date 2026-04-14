'use client'

import { useState, useEffect } from 'react'

interface LineaInformativaProps {
  config: {
    activo: boolean
    texto: string
    colorTexto: string
    colorFondo: string
    tamanioLetra: number
    tipoLetra: string
    velocidad: number
    tiempoEntre: number
    altura: number
    posicion?: 'top' | 'bottom'
  }
}

export function LineaInformativa({ config }: LineaInformativaProps) {
  const [isClient, setIsClient] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(70)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)

  useEffect(() => {
    setIsClient(true)
    
    // Calcular la altura real del navbar
    const navbar = document.querySelector('header')
    if (navbar) {
      const height = navbar.offsetHeight
      setNavbarHeight(height)
    }
    
    // Detectar si el navbar está visible o no
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // El navbar se esconde después de 10px de scroll
      const navbarVisible = currentScrollY <= 10
      setIsNavbarVisible(navbarVisible)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isClient) return null
  if (!config.activo || !config.texto) return null

  const animationDuration = config.velocidad
  const pauseDuration = config.tiempoEntre || 0

  const animationStyle = pauseDuration > 0 
    ? `marquee ${animationDuration}s linear ${pauseDuration}s infinite`
    : `marquee ${animationDuration}s linear infinite`

  // Si el navbar está visible, la línea va debajo; si no, va arriba del todo
  const topPosition = isNavbarVisible ? navbarHeight : 0

  return (
    <div 
      className="fixed left-0 right-0 z-40 overflow-hidden transition-all duration-300"
      style={{ 
        backgroundColor: config.colorFondo,
        height: `${config.altura}px`,
        lineHeight: `${config.altura}px`,
        top: `${topPosition}px`,
        width: '100%'
      }}
    >
      <div
        className="whitespace-nowrap"
        style={{
          animation: animationStyle,
          fontFamily: config.tipoLetra,
          fontSize: `${config.tamanioLetra}px`,
          color: config.colorTexto,
          display: 'inline-block',
          paddingRight: '20px'
        }}
      >
        {config.texto}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { 
            transform: translateX(0);
          }
          100% { 
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}