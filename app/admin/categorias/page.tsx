'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { db } from '@/lib/firebase'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'

interface Categoria {
  id: string
  nombre: string
  nameEn?: string
  activo: boolean
  order?: number
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'categorias_globales'))
      const cats: Categoria[] = []
      querySnapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Categoria)
      })
      console.log('Categorías cargadas:', cats)
      setCategories(cats)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar categorías')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      await updateDoc(doc(db, 'categorias_globales', id), { activo: !currentActive })
      setCategories(prev => prev.map(c => c.id === id ? { ...c, activo: !currentActive } : c))
      toast.success('Estado actualizado')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta categoría?')) {
      try {
        await deleteDoc(doc(db, 'categorias_globales', id))
        setCategories(prev => prev.filter(c => c.id !== id))
        toast.success('Categoría eliminada')
      } catch (error) {
        console.error('Error:', error)
        toast.error('Error al eliminar')
      }
    }
  }

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Categorías</h1>
        <Link href="/admin/categorias/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        </Link>
      </div>

      <Card className="border-gray-800 bg-gray-950/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800 bg-gray-900/50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400">Nombre</th>
                  <th className="text-left py-4 px-6 text-gray-400">Estado</th>
                  <th className="text-left py-4 px-6 text-gray-400">Orden</th>
                  <th className="text-left py-4 px-6 text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-900/30">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">{cat.nombre}</p>
                        {cat.nameEn && <p className="text-sm text-gray-400">{cat.nameEn}</p>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleActive(cat.id, cat.activo)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400"
                      >
                        {cat.activo ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {cat.activo ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{cat.order || 0}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/categorias/editar/${cat.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}