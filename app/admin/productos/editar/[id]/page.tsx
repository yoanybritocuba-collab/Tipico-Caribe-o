'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Upload, X, Eye, Loader2, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getCategoriasGlobales, getProductoById, updateProducto, uploadImage, type CategoriaGlobal } from '@/lib/firebase-services'
import { translateText } from '@/lib/translate'
import { toast } from 'sonner'

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' }
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [categories, setCategories] = useState<CategoriaGlobal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaGlobalId: '',
    activo: true,
    destacado: false,
  })
  const [originalData, setOriginalData] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [productoData, categoriasData] = await Promise.all([
        getProductoById(id),
        getCategoriasGlobales()
      ])
      
      if (!productoData) {
        toast.error('Producto no encontrado')
        router.push('/admin/productos')
        return
      }
      
      setImagePreview(productoData.imagenUrl || null)
      setFormData({
        nombre: productoData.nombre || '',
        descripcion: productoData.descripcion || '',
        precio: productoData.precio?.toString() || '',
        categoriaGlobalId: productoData.categoriaGlobalId || '',
        activo: productoData.activo ?? true,
        destacado: productoData.destacado ?? false,
      })
      setOriginalData(productoData)
      setCategories(categoriasData)
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Error al cargar el producto')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const translateToAllLanguages = async (text: string) => {
    const translations: Record<string, string> = {}
    for (const lang of LANGUAGES) {
      if (lang.code === 'es') {
        translations[lang.code] = text
      } else {
        try {
          translations[lang.code] = await translateText(text, lang.code)
        } catch (error) {
          console.error(`Error traduciendo a ${lang.code}:`, error)
          translations[lang.code] = text
        }
      }
    }
    return translations
  }

  const handleSubmit = async (e: React.FormEvent, shouldTranslate: boolean = true) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.precio || !formData.categoriaGlobalId) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (shouldTranslate) {
      setIsTranslating(true)
      toast.loading('Traduciendo nombre y descripción a 5 idiomas...', { id: 'saving' })
    } else {
      setIsSaving(true)
      toast.loading('Guardando...', { id: 'saving' })
    }

    try {
      let nameTranslations: Record<string, string> = {}
      let descTranslations: Record<string, string> = {}
      
      if (shouldTranslate) {
        [nameTranslations, descTranslations] = await Promise.all([
          translateToAllLanguages(formData.nombre),
          formData.descripcion ? translateToAllLanguages(formData.descripcion) : Promise.resolve({ es: '', en: '', fr: '', de: '', ru: '' })
        ])
      }
      
      let imagenUrl = imagePreview
      if (imageFile) {
        const timestamp = Date.now()
        const cleanName = formData.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        const path = `productos/${timestamp}_${cleanName}`
        imagenUrl = await uploadImage(imageFile, path)
      }

      const updateData: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoriaGlobalId: formData.categoriaGlobalId,
        activo: formData.activo,
        destacado: formData.destacado,
        imagenUrl: imagenUrl,
      }
      
      if (shouldTranslate) {
        updateData.nameEn = nameTranslations.en
        updateData.nameFr = nameTranslations.fr
        updateData.nameDe = nameTranslations.de
        updateData.nameRu = nameTranslations.ru
        updateData.descriptionEn = descTranslations.en
        updateData.descriptionFr = descTranslations.fr
        updateData.descriptionDe = descTranslations.de
        updateData.descriptionRu = descTranslations.ru
      } else {
        // Mantener traducciones existentes
        if (originalData?.nameEn) updateData.nameEn = originalData.nameEn
        if (originalData?.nameFr) updateData.nameFr = originalData.nameFr
        if (originalData?.nameDe) updateData.nameDe = originalData.nameDe
        if (originalData?.nameRu) updateData.nameRu = originalData.nameRu
        if (originalData?.descriptionEn) updateData.descriptionEn = originalData.descriptionEn
        if (originalData?.descriptionFr) updateData.descriptionFr = originalData.descriptionFr
        if (originalData?.descriptionDe) updateData.descriptionDe = originalData.descriptionDe
        if (originalData?.descriptionRu) updateData.descriptionRu = originalData.descriptionRu
      }

      await updateProducto(id, updateData)

      toast.success(shouldTranslate ? 'Producto traducido a 5 idiomas' : 'Producto actualizado', { id: 'saving' })
      router.push('/admin/productos')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Error al actualizar', { id: 'saving' })
    } finally {
      setIsSaving(false)
      setIsTranslating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            Editar Producto
          </h1>
        </div>
        {imagePreview && (
          <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver imagen
          </Button>
        )}
      </div>

      <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
        <Card className="border-gray-800 bg-gray-950/50">
          <CardContent className="p-4">
            <Label className="text-white">Imagen del producto</Label>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-3">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-lg object-cover border-2 border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setImageFile(null)
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400">Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-950/50">
          <CardContent className="space-y-4 p-4">
            <div>
              <Label className="text-white">🇪🇸 Nombre (Español) *</Label>
              <Input
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 bg-gray-900 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Se traducirá automáticamente a 5 idiomas</p>
            </div>

            <div>
              <Label className="text-white">🇪🇸 Descripción</Label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="mt-1 bg-gray-900 border-gray-700 text-white"
                placeholder="Descripción del producto"
              />
              <p className="text-xs text-gray-500 mt-1">Se traducirá automáticamente a 5 idiomas</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Precio (€) *</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Categoría *</Label>
                <select
                  required
                  value={formData.categoriaGlobalId}
                  onChange={(e) => setFormData({ ...formData, categoriaGlobalId: e.target.value })}
                  className="w-full rounded-md border border-gray-700 bg-gray-900 p-2 mt-1 text-white"
                >
                  <option value="">Seleccionar</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex items-center justify-between flex-1 border border-gray-800 rounded-lg p-3">
                <Label className="text-white">Disponible</Label>
                <Switch
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                />
              </div>
              <div className="flex items-center justify-between flex-1 border border-gray-800 rounded-lg p-3">
                <Label className="text-white">Destacado ⭐</Label>
                <Switch
                  checked={formData.destacado}
                  onCheckedChange={(checked) => setFormData({ ...formData, destacado: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button 
            type="submit" 
            disabled={isTranslating || isSaving} 
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500"
          >
            {(isTranslating || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Languages className="mr-2 h-4 w-4" />
            {isTranslating ? 'Traduciendo a 5 idiomas...' : 'Guardar y traducir'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={(e) => handleSubmit(e, false)}
            disabled={isTranslating || isSaving}
          >
            Solo guardar (sin traducir)
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-gray-950 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Vista previa</DialogTitle>
          </DialogHeader>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}