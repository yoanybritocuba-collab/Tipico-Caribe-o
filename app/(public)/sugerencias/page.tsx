'use client'

import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n'
import { getAllProductos, getCategoriasActivasGlobales, type Producto, type CategoriaGlobal } from '@/lib/firebase-services'
import { useEffect, useState } from 'react'

export default function SuggestionsPage() {
  const { t, getLocalizedField } = useI18n()
  const [products, setProducts] = useState<Producto[]>([])
  const [categories, setCategories] = useState<CategoriaGlobal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        getAllProductos(),
        getCategoriasActivasGlobales()
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener productos sugeridos (destacados)
  const suggestions = products.filter(p => p.destacado === true && p.activo === true)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-accent/10 to-background py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="text-sm font-medium text-accent">Selección del Chef</span>
          </div>
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            {t('menu.suggestions')}
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Nuestros platos más destacados, preparados con ingredientes frescos y recetas tradicionales dominicanas
          </p>
        </div>
      </section>

      {/* Suggestions Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay sugerencias disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((product) => {
                const category = categories.find(c => c.id === product.categoriaGlobalId)
                const productName = getLocalizedField(product, 'nombre')
                const productDescription = getLocalizedField(product, 'descripcion')
                const categoryName = category ? getLocalizedField(category, 'name') : ''

                return (
                  <Card key={product.id} className="group overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {product.imagenUrl ? (
                        <div 
                          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${product.imagenUrl})` }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <span className="text-6xl">🍽️</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Badge variant="secondary" className="bg-white/90 text-foreground">
                          {categoryName}
                        </Badge>
                      </div>
                      <div className="absolute right-3 top-3 rounded-full bg-accent p-2 shadow-lg">
                        <Star className="h-4 w-4 fill-accent-foreground text-accent-foreground" />
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="mb-2 font-serif text-xl font-bold">
                        {productName}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                        {productDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {product.precio.toFixed(2)}€
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-6 text-lg text-muted-foreground">
            ¿Te hemos abierto el apetito?
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/carta">
              <Button variant="outline" size="lg" className="group">
                Ver carta completa
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/reservas">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Reservar mesa
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}