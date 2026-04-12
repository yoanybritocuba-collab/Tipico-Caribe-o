'use client'

import { useState } from 'react'
import { Plus, Minus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { addToCart } from '@/lib/cart-store'
import { useI18n } from '@/lib/i18n'
import { toast } from 'sonner'

interface MenuItemCardProps {
  product: any
  compact?: boolean
}

export function MenuItemCard({ product, compact = false }: MenuItemCardProps) {
  const { t } = useI18n()
  const [quantity, setQuantity] = useState(0)

  // Los nombres y descripciones traducidos vienen desde Firestore
  // El componente usa directamente product.nombre (español) y product.nameEn, etc.
  // Para mostrar el idioma correcto, el padre debe pasar el producto ya traducido
  // o usamos el campo según el idioma actual
  
  const name = product.nombre || ''
  const description = product.descripcion || ''

  const updateQuantity = (delta: number) => {
    setQuantity(prev => Math.max(0, prev + delta))
  }

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({
        id: product.id,
        name: name,
        price: product.precio,
        image: product.imagenUrl,
      }, quantity)
      toast.success(`${name} ${t('common.added')}`, {
        description: `${t('common.quantity')}: ${quantity} | ${t('common.total')}: €${(product.precio * quantity).toFixed(2)}`,
      })
      setQuantity(0)
    }
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-800">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{name}</h3>
            {product.destacado && (
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-400 line-clamp-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-yellow-500">€{product.precio.toFixed(2)}</p>
          <div className="flex items-center gap-1">
            {quantity > 0 && (
              <>
                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(-1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-white text-sm">{quantity}</span>
              </>
            )}
            <Button size={quantity > 0 ? "icon" : "sm"} className={quantity > 0 ? "h-7 w-7" : "h-7 px-2"} onClick={quantity === 0 ? () => updateQuantity(1) : handleAddToCart}>
              {quantity === 0 ? <Plus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer bg-gray-900/95 border-gray-800">
      {product.destacado && (
        <div className="absolute top-2 right-2 z-10 flex gap-0.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
        </div>
      )}
      <CardContent className="p-0">
        <div className="aspect-[4/3] overflow-hidden bg-gray-800">
          {product.imagenUrl ? (
            <img 
              src={product.imagenUrl} 
              alt={name} 
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl bg-gradient-to-br from-gray-800 to-gray-900">
              🍽️
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-base text-white">{name}</h3>
            <p className="font-bold text-lg text-yellow-500">€{product.precio.toFixed(2)}</p>
          </div>
          {description && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{description}</p>
          )}
          <div className="flex items-center justify-end gap-2 mt-2">
            {quantity > 0 && (
              <>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(-1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-medium text-white">{quantity}</span>
              </>
            )}
            <Button size={quantity > 0 ? "icon" : "default"} className={quantity > 0 ? "h-8 w-8" : "gap-1"} onClick={quantity === 0 ? () => updateQuantity(1) : handleAddToCart}>
              {quantity === 0 ? (
                <>Agregar <Plus className="h-3 w-3" /></>
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}