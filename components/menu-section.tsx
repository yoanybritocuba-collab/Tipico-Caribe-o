'use client'

import { MenuItemCard } from '@/components/menu-item-card'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'

interface MenuSectionProps {
  section: {
    id: string
    name: string
    nameEn?: string
    description?: string
    descriptionEn?: string
  }
  compact?: boolean
}

export function MenuSection({ section, compact = false }: MenuSectionProps) {
  const { getLocalizedField } = useI18n()
  const { products } = useStore()

  const productsBySection = products.filter(p => p.categoryId === section.id && p.isAvailable)
  const name = getLocalizedField(section, 'name')
  const description = getLocalizedField(section, 'description')

  if (productsBySection.length === 0) return null

  return (
    <section className="py-8" id={section.id}>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold md:text-3xl">{name}</h2>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>

      {compact ? (
        <div className="space-y-0">
          {productsBySection.map((product) => (
            <MenuItemCard key={product.id} product={product} compact />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productsBySection.map((product) => (
            <MenuItemCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}