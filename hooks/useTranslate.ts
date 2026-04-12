'use client'

import { useI18n } from '@/lib/i18n'

export function useTranslate() {
  const { language, t, getLocalizedField } = useI18n()

  const translateText = (key: string): string => {
    return t(key)
  }

  const translateItem = (item: any, field: string): string => {
    if (!item) return ''
    return getLocalizedField(item, field)
  }

  const translateCategory = (category: any): string => {
    if (!category) return ''
    return getLocalizedField(category, 'nombre')
  }

  const translateProduct = (product: any): { name: string; description: string } => {
    if (!product) return { name: '', description: '' }
    return {
      name: getLocalizedField(product, 'nombre'),
      description: getLocalizedField(product, 'descripcion')
    }
  }

  return { language, translateText, translateItem, translateCategory, translateProduct }
}