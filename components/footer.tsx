'use client'

import { useState, useEffect } from 'react'
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
  Globe,
  Loader2
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

function HiddenLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function HiddenExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}

export function Footer() {
  const [horarioAbierto, setHorarioAbierto] = useState(false)
  const [config, setConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setConfig({
            restaurante: {
              nombre: data.nombre || 'Gavi-Club',
              direccion: data.direccion || '',
              telefono: data.telefono || '',
              whatsapp: data.whatsapp || '',
              email: data.email || ''
            },
            redesSociales: {
              instagram: data.instagram || '',
              facebook: data.facebook || ''
            },
            horarioNormal: {
              lunes: { apertura: '12:00', cierre: '00:00' },
              martes: { apertura: '12:00', cierre: '00:00' },
              miercoles: { apertura: '12:00', cierre: '00:00' },
              jueves: { apertura: '12:00', cierre: '00:00' },
              viernes: { apertura: '12:00', cierre: '02:00' },
              sabado: { apertura: '12:00', cierre: '02:00' },
              domingo: { apertura: '12:00', cierre: '00:00' }
            }
          })
        } else {
          // Configuración por defecto
          setConfig({
            restaurante: {
              nombre: 'Gavi-Club',
              direccion: 'Carrer del Tropazi, 24, Gràcia, 08012 Barcelona',
              telefono: '+34634492023',
              whatsapp: '+34634492023',
              email: 'info@gaviclub.com'
            },
            redesSociales: {
              instagram: '@gaviclub',
              facebook: ''
            },
            horarioNormal: {
              lunes: { apertura: '12:00', cierre: '00:00' },
              martes: { apertura: '12:00', cierre: '00:00' },
              miercoles: { apertura: '12:00', cierre: '00:00' },
              jueves: { apertura: '12:00', cierre: '00:00' },
              viernes: { apertura: '12:00', cierre: '02:00' },
              sabado: { apertura: '12:00', cierre: '02:00' },
              domingo: { apertura: '12:00', cierre: '00:00' }
            }
          })
        }
      } catch (error) {
        console.error('Error cargando configuración:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadConfig()
  }, [])

  const dayNames: Record<string, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  }

  if (isLoading) {
    return (
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        </div>
      </footer>
    )
  }

  if (!config) return null

  const { restaurante, horarioNormal, redesSociales } = config

  const formatHorario = (apertura: string, cierre: string) => {
    if (apertura === 'Cerrado' || cierre === 'Cerrado') return 'Cerrado'
    return `${apertura} - ${cierre}`
  }

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Columna 1: Restaurante */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary" />
              <h3 className="font-serif text-2xl font-bold text-primary">{restaurante.nombre}</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">{restaurante.direccion}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{restaurante.telefono}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{restaurante.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{restaurante.email}</span>
              </div>
            </div>
            
            {/* Redes Sociales */}
            <div className="flex gap-4 pt-2">
              {redesSociales.instagram && (
                <HiddenExternalLink 
                  href={`https://instagram.com/${redesSociales.instagram.replace('@', '')}`}
                  className="text-muted-foreground transition-all hover:text-pink-500 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </HiddenExternalLink>
              )}
              {redesSociales.facebook && (
                <HiddenExternalLink 
                  href={`https://facebook.com/${redesSociales.facebook}`}
                  className="text-muted-foreground transition-all hover:text-blue-600 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </HiddenExternalLink>
              )}
            </div>
          </div>

          {/* Columna 2: Horario */}
          <div className="space-y-4">
            <button
              onClick={() => setHorarioAbierto(!horarioAbierto)}
              className="flex items-center gap-2 font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Clock className="h-4 w-4 text-primary" />
              Horario
              {horarioAbierto ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {horarioAbierto && (
              <ul className="space-y-2 text-sm">
                {Object.entries(horarioNormal).map(([dia, horas]: [string, any]) => (
                  <li key={dia} className="flex justify-between">
                    <span className="text-muted-foreground">{dayNames[dia] || dia}</span>
                    <span className="font-medium text-foreground">
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