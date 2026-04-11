'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { initHistory, pushToHistory, goBack, handleBackOnHome, resetPressCounter } from '@/lib/navigation-history'

// Este componente NO muestra ningún botón visible
// Solo maneja el evento del botón físico de atrás del móvil
export function BackButtonHandler() {
  const pathname = usePathname()
  const router = useRouter()
  const isInitialized = useRef(false)
  const isHome = pathname === '/'
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mostrar mensaje temporal (sin confirm, no molesto)
  const showToastMessage = (message: string) => {
    // Eliminar toast anterior si existe
    const existingToast = document.getElementById('back-toast-message')
    if (existingToast) {
      existingToast.remove()
    }
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }

    const toast = document.createElement('div')
    toast.id = 'back-toast-message'
    toast.textContent = message
    toast.style.position = 'fixed'
    toast.style.bottom = '100px'
    toast.style.left = '50%'
    toast.style.transform = 'translateX(-50%)'
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.85)'
    toast.style.color = 'white'
    toast.style.padding = '10px 20px'
    toast.style.borderRadius = '40px'
    toast.style.fontSize = '14px'
    toast.style.fontWeight = '500'
    toast.style.zIndex = '9999'
    toast.style.backdropFilter = 'blur(8px)'
    toast.style.border = '1px solid rgba(255,255,255,0.2)'
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
    toast.style.whiteSpace = 'nowrap'
    toast.style.fontFamily = 'system-ui, -apple-system, sans-serif'
    document.body.appendChild(toast)

    toastTimeoutRef.current = setTimeout(() => {
      toast.remove()
    }, 2000)
  }

  // Inicializar historial al montar
  useEffect(() => {
    if (!isInitialized.current) {
      initHistory(pathname)
      isInitialized.current = true
    }
  }, [pathname])

  // Guardar cada cambio de ruta en el historial
  useEffect(() => {
    if (isInitialized.current) {
      pushToHistory(pathname)
    }
  }, [pathname])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  // Manejar el botón de atrás del navegador (funciona en móviles y desktop)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      
      // Añadir estado al historial para mantener el control
      window.history.pushState(null, '', window.location.href)
      
      if (isHome) {
        // En home: contar clics para salir
        const { shouldExit, remainingClicks } = handleBackOnHome()
        
        if (shouldExit) {
          // Salir de la aplicación/website
          showToastMessage('Saliendo...')
          setTimeout(() => {
            // Intentar salir de la web app
            if (window.history.length <= 1) {
              // Si no hay historial, sugerir cerrar pestaña
              showToastMessage('Cierra la pestaña para salir')
            } else {
              // Intentar ir atrás hasta salir
              window.history.back()
            }
          }, 100)
        } else {
          // Mostrar cuántos clics faltan
          if (remainingClicks === 2) {
            showToastMessage('Presiona atrás 2 veces más para salir')
          } else if (remainingClicks === 1) {
            showToastMessage('Presiona atrás 1 vez más para salir')
          }
        }
      } else {
        // No está en home: intentar volver por el historial
        const hasPrevious = goBack()
        
        if (hasPrevious) {
          router.back()
        } else {
          // Si no hay historial, ir a home
          router.push('/')
          showToastMessage('Volviendo al inicio')
          resetPressCounter()
        }
      }
    }

    // Añadir un estado al historial para que popstate funcione correctamente
    window.history.pushState(null, '', window.location.href)
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isHome, router])

  // Este componente no renderiza nada visible
  return null
}