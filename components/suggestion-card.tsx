'use client'

import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import type { Product } from '@/lib/types'  // <-- CAMBIADO de data a types

interface SuggestionCardProps {
  product: Product
}

export function SuggestionCard({ product }: SuggestionCardProps) {
  const { getLocalizedField } = useI18n()

  const name = getLocalizedField(product, 'name')
  const description = getLocalizedField(product, 'description')

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image ? (
          <div 
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${product.image})` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="text-sm font-medium text-accent">Sugerencia del Chef</span>
          </div>
          <h3 className="font-serif text-xl font-bold">{name}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price.toFixed(2)}€
          </span>
        </div>
      </CardContent>
    </Card>
  )
}