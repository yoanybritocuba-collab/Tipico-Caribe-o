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
import { translateToAllLanguages } from '@/lib/translate'
import { Loader2, ArrowLeft, Languages } from 'lucide-react'

export default function EditarCategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    activo: true,
    order: 1
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre en español es obligatorio')
      return
    }

    setIsSaving(true)
    toast.loading('Guardando y traduciendo...', { id: 'saving' })

    try {
      const translations = await translateToAllLanguages(formData.nombre)
      
      const docRef = doc(db, 'categorias_globales', id)
      await updateDoc(docRef, {
        nombre: formData.nombre,
        nameEn: translations.en || formData.nombre,
        nameFr: translations.fr || formData.nombre,
        nameDe: translations.de || formData.nombre,
        nameRu: translations.ru || formData.nombre,
        activo: formData.activo,
        order: formData.order,
        updatedAt: new Date().toISOString()
      })
      
      toast.success('Categoría actualizada y traducida', { id: 'saving' })
      router.push('/admin/categorias')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar la categoría', { id: 'saving' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
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
      
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="text-gold">Editar Categoría</CardTitle>
          <p className="text-sm text-gray-400">Se traducirá automáticamente a 4 idiomas</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300">Nombre (español) *</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Ej: Entradas"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Orden</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Activa</Label>
              <Switch
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
              />
            </div>
            
            <Button type="submit" disabled={isSaving} className="w-full bg-gold text-black hover:bg-gold-dark">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Languages className="mr-2 h-4 w-4" />
              {isSaving ? 'Guardando y traduciendo...' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}