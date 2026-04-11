'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Calendar, X, Volume2, VolumeX, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Notificacion {
  id: string
  titulo: string
  descripcion: string
  createdAt: string
  leida: boolean
  clienteNombre?: string
  personas?: number
  fecha?: string
  hora?: string
}

export function Notificaciones() {
  const router = useRouter()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [nuevas, setNuevas] = useState(0)
  const [abierto, setAbierto] = useState(false)
  const [sonidoActivado, setSonidoActivado] = useState(false)
  const [sonando, setSonando] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sonidoIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const sonidoGuardado = localStorage.getItem('notificaciones-sonido-activado')
    if (sonidoGuardado === 'true') {
      setSonidoActivado(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notificaciones-sonido-activado', String(sonidoActivado))
  }, [sonidoActivado])

  const playSound = () => {
    if (!sonidoActivado) return
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/notification.mp3')
      }
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log('Error:', e))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const iniciarSonidoRepetitivo = () => {
    if (sonidoIntervalRef.current) clearInterval(sonidoIntervalRef.current)
    if (sonidoActivado && nuevas > 0) {
      setSonando(true)
      playSound()
      sonidoIntervalRef.current = setInterval(() => {
        if (nuevas > 0 && sonidoActivado) playSound()
      }, 60000)
    } else {
      setSonando(false)
      if (sonidoIntervalRef.current) {
        clearInterval(sonidoIntervalRef.current)
        sonidoIntervalRef.current = null
      }
    }
  }

  const activarSonido = () => {
    setSonidoActivado(true)
    const audio = new Audio('/sounds/notification.mp3')
    audio.play().catch(e => console.log('Error:', e))
    iniciarSonidoRepetitivo()
  }

  const desactivarSonido = () => {
    setSonidoActivado(false)
    if (sonidoIntervalRef.current) {
      clearInterval(sonidoIntervalRef.current)
      sonidoIntervalRef.current = null
    }
    setSonando(false)
  }

  const verificarReservas = async () => {
    try {
      const res = await fetch(`/api/notifications?_=${Date.now()}`)
      const data = await res.json()
      if (data.nuevasReservas && data.nuevasReservas.length > 0) {
        const nuevasNotif = data.nuevasReservas.map((reserva: any) => ({
          id: reserva.id,
          titulo: '📅 Nueva reserva',
          descripcion: `${reserva.clienteNombre || 'Cliente'} - ${reserva.personas || '?'} personas`,
          createdAt: reserva.createdAt,
          leida: false,
          clienteNombre: reserva.clienteNombre,
          personas: reserva.personas,
          fecha: reserva.fecha,
          hora: reserva.hora
        }))
        setNotificaciones(nuevasNotif)
        setNuevas(nuevasNotif.length)
        if (sonidoActivado && nuevasNotif.length > 0) iniciarSonidoRepetitivo()
      } else {
        setNotificaciones([])
        setNuevas(0)
        setSonando(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    verificarReservas()
    intervalRef.current = setInterval(verificarReservas, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (sonidoIntervalRef.current) clearInterval(sonidoIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    iniciarSonidoRepetitivo()
  }, [nuevas, sonidoActivado])

  const marcarComoLeidas = () => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
    setNuevas(0)
    setSonando(false)
    if (sonidoIntervalRef.current) clearInterval(sonidoIntervalRef.current)
  }

  const eliminarNotificacion = (id: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id))
    const nuevasCount = notificaciones.filter(n => n.id !== id && !n.leida).length
    setNuevas(nuevasCount)
  }

  const volverAlPanel = () => {
    setAbierto(false)
    router.push('/admin/dashboard')
  }

  return (
    <div className="relative">
      <Popover open={abierto} onOpenChange={setAbierto}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
            <Bell className="h-5 w-5" />
            {nuevas > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-pulse">
                {nuevas > 9 ? '9+' : nuevas}
              </span>
            )}
            {sonando && nuevas > 0 && (
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={volverAlPanel} className="h-7 w-7 p-0" title="Volver al panel">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold">Notificaciones</span>
            </div>
            <div className="flex items-center gap-2">
              {!sonidoActivado ? (
                <Button variant="outline" size="sm" onClick={activarSonido} className="h-7 px-2 text-xs gap-1">
                  <Volume2 className="h-3 w-3" /> Activar
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={desactivarSonido} className="h-7 px-2 text-xs gap-1 text-red-500">
                  <VolumeX className="h-3 w-3" /> Desactivar
                </Button>
              )}
              {notificaciones.length > 0 && (
                <Button variant="ghost" size="sm" onClick={marcarComoLeidas} className="h-7 text-xs">
                  Marcar
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="h-80">
            {notificaciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y">
                {notificaciones.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-muted/50 cursor-pointer" onClick={() => {
                    if (!notif.leida) {
                      setNotificaciones(prev => prev.map(n => n.id === notif.id ? { ...n, leida: true } : n))
                      setNuevas(prev => prev - 1)
                    }
                  }}>
                    <div className="flex gap-2">
                      <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notif.titulo}</p>
                        <p className="text-xs text-muted-foreground">{notif.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  )
}