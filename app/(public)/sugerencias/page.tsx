'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Star, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SuggestionCard } from '@/components/suggestion-card'
import { useI18n } from '@/lib/i18n'
import { getAllProductos, type Producto } from '@/lib/firebase-services'

export default function SuggestionsPage() {
  const { t } = useI18n()
  const [products, setProducts] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const prods = await getAllProductos()
      // Filtrar solo productos destacados y activos
      const suggestedProds = prods.filter(p => p.destacado === true && p.activo === true)
      setProducts(suggestedProds)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden bg-gradient-to-r from-blue-900 to-red-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs uppercase tracking-wider">{t('home.mostRequested')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            {t('nav.suggestions')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            {t('home.favoritesDescription')}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No hay sugerencias disponibles</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <SuggestionCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
              <a href="/carta">
                {t('home.discoverMenu')} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}