'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  Shield, 
  User, 
  Bell, 
  Globe, 
  Palette,
  ChevronRight,
  Loader2,
  Key,
  Moon,
  Sun
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { getAuth, updateProfile } from 'firebase/auth'
import { app } from '@/lib/firebase'

// Definir el tipo para los items de configuración
type ConfigItem = {
  name: string
  description: string
  action: ((checked: boolean) => void) | (() => void)
  icon: any
  isSwitch?: boolean
  value?: boolean
}

export default function ConfiguracionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    const auth = getAuth(app)
    const user = auth.currentUser
    if (user) {
      setAdminName(user.displayName || 'Administrador')
      setAdminEmail(user.email || 'admin@tipicocaribeno.com')
    }
    
    // Cargar preferencias guardadas
    const savedDarkMode = localStorage.getItem('admin-dark-mode')
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true'
      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    const savedNotifications = localStorage.getItem('admin-notifications')
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === 'true')
    }
  }, [])

  const handleUpdateProfile = async () => {
    if (!adminName.trim()) {
      toast.error('El nombre no puede estar vacío')
      return
    }

    setIsLoading(true)
    toast.loading('Actualizando perfil...', { id: 'update-profile' })
    
    try {
      const auth = getAuth(app)
      const user = auth.currentUser
      if (user) {
        await updateProfile(user, { displayName: adminName })
        toast.success('Perfil actualizado correctamente', { id: 'update-profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil', { id: 'update-profile' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked)
    localStorage.setItem('admin-dark-mode', String(checked))
    if (checked) {
      document.documentElement.classList.add('dark')
      toast.success('Modo oscuro activado')
    } else {
      document.documentElement.classList.remove('dark')
      toast.success('Modo claro activado')
    }
  }

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked)
    localStorage.setItem('admin-notifications', String(checked))
    toast.success(checked ? 'Notificaciones activadas' : 'Notificaciones desactivadas')
  }

  const configSections: { title: string; icon: any; color: string; bgColor: string; items: ConfigItem[] }[] = [
    {
      title: 'Seguridad',
      icon: Shield,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      items: [
        {
          name: 'Cambiar contraseña',
          description: 'Actualiza tu contraseña de acceso al panel',
          action: () => router.push('/admin/configuracion/cambiar-password'),
          icon: Key,
          isSwitch: false
        }
      ]
    },
    {
      title: 'Preferencias',
      icon: Palette,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      items: [
        {
          name: 'Modo oscuro',
          description: 'Tema oscuro para el panel de administración',
          action: (checked: boolean) => handleDarkModeChange(checked),
          icon: darkMode ? Moon : Sun,
          isSwitch: true,
          value: darkMode
        },
        {
          name: 'Notificaciones',
          description: 'Recibir alertas del sistema y actualizaciones',
          action: (checked: boolean) => handleNotificationsChange(checked),
          icon: Bell,
          isSwitch: true,
          value: notifications
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-red-600/20 p-6 border border-blue-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Configuración</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            Configuración del Panel
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona la configuración de tu cuenta y preferencias del sistema
          </p>
        </div>
      </div>

      {/* Perfil del Administrador */}
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <User className="h-4 w-4 text-blue-400" />
            </div>
            Perfil de Administrador
          </CardTitle>
          <CardDescription className="text-gray-400">
            Información de tu cuenta y datos personales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Nombre completo</Label>
              <Input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="mt-1 bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <Label className="text-gray-300">Correo electrónico</Label>
              <Input
                type="email"
                value={adminEmail}
                disabled
                className="mt-1 bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
            </div>
          </div>
          <Button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Actualizar perfil
          </Button>
        </CardContent>
      </Card>

      {/* Secciones de configuración */}
      {configSections.map((section, idx) => (
        <Card key={idx} className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className={`p-2 rounded-lg ${section.bgColor}`}>
                <section.icon className={`h-4 w-4 ${section.color}`} />
              </div>
              {section.title}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Opciones de {section.title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className={`flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 transition-all duration-200 ${!item.isSwitch ? 'cursor-pointer' : ''}`}
                onClick={!item.isSwitch ? () => (item.action as () => void)() : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <item.icon className={`h-4 w-4 ${section.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                {item.isSwitch ? (
                  <Switch
                    checked={item.value || false}
                    onCheckedChange={(checked) => (item.action as (checked: boolean) => void)(checked)}
                  />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Información del sistema */}
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Globe className="h-4 w-4 text-green-400" />
            </div>
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Versión del panel</span>
            <span className="text-white font-medium">v2.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Última actualización</span>
            <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Entorno</span>
            <span className="text-white font-medium">Desarrollo</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}