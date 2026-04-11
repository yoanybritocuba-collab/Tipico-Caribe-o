'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  FolderTree, 
  Star, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllProductos, getCategoriasGlobales } from '@/lib/firebase-services'
import { toast } from 'sonner'

interface Stats {
  totalProducts: number
  totalCategories: number
  suggestedProducts: number
  availableProducts: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    suggestedProducts: 0,
    availableProducts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const [productos, categorias] = await Promise.all([
        getAllProductos(),
        getCategoriasGlobales()
      ])

      setStats({
        totalProducts: productos.length,
        totalCategories: categorias.filter(c => c.activo).length,
        suggestedProducts: productos.filter(p => p.destacado).length,
        availableProducts: productos.filter(p => p.activo).length,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('Error al cargar estadísticas')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Categorías Activas',
      value: stats.totalCategories,
      icon: FolderTree,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Productos Destacados',
      value: stats.suggestedProducts,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      trend: '⭐ Sugerencias',
      trendUp: true
    },
    {
      title: 'Productos Disponibles',
      value: stats.availableProducts,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      trend: `${((stats.availableProducts / stats.totalProducts) * 100).toFixed(0)}% del total`,
      trendUp: true
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
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Panel de Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Resumen general del restaurante
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="relative overflow-hidden border border-blue-800/30 bg-gradient-to-br from-gray-950/50 to-gray-900/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {card.trendUp ? (
                        <ArrowUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs ${card.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                        {card.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-full p-3 ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </CardContent>
              {/* Barra decorativa inferior */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${card.color} w-0 group-hover:w-full transition-all duration-500`} />
            </Card>
          )
        })}
      </div>

      {/* Últimas actividades / Próximos pasos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-blue-800/30 bg-gradient-to-br from-gray-950/50 to-gray-900/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Agregar más productos</p>
                <p className="text-xs text-gray-400">Expande tu carta con nuevos platos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <FolderTree className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Organizar categorías</p>
                <p className="text-xs text-gray-400">Mantén tu menú ordenado</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Destacar productos</p>
                <p className="text-xs text-gray-400">Selecciona los más vendidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-800/30 bg-gradient-to-br from-gray-950/50 to-gray-900/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Resumen Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Productos activos</span>
                <span className="text-white font-medium">{stats.availableProducts} / {stats.totalProducts}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.availableProducts / stats.totalProducts) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Productos destacados</span>
                <span className="text-white font-medium">{stats.suggestedProducts} / {stats.totalProducts}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.suggestedProducts / stats.totalProducts) * 100}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-400 text-center">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}