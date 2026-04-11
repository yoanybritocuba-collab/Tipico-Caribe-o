'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Instagram, 
  Facebook, 
  Phone, 
  Mail, 
  Clock, 
  Utensils, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  MessageCircle,
  Globe
} from 'lucide-react'
import { useConfiguracion } from '@/hooks/useConfiguracion'

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

// Componente para enlaces externos que oculta la URL
function HiddenExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={handleMouseEnter} className={className}>
      {children}
    </a>
  )
}

// Función para formatear el horario a mostrar
function formatHorario(apertura: string, cierre: string): string {
  if (apertura === 'Cerrado' || cierre === 'Cerrado') {
    return 'Cerrado'
  }
  return `${apertura} - ${cierre}`
}

// Componente para enlace de teléfono clicable
function PhoneLink({ number, children }: { number: string; children: React.ReactNode }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }
  
  // Limpiar el número para el enlace telefónico
  const cleanNumber = number.replace(/[^0-9+]/g, '')
  
  return (
    <a 
      href={`tel:${cleanNumber}`}
      onMouseEnter={handleMouseEnter}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
    >
      {children}
    </a>
  )
}

// Componente para enlace de WhatsApp clicable
function WhatsAppLink({ number, children }: { number: string; children: React.ReactNode }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }
  
  // Limpiar el número para WhatsApp (solo dígitos)
  const cleanNumber = number.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}`
  
  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
    >
      {children}
    </a>
  )
}

// Componente para enlace de email clicable
function EmailLink({ email, children }: { email: string; children: React.ReactNode }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }
  
  return (
    <a 
      href={`mailto:${email}`}
      onMouseEnter={handleMouseEnter}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
    >
      {children}
    </a>
  )
}

// Componente para enlace de dirección (Google Maps)
function MapLink({ address, children }: { address: string; children: React.ReactNode }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }
  
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  
  return (
    <a 
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      className="flex items-start gap-2 text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
    >
      {children}
    </a>
  )
}

export function Footer() {
  const [horarioAbierto, setHorarioAbierto] = useState(false)
  const { config, isLoading } = useConfiguracion()

  const dayNames: Record<string, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  }

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Si no hay configuración, no mostrar nada
  if (!config) {
    return null
  }

  const { restaurante, horarioNormal, redesSociales } = config

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Columna 1: Restaurante - TODO CLICABLE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary" />
              <h3 className="font-serif text-2xl font-bold text-primary">{restaurante.nombre}</h3>
            </div>
            <div className="space-y-3 text-sm">
              
              {/* Dirección - Abre Google Maps */}
              <MapLink address={restaurante.direccion}>
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                <span className="group-hover:text-blue-500 transition-colors">{restaurante.direccion}</span>
              </MapLink>
              
              {/* Teléfono - Abre marcador */}
              <PhoneLink number={restaurante.telefono}>
                <Phone className="h-4 w-4 group-hover:text-green-500 transition-colors" />
                <span className="group-hover:text-green-500 transition-colors">{restaurante.telefono}</span>
              </PhoneLink>
              
              {/* WhatsApp - Abre WhatsApp */}
              <WhatsAppLink number={restaurante.whatsapp}>
                <MessageCircle className="h-4 w-4 group-hover:text-green-500 transition-colors" />
                <span className="group-hover:text-green-500 transition-colors">{restaurante.whatsapp}</span>
              </WhatsAppLink>
              
              {/* Email - Abre correo */}
              <EmailLink email={restaurante.email}>
                <Mail className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-blue-400 transition-colors">{restaurante.email}</span>
              </EmailLink>
            </div>
            
            {/* Redes Sociales */}
            <div className="flex gap-4 pt-2">
              {redesSociales.instagram && (
                <HiddenExternalLink 
                  href={redesSociales.instagram.startsWith('http') ? redesSociales.instagram : `https://instagram.com/${redesSociales.instagram.replace('@', '')}`}
                  className="text-muted-foreground transition-all hover:text-pink-500 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </HiddenExternalLink>
              )}
              {redesSociales.facebook && (
                <HiddenExternalLink 
                  href={redesSociales.facebook.startsWith('http') ? redesSociales.facebook : `https://facebook.com/${redesSociales.facebook}`}
                  className="text-muted-foreground transition-all hover:text-blue-600 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </HiddenExternalLink>
              )}
            </div>
          </div>

          {/* Columna 2: Horario desplegable */}
          <div className="space-y-4">
            <button
              onClick={() => setHorarioAbierto(!horarioAbierto)}
              className="flex items-center gap-2 font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Clock className="h-4 w-4 text-primary" />
              Horario
              {horarioAbierto ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {horarioAbierto && (
              <ul className="space-y-2 text-sm animate-in slide-in-from-top-2 duration-200">
                {Object.entries(horarioNormal).map(([dia, horas]) => (
                  <li key={dia} className="flex justify-between">
                    <span className="text-muted-foreground">{dayNames[dia] || dia}</span>
                    <span className={`font-medium ${horas.apertura === 'Cerrado' ? 'text-red-500' : 'text-foreground'}`}>
                      {formatHorario(horas.apertura, horas.cierre)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Columna 3: Enlaces rápidos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><HiddenLink href="/carta" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><Globe className="h-3 w-3" /> Carta</HiddenLink></li>
              <li><HiddenLink href="/reservas" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><Globe className="h-3 w-3" /> Reservas</HiddenLink></li>
              <li><HiddenLink href="/sugerencias" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><Globe className="h-3 w-3" /> Sugerencias</HiddenLink></li>
              <li><HiddenLink href="/sobre-nosotros" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><Globe className="h-3 w-3" /> Sobre nosotros</HiddenLink></li>
              <li><HiddenLink href="/ubicacion" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><Globe className="h-3 w-3" /> Ubicación</HiddenLink></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {restaurante.nombre}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}