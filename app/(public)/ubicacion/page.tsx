'use client'

import { MapPin, Phone, Mail, Clock, Navigation, Bus, Car, Train, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import { useConfiguracion } from '@/hooks/useConfiguracion'

// Componente para enlaces que oculta la URL
function HiddenLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={handleMouseEnter} className={className}>
      {children}
    </a>
  )
}

// Componente para enlace de teléfono
function PhoneLink({ number, children }: { number: string; children: React.ReactNode }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }
  const cleanNumber = number.replace(/[^0-9+]/g, '')
  
  return (
    <a href={`tel:${cleanNumber}`} onMouseEnter={handleMouseEnter} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
      {children}
    </a>
  )
}

// Componente para enlace de WhatsApp
function WhatsAppLink({ number, children }: { number: string; children: React.ReactNode }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }
  const cleanNumber = number.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}`
  
  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onMouseEnter={handleMouseEnter} className="text-muted-foreground hover:text-green-500 transition-colors flex items-center gap-2">
      {children}
    </a>
  )
}

// Función para formatear horario
function formatHorario(apertura: string, cierre: string): string {
  if (apertura === 'Cerrado' || cierre === 'Cerrado') {
    return 'Cerrado'
  }
  return `${apertura} - ${cierre}`
}

const dayKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const
type DayKey = typeof dayKeys[number]

const dayNames: Record<DayKey, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo'
}

const transportOptions = [
  {
    icon: Train,
    titleEs: 'Metro L5',
    titleEn: 'Metro L5',
    descriptionEs: 'Estación Sant Pau | Dos de Maig - 2 min caminando',
    descriptionEn: 'Sant Pau | Dos de Maig Station - 2 min walk'
  },
  {
    icon: Bus,
    titleEs: 'Autobuses',
    titleEn: 'Buses',
    descriptionEs: 'Líneas H8, 47, 192 - Parada Industria - Dos de Maig',
    descriptionEn: 'Lines H8, 47, 192 - Industria - Dos de Maig stop'
  },
  {
    icon: Car,
    titleEs: 'Parking',
    titleEn: 'Parking',
    descriptionEs: 'Aparcamiento público en Carrer de la Indústria (zona regulada)',
    descriptionEn: 'Public parking on Carrer de la Indústria (regulated zone)'
  }
]

export default function LocationPage() {
  const { t, language } = useI18n()
  const { config, isLoading } = useConfiguracion()

  // Mostrar loading mientras carga
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  // Si no hay configuración, mostrar mensaje
  if (!config) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando información...</p>
      </div>
    )
  }

  const { restaurante, horarioNormal } = config
  
  // Construir URL de Google Maps para el botón "Cómo llegar"
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurante.direccion)}`
  
  // Coordenadas EXACTAS de Típico Caribeño (desde Google Maps)
  const latitud = 41.4112823
  const longitud = 2.1770907
  
  // URL de OpenStreetMap con las coordenadas exactas
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitud - 0.005},${latitud - 0.005},${longitud + 0.005},${latitud + 0.005}&layer=mapnik&marker=${latitud},${longitud}`

  // Obtener el día actual en español para comparar
  const todaySpanish = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase()
  const todayMap: Record<string, DayKey> = {
    'lunes': 'lunes',
    'martes': 'martes',
    'miércoles': 'miercoles',
    'jueves': 'jueves',
    'viernes': 'viernes',
    'sábado': 'sabado',
    'domingo': 'domingo'
  }
  const today = todayMap[todaySpanish] || 'lunes'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            Encuéntranos
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Visítanos en Sant Martí, junto a la estación de metro Sant Pau | Dos de Maig
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Map - OpenStreetMap con coordenadas exactas */}
        <div className="mb-12 overflow-hidden rounded-2xl border shadow-lg">
          <div className="aspect-[21/9] w-full">
            <iframe
              src={osmMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Ubicación del restaurante"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Address & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <MapPin className="h-5 w-5 text-primary" />
                Dirección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-medium">{restaurante.nombre}</p>
                <p className="text-muted-foreground">{restaurante.direccion}</p>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <PhoneLink number={restaurante.telefono}>
                  <Phone className="h-4 w-4" />
                  {restaurante.telefono}
                </PhoneLink>
                
                <WhatsAppLink number={restaurante.whatsapp}>
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </WhatsAppLink>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a 
                    href={`mailto:${restaurante.email}`}
                    onMouseEnter={(e) => e.preventDefault()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {restaurante.email}
                  </a>
                </div>
              </div>

              <HiddenLink href={mapsUrl} className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Navigation className="mr-2 h-4 w-4" />
                  Cómo llegar
                </Button>
              </HiddenLink>
            </CardContent>
          </Card>

          {/* Opening Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Clock className="h-5 w-5 text-primary" />
                Horario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dayKeys.map((day) => {
                  const horas = horarioNormal[day]
                  const horarioTexto = formatHorario(horas.apertura, horas.cierre)
                  const isToday = today === day
                  
                  return (
                    <div 
                      key={day} 
                      className={`flex justify-between rounded-md px-2 py-1.5 ${isToday ? 'bg-primary/10' : ''}`}
                    >
                      <span className={`${isToday ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                        {dayNames[day]}
                        {isToday && <span className="ml-2 text-xs">(Hoy)</span>}
                      </span>
                      <span className={horarioTexto === 'Cerrado' ? 'text-red-500 font-medium' : (isToday ? 'font-medium text-primary' : '')}>
                        {horarioTexto}
                      </span>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-6 rounded-lg bg-accent/10 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Nota:</strong> Los horarios pueden variar en días festivos. 
                  Recomendamos llamar para confirmar en fechas especiales.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How to get there - CORREGIDO SEGÚN UBICACIÓN REAL */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Cómo llegar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transportOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {language === 'en' ? option.titleEn : option.titleEs}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? option.descriptionEn : option.descriptionEs}
                      </p>
                    </div>
                  </div>
                )
              })}

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Estamos ubicados en Carrer de la Indústria, a solo 2 minutos de la 
                  estación de metro Sant Pau | Dos de Maig (L5).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional info - CORREGIDO SIN TERRAZA */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary/5 text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🪑</span>
              </div>
              <h3 className="font-semibold">60 Plazas</h3>
              <p className="text-sm text-muted-foreground">Interior climatizado</p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="font-semibold">Comida para llevar</h3>
              <p className="text-sm text-muted-foreground">Pide para recoger</p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="font-semibold">Accesible</h3>
              <p className="text-sm text-muted-foreground">Sin barreras arquitectónicas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">📶</span>
              </div>
              <h3 className="font-semibold">WiFi Gratis</h3>
              <p className="text-sm text-muted-foreground">Para todos nuestros clientes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}