'use client'

import { MapPin, Phone, Clock, Mail, MessageCircle, Wine, Navigation } from 'lucide-react'
import Link from 'next/link'

export default function UbicacionPage() {
  const negocio = {
    nombre: "Gaby's Club",
    direccion: "Carrer del Tropazi, 24, Gràcia, 08012 Barcelona",
    telefono: "+34634492023",
    whatsapp: "+34634492023",
    email: "info@gabysclub.com",
    horario: {
      lunes: { apertura: '12:00', cierre: '00:00' },
      martes: { apertura: '12:00', cierre: '00:00' },
      miercoles: { apertura: '12:00', cierre: '00:00' },
      jueves: { apertura: '12:00', cierre: '00:00' },
      viernes: { apertura: '12:00', cierre: '02:00' },
      sabado: { apertura: '12:00', cierre: '02:00' },
      domingo: { apertura: '12:00', cierre: '00:00' }
    }
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.direccion)}`
  const whatsappUrl = `https://wa.me/${negocio.whatsapp.replace(/[^0-9]/g, '')}`

  const dayNames: Record<string, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  }

  const formatHorario = (apertura: string, cierre: string) => {
    if (apertura === 'Cerrado' || cierre === 'Cerrado') return 'Cerrado'
    return `${apertura} - ${cierre}`
  }

  return (
    <div className="min-h-screen bg-black pt-[70px] md:pt-[85px]">
      <div className="container mx-auto px-4 py-12">
        {/* Título */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-4">
            <MapPin className="h-4 w-4 text-gold" />
            <span className="text-xs font-medium text-gold uppercase tracking-wider">Encuéntranos</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-4">
            Nuestra Ubicación
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ven a disfrutar de los mejores cócteles y tapas en el corazón de Gràcia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mapa - Estático sin iframe complejo */}
          <div className="rounded-xl overflow-hidden border border-gold/30 shadow-lg bg-gray-900">
            <div className="relative w-full h-[400px] bg-gray-800 flex items-center justify-center">
              {/* Mapa estático de Google Maps */}
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=Carrer+del+Tropazi+24+Barcelona&zoom=15&size=600x400&markers=color:gold%7CCarrer+del+Tropazi+24+Barcelona&key=AIzaSyBtZzm_wnE_lyi3F8qr8iCQdQA4TSEyozU`}
                alt="Mapa de ubicación"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Si falla la API, mostrar un mensaje
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center p-4">
                      <MapPin className="h-12 w-12 text-gold mb-2" />
                      <p class="text-white font-medium">${negocio.direccion}</p>
                      <a href="${mapsUrl}" target="_blank" class="text-gold mt-4 underline">Abrir en Google Maps</a>
                    </div>`
                  }
                }}
              />
            </div>
            <div className="p-3 bg-gray-900 text-center border-t border-gold/30">
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light text-sm flex items-center justify-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gold/30">
              <div className="flex items-center gap-3 mb-4">
                <Wine className="h-6 w-6 text-gold" />
                <h2 className="text-xl font-bold text-white">{negocio.nombre}</h2>
              </div>
              
              <div className="space-y-4">
                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-300 hover:text-gold transition-colors group"
                >
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-gold" />
                  <span className="group-hover:text-gold">{negocio.direccion}</span>
                </a>
                
                <a 
                  href={`tel:${negocio.telefono}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors group"
                >
                  <Phone className="h-5 w-5 text-gold" />
                  <span className="group-hover:text-gold">{negocio.telefono}</span>
                </a>
                
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors group"
                >
                  <MessageCircle className="h-5 w-5 text-gold" />
                  <span className="group-hover:text-gold">WhatsApp: {negocio.whatsapp}</span>
                </a>
                
                <a 
                  href={`mailto:${negocio.email}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors group"
                >
                  <Mail className="h-5 w-5 text-gold" />
                  <span className="group-hover:text-gold">{negocio.email}</span>
                </a>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gold/30">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-gold" />
                <h2 className="text-xl font-bold text-white">Horario</h2>
              </div>
              <ul className="space-y-2">
                {Object.entries(negocio.horario).map(([dia, horas]) => (
                  <li key={dia} className="flex justify-between py-1 border-b border-gray-800 last:border-0">
                    <span className="text-gray-400">{dayNames[dia] || dia}</span>
                    <span className="text-white font-medium">
                      {formatHorario(horas.apertura, horas.cierre)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botón de dirección */}
            <a 
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-gold text-black font-semibold py-3 rounded-xl hover:bg-gold-dark transition-colors"
            >
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}