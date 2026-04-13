'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, Shield, User, Bell, Globe, Palette, ChevronRight, Loader2, Key, Moon, Sun,
  Upload, X, Eye, Image as ImageIcon, LayoutTemplate, Type, AlignLeft, Maximize2,
  Instagram, Facebook, MapPin, Phone, MessageCircle, Mail, Clock, Save,
  Monitor, MoveHorizontal, Gauge, Repeat, AlignCenter, AlignLeft as AlignLeftIcon, AlignRight,
  Brush, Contrast, Eye as EyeIcon, Sliders, Box, Layers, Zap, Droplet,
  Menu, Home, Star, Heart, Truck, Coffee, Utensils, Wine, ShoppingCart, Plus, Minus,
  ChevronLeft, Search, Filter, Grid3x3, List, ArrowUp, ArrowRight, LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { getAuth, updateProfile } from 'firebase/auth'
import { app, db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { uploadImage } from '@/lib/firebase-services'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// ============ TIPOS DE ICONOS DISPONIBLES ============
const ICONOS_DISPONIBLES = [
  { value: 'Truck', label: '🚚 Delivery', icon: Truck },
  { value: 'Heart', label: '❤️ Corazón', icon: Heart },
  { value: 'Shield', label: '🛡️ Escudo', icon: Shield },
  { value: 'Clock', label: '⏰ Reloj', icon: Clock },
  { value: 'Star', label: '⭐ Estrella', icon: Star },
  { value: 'Coffee', label: '☕ Café', icon: Coffee },
  { value: 'Utensils', label: '🍽️ Cubiertos', icon: Utensils },
  { value: 'Wine', label: '🍷 Vino', icon: Wine },
  { value: 'Home', label: '🏠 Casa', icon: Home },
  { value: 'Phone', label: '📞 Teléfono', icon: Phone },
  { value: 'Mail', label: '✉️ Correo', icon: Mail },
  { value: 'MapPin', label: '📍 Ubicación', icon: MapPin }
]

// Fuentes disponibles
const FUENTES = [
  'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Playfair Display', 'Montserrat', 'Poppins', 'Roboto', 'Open Sans', 'Lato'
]

// ============ ESTRUCTURA DE DATOS ============
interface NavbarItem {
  text: string
  color: string
  colorHover: string
  size: number
  active: boolean
}

interface NavbarIcon {
  type: string
  color: string
  colorHover: string
  size: number
}

interface FeatureItem {
  iconType: string
  iconColor: string
  iconSize: number
  title: string
  titleColor: string
  titleSize: number
  subtitle: string
  subtitleColor: string
  subtitleSize: number
}

interface HeroItem {
  imageUrl: string
  title: string
  titleColor: string
  titleSize: number
  subtitle: string
  subtitleColor: string
  subtitleSize: number
  buttonText: string
  buttonBgColor: string
  buttonTextColor: string
  height: number
}

interface FooterItem {
  text: string
  color: string
  size: number
}

interface SocialIcon {
  type: string
  url: string
  color: string
  colorHover: string
  size: number
  active: boolean
}

export default function ConfiguracionPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('navbar')
  const [isSaving, setIsSaving] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  
  // ============ BARRA DE NAVEGACIÓN ============
  const [logoUrl, setLogoUrl] = useState('/logo.png')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [logoSize, setLogoSize] = useState(80)
  const [navbarBgColor, setNavbarBgColor] = useState('#000000')
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([
    { text: 'Inicio', color: '#ffffff', colorHover: '#d1b275', size: 14, active: true },
    { text: 'Carta', color: '#ffffff', colorHover: '#d1b275', size: 14, active: true },
    { text: 'Sugerencias', color: '#ffffff', colorHover: '#d1b275', size: 14, active: true },
    { text: 'Ubicación', color: '#ffffff', colorHover: '#d1b275', size: 14, active: true }
  ])
  const [navbarIcons, setNavbarIcons] = useState<NavbarIcon[]>([
    { type: 'Globe', color: '#d1b275', colorHover: '#e0c898', size: 20 },
    { type: 'Sun', color: '#d1b275', colorHover: '#e0c898', size: 20 },
    { type: 'Shield', color: '#d1b275', colorHover: '#e0c898', size: 20 },
    { type: 'Menu', color: '#d1b275', colorHover: '#e0c898', size: 20 }
  ])

  // ============ PORTADA ============
  const [hero, setHero] = useState<HeroItem>({
    imageUrl: '',
    title: "Gaby's Club",
    titleColor: '#ffffff',
    titleSize: 72,
    subtitle: 'Los mejores cócteles de la ciudad',
    subtitleColor: '#d1b275',
    subtitleSize: 24,
    buttonText: 'Ver Carta',
    buttonBgColor: '#d1b275',
    buttonTextColor: '#000000',
    height: 70
  })
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [heroImagePreview, setHeroImagePreview] = useState('')

  // ============ FEATURES (4 items individuales) ============
  const [features, setFeatures] = useState<FeatureItem[]>([
    {
      iconType: 'Truck', iconColor: '#d1b275', iconSize: 32,
      title: 'Envío a Domicilio', titleColor: '#ffffff', titleSize: 18,
      subtitle: 'Pedidos a toda la ciudad', subtitleColor: '#9ca3af', subtitleSize: 14
    },
    {
      iconType: 'Heart', iconColor: '#d1b275', iconSize: 32,
      title: 'Sabor Casero', titleColor: '#ffffff', titleSize: 18,
      subtitle: 'Recetas tradicionales', subtitleColor: '#9ca3af', subtitleSize: 14
    },
    {
      iconType: 'Shield', iconColor: '#d1b275', iconSize: 32,
      title: 'Calidad', titleColor: '#ffffff', titleSize: 18,
      subtitle: 'Ingredientes frescos', subtitleColor: '#9ca3af', subtitleSize: 14
    },
    {
      iconType: 'Clock', iconColor: '#d1b275', iconSize: 32,
      title: 'Horario Flexible', titleColor: '#ffffff', titleSize: 18,
      subtitle: 'Todos los días', subtitleColor: '#9ca3af', subtitleSize: 14
    }
  ])

  // ============ CTA ============
  const [ctaTitle, setCtaTitle] = useState('¿Listo para disfrutar?')
  const [ctaTitleColor, setCtaTitleColor] = useState('#ffffff')
  const [ctaTitleSize, setCtaTitleSize] = useState(48)
  const [ctaSubtitle, setCtaSubtitle] = useState('Reserva tu mesa o pide a domicilio')
  const [ctaSubtitleColor, setCtaSubtitleColor] = useState('#d1b275')
  const [ctaSubtitleSize, setCtaSubtitleSize] = useState(20)
  const [ctaButtonText, setCtaButtonText] = useState('Reservar ahora')
  const [ctaButtonBgColor, setCtaButtonBgColor] = useState('#d1b275')
  const [ctaButtonTextColor, setCtaButtonTextColor] = useState('#000000')
  const [ctaBgType, setCtaBgType] = useState<'color' | 'gradient'>('gradient')
  const [ctaBgColor, setCtaBgColor] = useState('#000000')
  const [ctaGradientStart, setCtaGradientStart] = useState('#2563eb')
  const [ctaGradientEnd, setCtaGradientEnd] = useState('#ef4444')

  // ============ TICKER ============
  const [tickerActive, setTickerActive] = useState(false)
  const [tickerText, setTickerText] = useState('🍸 Envío gratis desde 20€ | 🍹 Happy Hour 18-20h | 🎵 Música en vivo los viernes')
  const [tickerTextColor, setTickerTextColor] = useState('#d1b275')
  const [tickerBgColor, setTickerBgColor] = useState('#000000')
  const [tickerSpeed, setTickerSpeed] = useState(15)
  const [tickerHeight, setTickerHeight] = useState(40)
  const [tickerPosition, setTickerPosition] = useState<'top' | 'bottom'>('top')

  // ============ FOOTER ============
  const [footerBgColor, setFooterBgColor] = useState('#000000')
  const [footerTextColor, setFooterTextColor] = useState('#d1b275')
  const [footerTextSize, setFooterTextSize] = useState(14)
  const [footerCopyright, setFooterCopyright] = useState("Gaby's Club")
  const [footerSocialIcons, setFooterSocialIcons] = useState<SocialIcon[]>([
    { type: 'Instagram', url: 'https://instagram.com/gaviclub', color: '#d1b275', colorHover: '#e0c898', size: 20, active: true },
    { type: 'Facebook', url: 'https://facebook.com/gaviclub', color: '#d1b275', colorHover: '#e0c898', size: 20, active: true }
  ])

  // Cargar configuración
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.navbar) {
            setLogoUrl(data.navbar.logoUrl || '/logo.png')
            setLogoSize(data.navbar.logoSize || 80)
            setNavbarBgColor(data.navbar.bgColor || '#000000')
            if (data.navbar.items) setNavbarItems(data.navbar.items)
            if (data.navbar.icons) setNavbarIcons(data.navbar.icons)
          }
          if (data.hero) setHero(prev => ({ ...prev, ...data.hero }))
          if (data.features) setFeatures(data.features)
          if (data.cta) {
            setCtaTitle(data.cta.title || ctaTitle)
            setCtaTitleColor(data.cta.titleColor || ctaTitleColor)
            setCtaTitleSize(data.cta.titleSize || ctaTitleSize)
            setCtaSubtitle(data.cta.subtitle || ctaSubtitle)
            setCtaSubtitleColor(data.cta.subtitleColor || ctaSubtitleColor)
            setCtaSubtitleSize(data.cta.subtitleSize || ctaSubtitleSize)
            setCtaButtonText(data.cta.buttonText || ctaButtonText)
            setCtaButtonBgColor(data.cta.buttonBgColor || ctaButtonBgColor)
            setCtaButtonTextColor(data.cta.buttonTextColor || ctaButtonTextColor)
            setCtaBgType(data.cta.bgType || ctaBgType)
            setCtaBgColor(data.cta.bgColor || ctaBgColor)
            setCtaGradientStart(data.cta.gradientStart || ctaGradientStart)
            setCtaGradientEnd(data.cta.gradientEnd || ctaGradientEnd)
          }
          if (data.ticker) {
            setTickerActive(data.ticker.active || false)
            setTickerText(data.ticker.text || tickerText)
            setTickerTextColor(data.ticker.textColor || tickerTextColor)
            setTickerBgColor(data.ticker.bgColor || tickerBgColor)
            setTickerSpeed(data.ticker.speed || tickerSpeed)
            setTickerHeight(data.ticker.height || tickerHeight)
            setTickerPosition(data.ticker.position || tickerPosition)
          }
          if (data.footer) {
            setFooterBgColor(data.footer.bgColor || footerBgColor)
            setFooterTextColor(data.footer.textColor || footerTextColor)
            setFooterTextSize(data.footer.textSize || footerTextSize)
            setFooterCopyright(data.footer.copyright || footerCopyright)
            if (data.footer.socialIcons) setFooterSocialIcons(data.footer.socialIcons)
          }
        }
      } catch (error) {
        console.error('Error cargando configuración:', error)
      }
    }
    loadConfig()
    
    const auth = getAuth(app)
    const user = auth.currentUser
    if (user) {
      setAdminName(user.displayName || 'Administrador')
      setAdminEmail(user.email || 'admin@gaviclub.com')
    }
  }, [])

  // Guardar todo
  const handleSaveAll = async () => {
    setIsSaving(true)
    toast.loading('Guardando configuración...', { id: 'saving' })
    try {
      // Subir logo si hay archivo
      let finalLogoUrl = logoUrl
      if (logoFile) {
        finalLogoUrl = await uploadImage(logoFile, `logo/${Date.now()}_${logoFile.name}`)
        setLogoUrl(finalLogoUrl)
      }
      
      // Subir imagen de hero si hay archivo
      let finalHeroImage = hero.imageUrl
      if (heroImageFile) {
        finalHeroImage = await uploadImage(heroImageFile, `hero/${Date.now()}_${heroImageFile.name}`)
        setHero(prev => ({ ...prev, imageUrl: finalHeroImage }))
      }
      
      await updateDoc(doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt'), {
        navbar: {
          logoUrl: finalLogoUrl,
          logoSize,
          bgColor: navbarBgColor,
          items: navbarItems,
          icons: navbarIcons
        },
        hero: { ...hero, imageUrl: finalHeroImage },
        features,
        cta: {
          title: ctaTitle, titleColor: ctaTitleColor, titleSize: ctaTitleSize,
          subtitle: ctaSubtitle, subtitleColor: ctaSubtitleColor, subtitleSize: ctaSubtitleSize,
          buttonText: ctaButtonText, buttonBgColor: ctaButtonBgColor, buttonTextColor: ctaButtonTextColor,
          bgType: ctaBgType, bgColor: ctaBgColor, gradientStart: ctaGradientStart, gradientEnd: ctaGradientEnd
        },
        ticker: {
          active: tickerActive, text: tickerText, textColor: tickerTextColor,
          bgColor: tickerBgColor, speed: tickerSpeed, height: tickerHeight, position: tickerPosition
        },
        footer: {
          bgColor: footerBgColor, textColor: footerTextColor, textSize: footerTextSize,
          copyright: footerCopyright, socialIcons: footerSocialIcons
        },
        updatedAt: new Date().toISOString()
      })
      toast.success('Configuración guardada correctamente', { id: 'saving' })
      setLogoFile(null)
      setHeroImageFile(null)
    } catch (error) {
      toast.error('Error al guardar', { id: 'saving' })
    } finally {
      setIsSaving(false)
    }
  }

  // Actualizar un feature específico
  const updateFeature = (index: number, field: string, value: any) => {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFeatures(newFeatures)
  }

  // Actualizar un navbar item
  const updateNavbarItem = (index: number, field: string, value: any) => {
    const newItems = [...navbarItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setNavbarItems(newItems)
  }

  // Actualizar un navbar icon
  const updateNavbarIcon = (index: number, field: string, value: any) => {
    const newIcons = [...navbarIcons]
    newIcons[index] = { ...newIcons[index], [field]: value }
    setNavbarIcons(newIcons)
  }

  // Actualizar un social icon
  const updateSocialIcon = (index: number, field: string, value: any) => {
    const newIcons = [...footerSocialIcons]
    newIcons[index] = { ...newIcons[index], [field]: value }
    setFooterSocialIcons(newIcons)
  }

  const tabs = [
    { id: 'navbar', label: '🧭 Barra Navegación', icon: Menu },
    { id: 'hero', label: '🏠 Portada', icon: Home },
    { id: 'features', label: '✨ Features', icon: Star },
    { id: 'cta', label: '🎯 CTA', icon: Heart },
    { id: 'ticker', label: '📢 Ticker', icon: MoveHorizontal },
    { id: 'footer', label: '📞 Footer', icon: Globe }
  ]

  // Función para renderizar icono según tipo
  const getIconComponent = (iconType: string): LucideIcon => {
    const found = ICONOS_DISPONIBLES.find(i => i.value === iconType)
    return found?.icon || Star
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 p-6 border border-gold/30">
        <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-gold" />
              <span className="text-xs font-medium text-gold uppercase tracking-wider">Panel Profesional</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gold">Configuración de la Web</h1>
            <p className="text-gray-400 text-sm mt-1">Personaliza cada elemento individualmente</p>
          </div>
          <Button onClick={handleSaveAll} disabled={isSaving} className="bg-gold text-black hover:bg-gold-dark">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Guardar todo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gold text-black'
                  : 'text-gray-400 hover:text-gold hover:bg-gold/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ============ PANEL BARRA NAVEGACIÓN ============ */}
      {activeTab === 'navbar' && (
        <Card className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Menu className="h-5 w-5 text-gold" />
              Barra de Navegación
            </CardTitle>
            <CardDescription className="text-gray-400">
              Personaliza el logo, cada enlace y cada icono individualmente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-white font-medium mb-4">🖼️ Logo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Logo actual</Label>
                  <div className="mt-2 p-4 bg-gray-900 rounded-lg flex justify-center">
                    <img src={logoUrl} alt="Logo" className="object-contain" style={{ height: `${logoSize}px` }} />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Cambiar logo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 hover:border-gold">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setLogoFile(file)
                          const reader = new FileReader()
                          reader.onloadend = () => setLogoPreview(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }} />
                    </label>
                    {logoPreview && (
                      <div className="relative">
                        <img src={logoPreview} className="h-16 w-16 object-contain border-2 border-gold rounded" />
                        <button onClick={() => { setLogoFile(null); setLogoPreview('') }} className="absolute -right-2 -top-2 bg-red-500 rounded-full p-1"><X className="h-3 w-3 text-white" /></button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Tamaño logo (px)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input type="range" min="40" max="160" value={logoSize} onChange={(e) => setLogoSize(parseInt(e.target.value))} className="flex-1" />
                    <span className="text-gray-400 w-12">{logoSize}px</span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Color fondo navbar</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="color" value={navbarBgColor} onChange={(e) => setNavbarBgColor(e.target.value)} className="h-10 w-10 rounded border" />
                    <Input value={navbarBgColor} onChange={(e) => setNavbarBgColor(e.target.value)} className="bg-gray-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enlaces del menú (cada uno individual) */}
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-white font-medium mb-4">🔗 Enlaces del menú</h3>
              {navbarItems.map((item, idx) => (
                <div key={idx} className="mb-4 p-4 bg-gray-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gold font-medium">{item.text}</span>
                    <Switch checked={item.active} onCheckedChange={(checked) => updateNavbarItem(idx, 'active', checked)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-gray-400 text-xs">Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={item.color} onChange={(e) => updateNavbarItem(idx, 'color', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={item.color} onChange={(e) => updateNavbarItem(idx, 'color', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Color hover</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={item.colorHover} onChange={(e) => updateNavbarItem(idx, 'colorHover', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={item.colorHover} onChange={(e) => updateNavbarItem(idx, 'colorHover', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Tamaño (px)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="range" min="10" max="24" value={item.size} onChange={(e) => updateNavbarItem(idx, 'size', parseInt(e.target.value))} className="flex-1" />
                        <span className="text-gray-400 text-xs w-10">{item.size}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Iconos de la navbar (cada uno individual) */}
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-white font-medium mb-4">🎨 Iconos</h3>
              {navbarIcons.map((icon, idx) => (
                <div key={idx} className="mb-4 p-4 bg-gray-900/30 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-gray-400 text-xs">Tipo</Label>
                      <select value={icon.type} onChange={(e) => updateNavbarIcon(idx, 'type', e.target.value)} className="w-full mt-1 bg-gray-900 border-gray-700 rounded-md p-1 text-sm text-white">
                        {ICONOS_DISPONIBLES.map(ic => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={icon.color} onChange={(e) => updateNavbarIcon(idx, 'color', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={icon.color} onChange={(e) => updateNavbarIcon(idx, 'color', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Color hover</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={icon.colorHover} onChange={(e) => updateNavbarIcon(idx, 'colorHover', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={icon.colorHover} onChange={(e) => updateNavbarIcon(idx, 'colorHover', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Tamaño (px)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="range" min="16" max="32" value={icon.size} onChange={(e) => updateNavbarIcon(idx, 'size', parseInt(e.target.value))} className="flex-1" />
                        <span className="text-gray-400 text-xs w-10">{icon.size}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista previa */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4 text-green-400" />
                <Label className="text-white font-medium">Vista previa</Label>
              </div>
              <div className="bg-gray-900 rounded-lg p-4" style={{ backgroundColor: navbarBgColor }}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <img src={logoUrl} alt="Logo" className="object-contain" style={{ height: `${logoSize}px` }} />
                  <div className="flex gap-6">
                    {navbarItems.filter(i => i.active).map((item, idx) => (
                      <span key={idx} style={{ color: item.color, fontSize: `${item.size}px` }} className="hover:opacity-80 transition">{item.text}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {navbarIcons.map((icon, idx) => {
                      const IconComp = getIconComponent(icon.type)
                      return <IconComp key={idx} style={{ color: icon.color, width: `${icon.size}px`, height: `${icon.size}px` }} />
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ PANEL PORTADA ============ */}
      {activeTab === 'hero' && (
        <Card className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Home className="h-5 w-5 text-gold" />
              Portada Principal
            </CardTitle>
            <CardDescription className="text-gray-400">
              Personaliza la imagen, títulos y botón
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Imagen de fondo</Label>
                <div className="mt-2 h-32 w-full bg-gray-900 rounded-lg overflow-hidden">
                  {hero.imageUrl && <img src={hero.imageUrl} className="w-full h-full object-cover" />}
                </div>
                <div className="flex gap-2 mt-2">
                  <label className="flex-1 flex h-10 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 hover:border-gold">
                    <Upload className="h-4 w-4 mr-2" /> Subir
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setHeroImageFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => setHeroImagePreview(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }} />
                  </label>
                  <Input placeholder="O pega URL" value={hero.imageUrl} onChange={(e) => setHero({...hero, imageUrl: e.target.value})} className="bg-gray-900 flex-1" />
                </div>
                {heroImagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img src={heroImagePreview} className="h-16 w-24 object-cover rounded border-2 border-gold" />
                    <button onClick={() => { setHeroImageFile(null); setHeroImagePreview('') }} className="absolute -right-2 -top-2 bg-red-500 rounded-full p-0.5"><X className="h-3 w-3 text-white" /></button>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-gray-300">Altura (vh)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input type="range" min="50" max="100" value={hero.height} onChange={(e) => setHero({...hero, height: parseInt(e.target.value)})} className="flex-1" />
                  <span className="text-gray-400">{hero.height}vh</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-800 rounded-lg p-4">
                <h3 className="text-gold font-medium mb-3">📝 Título</h3>
                <div className="space-y-3">
                  <Input value={hero.title} onChange={(e) => setHero({...hero, title: e.target.value})} className="bg-gray-900" />
                  <div className="flex items-center gap-2">
                    <input type="color" value={hero.titleColor} onChange={(e) => setHero({...hero, titleColor: e.target.value})} className="h-8 w-8 rounded border" />
                    <Input value={hero.titleColor} onChange={(e) => setHero({...hero, titleColor: e.target.value})} className="bg-gray-900 flex-1" />
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="range" min="24" max="96" value={hero.titleSize} onChange={(e) => setHero({...hero, titleSize: parseInt(e.target.value)})} className="flex-1" />
                    <span className="text-gray-400">{hero.titleSize}px</span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-800 rounded-lg p-4">
                <h3 className="text-gold font-medium mb-3">📝 Subtítulo</h3>
                <div className="space-y-3">
                  <Input value={hero.subtitle} onChange={(e) => setHero({...hero, subtitle: e.target.value})} className="bg-gray-900" />
                  <div className="flex items-center gap-2">
                    <input type="color" value={hero.subtitleColor} onChange={(e) => setHero({...hero, subtitleColor: e.target.value})} className="h-8 w-8 rounded border" />
                    <Input value={hero.subtitleColor} onChange={(e) => setHero({...hero, subtitleColor: e.target.value})} className="bg-gray-900 flex-1" />
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="range" min="14" max="48" value={hero.subtitleSize} onChange={(e) => setHero({...hero, subtitleSize: parseInt(e.target.value)})} className="flex-1" />
                    <span className="text-gray-400">{hero.subtitleSize}px</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="text-gold font-medium mb-3">🔘 Botón</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input value={hero.buttonText} onChange={(e) => setHero({...hero, buttonText: e.target.value})} className="bg-gray-900" placeholder="Texto" />
                <div className="flex items-center gap-2">
                  <input type="color" value={hero.buttonBgColor} onChange={(e) => setHero({...hero, buttonBgColor: e.target.value})} className="h-8 w-8 rounded border" />
                  <Input value={hero.buttonBgColor} onChange={(e) => setHero({...hero, buttonBgColor: e.target.value})} className="bg-gray-900 flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="color" value={hero.buttonTextColor} onChange={(e) => setHero({...hero, buttonTextColor: e.target.value})} className="h-8 w-8 rounded border" />
                  <Input value={hero.buttonTextColor} onChange={(e) => setHero({...hero, buttonTextColor: e.target.value})} className="bg-gray-900 flex-1" />
                </div>
              </div>
            </div>

            {/* Vista previa */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4 text-green-400" />
                <Label className="text-white font-medium">Vista previa</Label>
              </div>
              <div className="relative rounded-lg overflow-hidden" style={{ height: `${hero.height * 0.3}vh`, minHeight: '200px' }}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero.imageUrl || '/default-bg.jpg'})` }} />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
                  <h2 style={{ color: hero.titleColor, fontSize: `${Math.min(hero.titleSize, 48)}px` }}>{hero.title}</h2>
                  <p style={{ color: hero.subtitleColor, fontSize: `${Math.min(hero.subtitleSize, 20)}px` }} className="mt-2">{hero.subtitle}</p>
                  <button className="mt-3 px-4 py-1 rounded-full" style={{ backgroundColor: hero.buttonBgColor, color: hero.buttonTextColor }}>{hero.buttonText}</button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ PANEL FEATURES (4 items individuales) ============ */}
      {activeTab === 'features' && (
        <Card className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-gold" />
              Features (4 elementos individuales)
            </CardTitle>
            <CardDescription className="text-gray-400">
              Personaliza cada icono, título y subtítulo por separado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {features.map((feature, idx) => {
              const IconComponent = getIconComponent(feature.iconType)
              return (
                <div key={idx} className="border border-gray-800 rounded-lg p-4">
                  <h3 className="text-gold font-medium mb-3">Elemento {idx + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Icono */}
                    <div className="border-r border-gray-800 pr-4">
                      <Label className="text-gray-400 text-xs">Icono</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <IconComponent style={{ color: feature.iconColor, width: `${feature.iconSize}px`, height: `${feature.iconSize}px` }} />
                        <select value={feature.iconType} onChange={(e) => updateFeature(idx, 'iconType', e.target.value)} className="flex-1 bg-gray-900 border-gray-700 rounded-md p-1 text-sm text-white">
                          {ICONOS_DISPONIBLES.map(ic => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="color" value={feature.iconColor} onChange={(e) => updateFeature(idx, 'iconColor', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={feature.iconColor} onChange={(e) => updateFeature(idx, 'iconColor', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="range" min="20" max="48" value={feature.iconSize} onChange={(e) => updateFeature(idx, 'iconSize', parseInt(e.target.value))} className="flex-1" />
                        <span className="text-gray-400 text-xs">{feature.iconSize}px</span>
                      </div>
                    </div>
                    {/* Título */}
                    <div className="border-r border-gray-800 pr-4">
                      <Label className="text-gray-400 text-xs">Título</Label>
                      <Input value={feature.title} onChange={(e) => updateFeature(idx, 'title', e.target.value)} className="mt-1 bg-gray-900 h-8 text-sm" />
                      <div className="flex items-center gap-2 mt-2">
                        <input type="color" value={feature.titleColor} onChange={(e) => updateFeature(idx, 'titleColor', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={feature.titleColor} onChange={(e) => updateFeature(idx, 'titleColor', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="range" min="12" max="28" value={feature.titleSize} onChange={(e) => updateFeature(idx, 'titleSize', parseInt(e.target.value))} className="flex-1" />
                        <span className="text-gray-400 text-xs">{feature.titleSize}px</span>
                      </div>
                    </div>
                    {/* Subtítulo */}
                    <div>
                      <Label className="text-gray-400 text-xs">Subtítulo</Label>
                      <Input value={feature.subtitle} onChange={(e) => updateFeature(idx, 'subtitle', e.target.value)} className="mt-1 bg-gray-900 h-8 text-sm" />
                      <div className="flex items-center gap-2 mt-2">
                        <input type="color" value={feature.subtitleColor} onChange={(e) => updateFeature(idx, 'subtitleColor', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={feature.subtitleColor} onChange={(e) => updateFeature(idx, 'subtitleColor', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="range" min="10" max="20" value={feature.subtitleSize} onChange={(e) => updateFeature(idx, 'subtitleSize', parseInt(e.target.value))} className="flex-1" />
                        <span className="text-gray-400 text-xs">{feature.subtitleSize}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Vista previa */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4 text-green-400" />
                <Label className="text-white font-medium">Vista previa</Label>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {features.map((feature, idx) => {
                    const IconComp = getIconComponent(feature.iconType)
                    return (
                      <div key={idx} className="text-center">
                        <div className="flex justify-center mb-2">
                          <IconComp style={{ color: feature.iconColor, width: `${feature.iconSize}px`, height: `${feature.iconSize}px` }} />
                        </div>
                        <h3 style={{ color: feature.titleColor, fontSize: `${feature.titleSize}px` }}>{feature.title}</h3>
                        <p style={{ color: feature.subtitleColor, fontSize: `${feature.subtitleSize}px` }}>{feature.subtitle}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ PANEL CTA ============ */}
      {activeTab === 'cta' && (
        <Card className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Heart className="h-5 w-5 text-gold" />
              Llamada a la Acción (CTA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-800 rounded-lg p-4">
                <h3 className="text-gold font-medium mb-3">Título</h3>
                <Input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} className="bg-gray-900" />
                <div className="flex items-center gap-2 mt-2">
                  <input type="color" value={ctaTitleColor} onChange={(e) => setCtaTitleColor(e.target.value)} className="h-8 w-8 rounded border" />
                  <Input value={ctaTitleColor} onChange={(e) => setCtaTitleColor(e.target.value)} className="bg-gray-900 flex-1" />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <input type="range" min="24" max="64" value={ctaTitleSize} onChange={(e) => setCtaTitleSize(parseInt(e.target.value))} className="flex-1" />
                  <span className="text-gray-400">{ctaTitleSize}px</span>
                </div>
              </div>
              <div className="border border-gray-800 rounded-lg p-4">
                <h3 className="text-gold font-medium mb-3">Subtítulo</h3>
                <Input value={ctaSubtitle} onChange={(e) => setCtaSubtitle(e.target.value)} className="bg-gray-900" />
                <div className="flex items-center gap-2 mt-2">
                  <input type="color" value={ctaSubtitleColor} onChange={(e) => setCtaSubtitleColor(e.target.value)} className="h-8 w-8 rounded border" />
                  <Input value={ctaSubtitleColor} onChange={(e) => setCtaSubtitleColor(e.target.value)} className="bg-gray-900 flex-1" />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <input type="range" min="14" max="32" value={ctaSubtitleSize} onChange={(e) => setCtaSubtitleSize(parseInt(e.target.value))} className="flex-1" />
                  <span className="text-gray-400">{ctaSubtitleSize}px</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="text-gold font-medium mb-3">Botón</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} className="bg-gray-900" />
                <div className="flex items-center gap-2">
                  <input type="color" value={ctaButtonBgColor} onChange={(e) => setCtaButtonBgColor(e.target.value)} className="h-8 w-8 rounded border" />
                  <Input value={ctaButtonBgColor} onChange={(e) => setCtaButtonBgColor(e.target.value)} className="bg-gray-900 flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="color" value={ctaButtonTextColor} onChange={(e) => setCtaButtonTextColor(e.target.value)} className="h-8 w-8 rounded border" />
                  <Input value={ctaButtonTextColor} onChange={(e) => setCtaButtonTextColor(e.target.value)} className="bg-gray-900 flex-1" />
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="text-gold font-medium mb-3">Fondo</h3>
              <div className="flex gap-4 mb-3">
                <Button type="button" variant={ctaBgType === 'color' ? 'default' : 'outline'} onClick={() => setCtaBgType('color')} className="flex-1">Color sólido</Button>
                <Button type="button" variant={ctaBgType === 'gradient' ? 'default' : 'outline'} onClick={() => setCtaBgType('gradient')} className="flex-1">Gradiente</Button>
              </div>
              {ctaBgType === 'color' ? (
                <div className="flex items-center gap-2">
                  <input type="color" value={ctaBgColor} onChange={(e) => setCtaBgColor(e.target.value)} className="h-10 w-10 rounded border" />
                  <Input value={ctaBgColor} onChange={(e) => setCtaBgColor(e.target.value)} className="bg-gray-900 flex-1" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-xs">Color inicio</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="color" value={ctaGradientStart} onChange={(e) => setCtaGradientStart(e.target.value)} className="h-8 w-8 rounded border" />
                      <Input value={ctaGradientStart} onChange={(e) => setCtaGradientStart(e.target.value)} className="bg-gray-900 flex-1 h-8 text-sm" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">Color fin</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="color" value={ctaGradientEnd} onChange={(e) => setCtaGradientEnd(e.target.value)} className="h-8 w-8 rounded border" />
                      <Input value={ctaGradientEnd} onChange={(e) => setCtaGradientEnd(e.target.value)} className="bg-gray-900 flex-1 h-8 text-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vista previa */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4 text-green-400" />
                <Label className="text-white font-medium">Vista previa</Label>
              </div>
              <div className="rounded-lg p-8 text-center" style={{
                background: ctaBgType === 'color' ? ctaBgColor : `linear-gradient(135deg, ${ctaGradientStart}, ${ctaGradientEnd})`
              }}>
                <h2 style={{ color: ctaTitleColor, fontSize: `${Math.min(ctaTitleSize, 36)}px` }}>{ctaTitle}</h2>
                <p style={{ color: ctaSubtitleColor, fontSize: `${Math.min(ctaSubtitleSize, 18)}px` }} className="mt-2">{ctaSubtitle}</p>
                <button className="mt-4 px-6 py-2 rounded-full" style={{ backgroundColor: ctaButtonBgColor, color: ctaButtonTextColor }}>{ctaButtonText}</button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ PANEL TICKER ============ */}
      {activeTab === 'ticker' && (
        <Card className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MoveHorizontal className="h-5 w-5 text-gold" />
              Línea Informativa (Ticker)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
              <div>
                <Label className="text-white font-medium">Activar ticker</Label>
                <p className="text-sm text-gray-400">Línea que se desplaza de extremo a extremo</p>
              </div>
              <Switch checked={tickerActive} onCheckedChange={setTickerActive} />
            </div>

            {tickerActive && (
              <>
                <div>
                  <Label className="text-white">Texto</Label>
                  <Textarea value={tickerText} onChange={(e) => setTickerText(e.target.value)} rows={2} className="mt-1 bg-gray-900 border-gray-700 text-white" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Color texto</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="color" value={tickerTextColor} onChange={(e) => setTickerTextColor(e.target.value)} className="h-10 w-10 rounded border" />
                      <Input value={tickerTextColor} onChange={(e) => setTickerTextColor(e.target.value)} className="bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Color fondo</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="color" value={tickerBgColor} onChange={(e) => setTickerBgColor(e.target.value)} className="h-10 w-10 rounded border" />
                      <Input value={tickerBgColor} onChange={(e) => setTickerBgColor(e.target.value)} className="bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Velocidad (s)</Label>
                    <div className="flex items-center gap-4 mt-1">
                      <input type="range" min="5" max="30" value={tickerSpeed} onChange={(e) => setTickerSpeed(parseInt(e.target.value))} className="flex-1" />
                      <span className="text-gray-400">{tickerSpeed}s</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Altura (px)</Label>
                    <div className="flex items-center gap-4 mt-1">
                      <input type="range" min="24" max="80" value={tickerHeight} onChange={(e) => setTickerHeight(parseInt(e.target.value))} className="flex-1" />
                      <span className="text-gray-400">{tickerHeight}px</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Posición</Label>
                    <div className="flex gap-2 mt-1">
                      <Button type="button" variant={tickerPosition === 'top' ? 'default' : 'outline'} className="flex-1" onClick={() => setTickerPosition('top')}>Arriba</Button>
                      <Button type="button" variant={tickerPosition === 'bottom' ? 'default' : 'outline'} className="flex-1" onClick={() => setTickerPosition('bottom')}>Abajo</Button>
                    </div>
                  </div>
                </div>

                {/* Vista previa en vivo */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="h-4 w-4 text-green-400" />
                    <Label className="text-white font-medium">Vista previa en vivo</Label>
                  </div>
                  <div className="w-full overflow-hidden rounded-lg" style={{ backgroundColor: tickerBgColor, height: `${tickerHeight}px` }}>
                    <div className="h-full flex items-center">
                      <div className="whitespace-nowrap animate-marquee" style={{ animationDuration: `${tickerSpeed}s`, color: tickerTextColor, display: 'inline-block', padding: '0 20px' }}>
                        {tickerText || "Escribe un texto para ver la vista previa..."}
                      </div>
                    </div>
                  </div>
                  <style>{`
                    @keyframes marquee {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                      animation-name: marquee;
                      animation-iteration-count: infinite;
                      animation-timing-function: linear;
                    }
                  `}</style>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ============ PANEL FOOTER ============ */}
      {activeTab === 'footer' && (
        <Card className="border border-gray-800 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-gold" />
              Footer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">Color fondo</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={footerBgColor} onChange={(e) => setFooterBgColor(e.target.value)} className="h-10 w-10 rounded border" />
                  <Input value={footerBgColor} onChange={(e) => setFooterBgColor(e.target.value)} className="bg-gray-900" />
                </div>
              </div>
              <div>
                <Label className="text-white">Color texto</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={footerTextColor} onChange={(e) => setFooterTextColor(e.target.value)} className="h-10 w-10 rounded border" />
                  <Input value={footerTextColor} onChange={(e) => setFooterTextColor(e.target.value)} className="bg-gray-900" />
                </div>
              </div>
              <div>
                <Label className="text-white">Tamaño texto (px)</Label>
                <div className="flex items-center gap-4 mt-1">
                  <input type="range" min="10" max="20" value={footerTextSize} onChange={(e) => setFooterTextSize(parseInt(e.target.value))} className="flex-1" />
                  <span className="text-gray-400">{footerTextSize}px</span>
                </div>
              </div>
              <div>
                <Label className="text-white">Texto copyright</Label>
                <Input value={footerCopyright} onChange={(e) => setFooterCopyright(e.target.value)} className="mt-1 bg-gray-900" />
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="text-gold font-medium mb-3">📱 Iconos sociales</h3>
              {footerSocialIcons.map((icon, idx) => {
                const IconComp = getIconComponent(icon.type)
                return (
                  <div key={idx} className="mb-4 p-3 bg-gray-900/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                      <div className="flex items-center gap-2">
                        <IconComp style={{ color: icon.color, width: `${icon.size}px`, height: `${icon.size}px` }} />
                        <select value={icon.type} onChange={(e) => updateSocialIcon(idx, 'type', e.target.value)} className="flex-1 bg-gray-900 border-gray-700 rounded-md p-1 text-sm text-white">
                          {ICONOS_DISPONIBLES.map(ic => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <Input value={icon.url} onChange={(e) => updateSocialIcon(idx, 'url', e.target.value)} placeholder="URL" className="bg-gray-900 h-8 text-sm" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={icon.color} onChange={(e) => updateSocialIcon(idx, 'color', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={icon.color} onChange={(e) => updateSocialIcon(idx, 'color', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={icon.colorHover} onChange={(e) => updateSocialIcon(idx, 'colorHover', e.target.value)} className="h-8 w-8 rounded border" />
                        <Input value={icon.colorHover} onChange={(e) => updateSocialIcon(idx, 'colorHover', e.target.value)} className="bg-gray-900 h-8 text-sm" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Vista previa */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4 text-green-400" />
                <Label className="text-white font-medium">Vista previa</Label>
              </div>
              <div className="rounded-lg p-6 text-center" style={{ backgroundColor: footerBgColor }}>
                <div className="flex justify-center gap-6 mb-4">
                  {footerSocialIcons.map((icon, idx) => {
                    const IconComp = getIconComponent(icon.type)
                    return <IconComp key={idx} style={{ color: icon.color, width: `${icon.size}px`, height: `${icon.size}px` }} />
                  })}
                </div>
                <p style={{ color: footerTextColor, fontSize: `${footerTextSize}px` }}>© {new Date().getFullYear()} {footerCopyright}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}