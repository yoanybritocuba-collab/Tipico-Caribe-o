'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Package, 
  Tag, 
  Star,
  ShoppingBag,
  Utensils,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle,
  Plus,
  FolderOpen,
  List,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getAllProductos, getCategoriasGlobales } from '@/lib/firebase-services'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    productos: 0,
    categorias: 0,
    destacados: 0,
    disponibles: 0
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
        productos: productos.length,
        categorias: categorias.filter(c => c.activo).length,
        destacados: productos.filter(p => p.destacado).length,
        disponibles: productos.filter(p => p.activo).length,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Productos',
      value: stats.productos,
      icon: Package,
      gradient: 'from-blue-600 to-blue-500',
      bgGradient: 'from-blue-950/30 to-blue-900/30',
      borderColor: 'border-blue-800/50',
      iconBg: 'bg-blue-500/20',
      href: '/admin/productos',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Categorías',
      value: stats.categorias,
      icon: Tag,
      gradient: 'from-blue-600 to-blue-500',
      bgGradient: 'from-blue-950/30 to-blue-900/30',
      borderColor: 'border-blue-800/50',
      iconBg: 'bg-blue-500/20',
      href: '/admin/categorias',
      trend: '+2%',
      trendUp: true
    },
    {
      title: 'Destacados',
      value: stats.destacados,
      icon: Star,
      gradient: 'from-red-600 to-red-500',
      bgGradient: 'from-red-950/30 to-red-900/30',
      borderColor: 'border-red-800/50',
      iconBg: 'bg-red-500/20',
      href: '/admin/productos',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Disponibles',
      value: stats.disponibles,
      icon: CheckCircle,
      gradient: 'from-green-600 to-green-500',
      bgGradient: 'from-green-950/30 to-green-900/30',
      borderColor: 'border-green-800/50',
      iconBg: 'bg-green-500/20',
      href: '/admin/productos',
      trend: '+8%',
      trendUp: true
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Utensils className="h-5 w-5 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con gradiente azul-rojo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-red-600/20 p-6 border border-blue-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Panel de Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            Bienvenido de vuelta
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Aquí tienes el resumen de tu restaurante <span className="text-blue-400 font-medium">Típico Caribeño</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className={cn(
                "group relative overflow-hidden border transition-all duration-300 cursor-pointer",
                stat.borderColor,
                "bg-gradient-to-br from-gray-950/50 to-gray-900/50",
                "hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] hover:border-blue-500/50"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.trendUp ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.trend}
                        </span>
                        <span className="text-xs text-gray-500">vs mes anterior</span>
                      </div>
                    </div>
                    <div className={cn(
                      "rounded-xl p-2.5",
                      stat.iconBg,
                      "group-hover:scale-110 transition-transform"
                    )}>
                      <Icon className={cn("h-5 w-5", stat.title === 'Destacados' ? 'text-red-400' : 'text-blue-400')} />
                    </div>
                  </div>
                  {/* Barra decorativa con gradiente azul-rojo */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Acciones rápidas - Botones con gradiente azul-rojo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Acciones rápidas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/productos/nuevo">
            <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-xl py-6">
              <Plus className="h-4 w-4" />
              Agregar nuevo producto
            </Button>
          </Link>
          <Link href="/admin/categorias">
            <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-xl py-6">
              <FolderOpen className="h-4 w-4" />
              Gestionar categorías
            </Button>
          </Link>
          <Link href="/admin/productos">
            <Button className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/20 rounded-xl py-6">
              <List className="h-4 w-4" />
              Ver todos los productos
            </Button>
          </Link>
        </div>
      </div>

      {/* Tips e información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tips */}
        <div className="rounded-xl border border-blue-800/30 bg-gradient-to-br from-blue-950/20 to-transparent p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-400">Consejos útiles</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Los productos destacados aparecen en "Sugerencias del Chef"</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>Las fotos se suben automáticamente al Storage de Firebase</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Sparkles className="h-4 w-4 text-green-400" />
              <span>Traducción automática al inglés al guardar productos</span>
            </div>
          </div>
        </div>

        {/* Soporte */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-red-600/10 p-5 border border-blue-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-1">¿Necesitas ayuda?</h3>
              <p className="text-xs text-gray-400">Contacta con soporte para cualquier duda</p>
            </div>
            <a 
              href="https://wa.me/34682491444" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.032 2.5c-5.25 0-9.5 4.25-9.5 9.5 0 1.6.4 3.1 1.1 4.4l-1.1 4 4.1-1.1c1.3.7 2.8 1.1 4.4 1.1 5.25 0 9.5-4.25 9.5-9.5s-4.25-9.5-9.5-9.5z" />
              </svg>
              WhatsApp Soporte
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-600">
          Panel de administración - Típico Caribeño © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}