'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { translateText } from '@/lib/translate'
import { Loader2, ArrowLeft, Languages } from 'lucide-react'

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' }
]

export default function EditarCategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    activo: true,
    order: 1
  })
  const [originalData, setOriginalData] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const docRef = doc(db, 'categorias_globales', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setFormData({
          nombre: data.nombre || '',
          activo: data.activo ?? true,
          order: data.order || 1
        })
        setOriginalData(data)
      } else {
        toast.error('Categoría no encontrada')
        router.push('/admin/categorias')
      }
    } catch (error) {
      console.error('Error loading category:', error)
      toast.error('Error al cargar la categoría')
    } finally {
      setIsLoading(false)
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
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre en español es obligatorio')
      return
    }

    if (shouldTranslate) {
      setIsTranslating(true)
      toast.loading('Traduciendo a 5 idiomas...', { id: 'saving' })
    } else {
      setIsSaving(true)
      toast.loading('Guardando...', { id: 'saving' })
    }

    try {
      const updateData: any = {
        nombre: formData.nombre,
        activo: formData.activo,
        order: formData.order,
        updatedAt: new Date().toISOString()
      }
      
      if (shouldTranslate) {
        const translations = await translateToAllLanguages(formData.nombre)
        updateData.nameEn = translations.en
        updateData.nameFr = translations.fr
        updateData.nameDe = translations.de
        updateData.nameRu = translations.ru
      } else {
        // Mantener traducciones existentes si no se traduce de nuevo
        if (originalData?.nameEn) updateData.nameEn = originalData.nameEn
        if (originalData?.nameFr) updateData.nameFr = originalData.nameFr
        if (originalData?.nameDe) updateData.nameDe = originalData.nameDe
        if (originalData?.nameRu) updateData.nameRu = originalData.nameRu
      }
      
      const docRef = doc(db, 'categorias_globales', id)
      await updateDoc(docRef, updateData)
      
      toast.success(shouldTranslate ? 'Categoría traducida a 5 idiomas' : 'Categoría actualizada', { id: 'saving' })
      router.push('/admin/categorias')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar', { id: 'saving' })
    } finally {
      setIsSaving(false)
      setIsTranslating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Editar Categoría</CardTitle>
          <p className="text-sm text-gray-500">Al guardar, el nombre se traducirá automáticamente a 5 idiomas</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
            <div>
              <Label>Nombre (español) *</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Ej: Entradas"
              />
            </div>
            
            <div>
              <Label>Orden</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Activa</Label>
              <Switch
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
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
        </CardContent>
      </Card>
    </div>
  )
}