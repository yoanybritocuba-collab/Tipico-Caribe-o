'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { translateToAllLanguages } from '@/lib/translate'
import { Loader2, Languages } from 'lucide-react'

export default function NuevaCategoriaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    activo: true,
    order: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre en español es obligatorio')
      return
    }

    setIsLoading(true)
    toast.loading('Guardando y traduciendo...', { id: 'saving' })
    
    try {
      const translations = await translateToAllLanguages(formData.nombre)
      
      await addDoc(collection(db, 'categorias_globales'), {
        nombre: formData.nombre,
        nameEn: translations.en || formData.nombre,
        nameFr: translations.fr || formData.nombre,
        nameDe: translations.de || formData.nombre,
        nameRu: translations.ru || formData.nombre,
        activo: formData.activo,
        order: formData.order,
        createdAt: new Date().toISOString()
      })
      
      toast.success('Categoría creada y traducida', { id: 'saving' })
      router.push('/admin/categorias')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al crear la categoría', { id: 'saving' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <CardTitle className="text-gold">Nueva Categoría</CardTitle>
          <p className="text-sm text-gray-400">Se traducirá automáticamente a Inglés, Francés, Alemán y Ruso</p>
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
            
            <Button type="submit" disabled={isLoading} className="w-full bg-gold text-black hover:bg-gold-dark">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Languages className="mr-2 h-4 w-4" />
              {isLoading ? 'Guardando y traduciendo...' : 'Crear categoría'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}