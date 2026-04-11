'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Componente de enlace que oculta la URL en la barra de estado
function HiddenWhatsAppLink({ href, children, onMouseEnter, onMouseLeave, className }: { 
  href: string; 
  children: React.ReactNode; 
  onMouseEnter?: () => void; 
  onMouseLeave?: () => void;
  className?: string;
}) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onMouseEnter) onMouseEnter()
  }

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </a>
  )
}

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const whatsappNumber = "34682491444"
  const message = "Hola, me gustaría hacer una reserva"
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-500 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      )}
    >
      <div className="absolute inset-0 rounded-full animate-ping-slow bg-green-400/60" />
      <div className="absolute inset-0 rounded-full animate-ping-slower bg-green-400/40" />
      <div className="absolute inset-0 rounded-full animate-ping-slowest bg-green-400/20" />
      
      {isHovered && (
        <div className="absolute inset-0 rounded-full animate-ping bg-green-500/30" />
      )}

      <HiddenWhatsAppLink
        href={whatsappLink}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
          "hover:scale-110 active:scale-95"
        )}
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
      </HiddenWhatsAppLink>
    </div>
  )
}