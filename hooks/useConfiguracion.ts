import { useState, useEffect, useCallback } from 'react'
import { getConfiguracionGlobal, type ConfiguracionGlobal } from '@/lib/configuracion-services'

export function useConfiguracion() {
  const [config, setConfig] = useState<ConfiguracionGlobal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConfig = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getConfiguracionGlobal()
      setConfig(data)
    } catch (error) {
      console.error('Error loading config:', error)
      setError('Error al cargar la configuración')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const getHorarioDia = (dia: string): string => {
    if (!config) return 'Consultar'
    const horario = config.horarioNormal[dia as keyof typeof config.horarioNormal]
    if (!horario) return 'Consultar'
    if (horario.apertura === 'Cerrado' || horario.cierre === 'Cerrado') {
      return 'Cerrado'
    }
    return `${horario.apertura} - ${horario.cierre}`
  }

  const getTelefono = (): string => {
    return config?.restaurante.telefono || 'Consultar'
  }

  const getWhatsApp = (): string => {
    return config?.restaurante.whatsapp || ''
  }

  const getDireccion = (): string => {
    return config?.restaurante.direccion || ''
  }

  const getNombre = (): string => {
    return config?.restaurante.nombre || 'Restaurante'
  }

  return { 
    config, 
    isLoading, 
    error,
    getHorarioDia,
    getTelefono,
    getWhatsApp,
    getDireccion,
    getNombre,
    refetch: loadConfig
  }
}