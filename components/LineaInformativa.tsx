'use client'

import { useState, useEffect, useRef } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export function LineaInformativa() {
  const [config, setConfig] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setConfig({
            activo: data.tickerActivo || false,
            texto: data.tickerTexto || '',
            colorTexto: data.tickerColorTexto || '#d1b275',
            colorFondo: data.tickerColorFondo || '#000000',
            tamanioLetra: data.tickerTamanioLetra || 14,
            tipoLetra: data.tickerTipoLetra || 'Arial',
            velocidad: data.tickerVelocidad || 15,
            altura: data.tickerAltura || 40,
            posicion: data.tickerPosicion || 'top'
          })
        }
      } catch (error) {
        console.error('Error cargando línea informativa:', error)
      }
    }
    loadConfig()
  }, [])

  useEffect(() => {
    if (!config?.activo) return

    const interval = setInterval(() => {
      setIsVisible(false)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, 100)
    }, (config.velocidad + 2) * 1000)

    return () => {
      clearInterval(interval)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [config?.activo, config?.velocidad])

  if (!config || !config.activo || !config.texto) return null

  const positionClass = config.posicion === 'top' ? 'top-0' : 'bottom-0'

  return (
    <div 
      className={`fixed left-0 right-0 ${positionClass} z-40 w-full overflow-hidden`}
      style={{ 
        backgroundColor: config.colorFondo,
        height: `${config.altura}px`,
        lineHeight: `${config.altura}px`
      }}
    >
      <div
        className="whitespace-nowrap"
        style={{
          animation: `marquee ${config.velocidad}s linear infinite`,
          fontFamily: config.tipoLetra,
          fontSize: `${config.tamanioLetra}px`,
          color: config.colorTexto,
          display: 'inline-block',
          opacity: isVisible ? 1 : 0,
          paddingRight: '20px'
        }}
      >
        {config.texto}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}