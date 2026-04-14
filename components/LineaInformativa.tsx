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

  useEffect(() => {
    setIsClient(true)
    // Calcular la altura real del navbar
    const navbar = document.querySelector('header')
    if (navbar) {
      const height = navbar.offsetHeight
      setNavbarHeight(height)
    }
  }, [])

  if (!isClient) return null
  if (!config.activo || !config.texto) return null

  const animationDuration = config.velocidad
  const pauseDuration = config.tiempoEntre || 0

  const animationStyle = pauseDuration > 0 
    ? `marquee ${animationDuration}s linear ${pauseDuration}s infinite`
    : `marquee ${animationDuration}s linear infinite`

  // Usar la altura real del navbar o un valor por defecto
  const topPosition = config.posicion === 'top' ? navbarHeight : 'auto'
  const bottomPosition = config.posicion === 'bottom' ? 0 : 'auto'

  return (
    <div 
      className="fixed left-0 right-0 z-40 overflow-hidden"
      style={{ 
        backgroundColor: config.colorFondo,
        height: `${config.altura}px`,
        lineHeight: `${config.altura}px`,
        top: topPosition,
        bottom: bottomPosition,
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