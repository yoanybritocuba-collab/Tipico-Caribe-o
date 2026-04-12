'use client'

import { MenuItemCard } from './menu-item-card'
import { useStore } from '@/lib/store'

interface MenuSectionProps {
  section: {
    id: string
    name: string
    nameEn?: string
    description?: string
    order?: number
  }
  compact?: boolean
}

export function MenuSection({ section, compact = false }: MenuSectionProps) {
  const { products } = useStore()
  
  // Filtrar productos por categoría y disponibles
  const productsBySection = products.filter(p => p.categoryId === section.id && p.isAvailable)
  
  if (productsBySection.length === 0) return null

  // El nombre de la sección se pasa desde el padre ya traducido
  const sectionName = section.name || ''

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-primary/30 text-white">
        {sectionName}
      </h2>
      {section.description && (
        <p className="text-gray-400 mb-4">{section.description}</p>
      )}
      <div className="space-y-2">
        {productsBySection.map((product) => (
          <MenuItemCard key={product.id} product={product} compact={compact} />
        ))}
      </div>
    </div>
  )
}