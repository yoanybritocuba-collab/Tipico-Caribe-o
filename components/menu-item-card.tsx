'use client'

import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MenuItemCardProps {
  product: Product
  compact?: boolean
}

export function MenuItemCard({ product, compact = false }: MenuItemCardProps) {
  const { t, getLocalizedField } = useI18n()

  const name = getLocalizedField(product, 'name')
  const description = getLocalizedField(product, 'description')

  if (compact) {
    return (
      <div className="flex items-start justify-between gap-4 border-b border-dashed py-3 last:border-0">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{name}</h4>
            {product.isSuggested && (
              <Star className="h-4 w-4 fill-accent text-accent" />
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-primary">
            {product.price.toFixed(2)}€
          </span>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn(
      "group overflow-hidden transition-all hover:shadow-lg",
      !product.isAvailable && "opacity-60"
    )}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.image ? (
          <div 
            className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${product.image})` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {product.isSuggested && (
          <div className="absolute right-2 top-2 rounded-full bg-accent p-2 text-accent-foreground shadow-lg">
            <Star className="h-4 w-4 fill-current" />
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="secondary">No disponible</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{name}</h3>
          <span className="shrink-0 text-lg font-bold text-primary">
            {product.price.toFixed(2)}€
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
    </Card>
  )
}