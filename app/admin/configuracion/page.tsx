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
  Sun,
  Upload,
  X,
  Eye,
  Image as ImageIcon,
  LayoutTemplate
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { getAuth, updateProfile } from 'firebase/auth'
import { app, db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { uploadImage } from '@/lib/firebase-services'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ConfiguracionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  
  // Estado para la portada principal
  const [portadaData, setPortadaData] = useState({
    portada: '',
    titulo: '',
    subtitulo: '',
    direccion: '',
    telefono: '',
    email: '',
    instagram: '',
    tiktok: '',
    whatsapp: ''
  })
  const [portadaFile, setPortadaFile] = useState<File | null>(null)
  const [portadaPreview, setPortadaPreview] = useState('')
  const [showPortadaPreview, setShowPortadaPreview] = useState(false)
  const [isSavingPortada, setIsSavingPortada] = useState(false)

  // Estado para el fondo de la carta
  const [fondoCarta, setFondoCarta] = useState('')
  const [fondoCartaFile, setFondoCartaFile] = useState<File | null>(null)
  const [fondoCartaPreview, setFondoCartaPreview] = useState('')
  const [showFondoCartaPreview, setShowFondoCartaPreview] = useState(false)
  const [isSavingFondoCarta, setIsSavingFondoCarta] = useState(false)

  // Cargar configuración de Firestore
  useEffect(() => {
    const loadConfiguracion = async () => {
      try {
        const docRef = doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setPortadaData({
            portada: data.portada || '',
            titulo: data.titulo || 'Gavi-Club',
            subtitulo: data.subtitulo || 'Cócteles y picaderas',
            direccion: data.direccion || '',
            telefono: data.telefono || '',
            email: data.email || '',
            instagram: data.instagram || '',
            tiktok: data.tiktok || '',
            whatsapp: data.whatsapp || ''
          })
          setFondoCarta(data.fondoCarta || '')
        }
      } catch (error) {
        console.error('Error cargando configuración:', error)
      }
    }
    
    loadConfiguracion()
    
    const auth = getAuth(app)
    const user = auth.currentUser
    if (user) {
      setAdminName(user.displayName || 'Administrador')
      setAdminEmail(user.email || 'admin@tipicocaribeno.com')
    }
    
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

  // Manejar cambio de imagen de portada principal
  const handlePortadaImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPortadaFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPortadaPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Manejar cambio de imagen de fondo de carta
  const handleFondoCartaImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFondoCartaFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setFondoCartaPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Guardar configuración de portada principal
  const handleSavePortada = async () => {
    setIsSavingPortada(true)
    toast.loading('Guardando portada...', { id: 'saving-portada' })
    
    try {
      let imagenUrl = portadaData.portada
      
      if (portadaFile) {
        const timestamp = Date.now()
        const cleanName = portadaFile.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        const path = `portada/${timestamp}_${cleanName}`
        imagenUrl = await uploadImage(portadaFile, path)
      }
      
      const docRef = doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt')
      await updateDoc(docRef, {
        portada: imagenUrl,
        titulo: portadaData.titulo,
        subtitulo: portadaData.subtitulo,
        direccion: portadaData.direccion,
        telefono: portadaData.telefono,
        email: portadaData.email,
        instagram: portadaData.instagram,
        tiktok: portadaData.tiktok,
        whatsapp: portadaData.whatsapp,
        actualizado: new Date().toISOString()
      })
      
      setPortadaData(prev => ({ ...prev, portada: imagenUrl }))
      setPortadaFile(null)
      setPortadaPreview('')
      toast.success('Portada guardada correctamente', { id: 'saving-portada' })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al guardar la portada', { id: 'saving-portada' })
    } finally {
      setIsSavingPortada(false)
    }
  }

  // Guardar configuración de fondo de carta
  const handleSaveFondoCarta = async () => {
    setIsSavingFondoCarta(true)
    toast.loading('Guardando fondo de carta...', { id: 'saving-fondo' })
    
    try {
      let imagenUrl = fondoCarta
      
      if (fondoCartaFile) {
        const timestamp = Date.now()
        const cleanName = fondoCartaFile.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        const path = `fondo-carta/${timestamp}_${cleanName}`
        imagenUrl = await uploadImage(fondoCartaFile, path)
      }
      
      const docRef = doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt')
      await updateDoc(docRef, {
        fondoCarta: imagenUrl,
        actualizado: new Date().toISOString()
      })
      
      setFondoCarta(imagenUrl)
      setFondoCartaFile(null)
      setFondoCartaPreview('')
      toast.success('Fondo de carta guardado correctamente', { id: 'saving-fondo' })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al guardar el fondo de carta', { id: 'saving-fondo' })
    } finally {
      setIsSavingFondoCarta(false)
    }
  }

  const configSections: { title: string; icon: any; color: string; bgColor: string; items: any[] }[] = [
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
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Configuración</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            Configuración del Panel
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona la configuración de tu cuenta, portada y fondos
          </p>
        </div>
      </div>

      {/* Sección de Portada Principal */}
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <ImageIcon className="h-4 w-4 text-purple-400" />
            </div>
            Portada Principal
          </CardTitle>
          <CardDescription className="text-gray-400">
            Imagen que aparece en la página de inicio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-gray-300 mb-2 block">Imagen actual</Label>
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
              {portadaData.portada ? (
                <img src={portadaData.portada} alt="Portada actual" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No hay imagen</div>
              )}
            </div>
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Cambiar imagen</Label>
            <div className="flex items-center gap-4">
              {portadaPreview ? (
                <div className="relative">
                  <img src={portadaPreview} alt="Preview" className="h-32 w-48 rounded-lg object-cover border-2 border-blue-500" />
                  <button onClick={() => { setPortadaFile(null); setPortadaPreview(''); }} className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white">
                    <X className="h-3 w-3" />
                  </button>
                  <button onClick={() => setShowPortadaPreview(true)} className="absolute bottom-1 right-1 rounded-full bg-black/70 p-1 text-white">
                    <Eye className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 hover:border-blue-500">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Subir imagen</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePortadaImageChange} />
                </label>
              )}
              <p className="text-xs text-gray-500">Recomendado: 1920x1080px</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Título principal</Label>
              <Input value={portadaData.titulo} onChange={(e) => setPortadaData(prev => ({ ...prev, titulo: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Subtítulo</Label>
              <Input value={portadaData.subtitulo} onChange={(e) => setPortadaData(prev => ({ ...prev, subtitulo: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" />
            </div>
          </div>

          <Button onClick={handleSavePortada} disabled={isSavingPortada} className="bg-gradient-to-r from-purple-600 to-purple-500">
            {isSavingPortada && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar portada
          </Button>
        </CardContent>
      </Card>

      {/* Sección de Fondo de Carta */}
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-green-500/10">
              <LayoutTemplate className="h-4 w-4 text-green-400" />
            </div>
            Fondo de la Carta
          </CardTitle>
          <CardDescription className="text-gray-400">
            Imagen de fondo que aparece en la página de la carta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-gray-300 mb-2 block">Imagen actual</Label>
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
              {fondoCarta ? (
                <img src={fondoCarta} alt="Fondo carta actual" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No hay imagen de fondo</div>
              )}
            </div>
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Cambiar imagen</Label>
            <div className="flex items-center gap-4">
              {fondoCartaPreview ? (
                <div className="relative">
                  <img src={fondoCartaPreview} alt="Preview" className="h-32 w-48 rounded-lg object-cover border-2 border-green-500" />
                  <button onClick={() => { setFondoCartaFile(null); setFondoCartaPreview(''); }} className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white">
                    <X className="h-3 w-3" />
                  </button>
                  <button onClick={() => setShowFondoCartaPreview(true)} className="absolute bottom-1 right-1 rounded-full bg-black/70 p-1 text-white">
                    <Eye className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 hover:border-green-500">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Subir imagen</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFondoCartaImageChange} />
                </label>
              )}
              <p className="text-xs text-gray-500">Recomendado: 1920x1080px</p>
            </div>
          </div>

          <Button onClick={handleSaveFondoCarta} disabled={isSavingFondoCarta} className="bg-gradient-to-r from-green-600 to-green-500">
            {isSavingFondoCarta && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar fondo de carta
          </Button>
        </CardContent>
      </Card>

      {/* Información del negocio */}
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Globe className="h-4 w-4 text-blue-400" />
            </div>
            Información del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label className="text-gray-300">Dirección</Label><Input value={portadaData.direccion} onChange={(e) => setPortadaData(prev => ({ ...prev, direccion: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-300">Teléfono</Label><Input value={portadaData.telefono} onChange={(e) => setPortadaData(prev => ({ ...prev, telefono: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-300">Email</Label><Input value={portadaData.email} onChange={(e) => setPortadaData(prev => ({ ...prev, email: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-300">WhatsApp</Label><Input value={portadaData.whatsapp} onChange={(e) => setPortadaData(prev => ({ ...prev, whatsapp: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-300">Instagram</Label><Input value={portadaData.instagram} onChange={(e) => setPortadaData(prev => ({ ...prev, instagram: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-300">TikTok</Label><Input value={portadaData.tiktok} onChange={(e) => setPortadaData(prev => ({ ...prev, tiktok: e.target.value }))} className="mt-1 bg-gray-900 border-gray-700 text-white" /></div>
          </div>
          <Button onClick={handleSavePortada} disabled={isSavingPortada} className="mt-4 bg-gradient-to-r from-purple-600 to-purple-500">
            Guardar información
          </Button>
        </CardContent>
      </Card>

      {/* Perfil del Administrador */}
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white"><User className="h-4 w-4 text-blue-400" /> Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label className="text-gray-300">Nombre</Label><Input value={adminName} onChange={(e) => setAdminName(e.target.value)} className="mt-1 bg-gray-900 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-300">Email</Label><Input value={adminEmail} disabled className="mt-1 bg-gray-800 border-gray-700 text-gray-400" /></div>
          </div>
          <Button onClick={handleUpdateProfile} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-blue-500">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Actualizar perfil
          </Button>
        </CardContent>
      </Card>

      {/* Secciones de configuración */}
      {configSections.map((section, idx) => (
        <Card key={idx} className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white"><section.icon className={`h-4 w-4 ${section.color}`} /> {section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900/30">
                <div><p className="font-medium text-white">{item.name}</p><p className="text-sm text-gray-400">{item.description}</p></div>
                {item.isSwitch ? <Switch checked={item.value} onCheckedChange={item.action} /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Modales de vista previa */}
      <Dialog open={showPortadaPreview} onOpenChange={setShowPortadaPreview}>
        <DialogContent className="bg-gray-950 border-gray-800 max-w-4xl">
          <DialogHeader><DialogTitle className="text-white">Vista previa portada</DialogTitle></DialogHeader>
          <img src={portadaPreview} alt="Preview" className="rounded-lg w-full" />
        </DialogContent>
      </Dialog>

      <Dialog open={showFondoCartaPreview} onOpenChange={setShowFondoCartaPreview}>
        <DialogContent className="bg-gray-950 border-gray-800 max-w-4xl">
          <DialogHeader><DialogTitle className="text-white">Vista previa fondo carta</DialogTitle></DialogHeader>
          <img src={fondoCartaPreview} alt="Preview" className="rounded-lg w-full" />
        </DialogContent>
      </Dialog>
    </div>
  )
}