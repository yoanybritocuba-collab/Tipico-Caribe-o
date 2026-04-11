// lib/types-unified.ts

// ============ TIPO UNIFICADO DE CATEGORÍA ============
// Este es el ÚNICO tipo que debes usar en toda la app

export interface Categoria {
  id: string;
  name: string;        // nombre en español
  nameEn: string;      // nombre en inglés
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

// ============ TIPO PARA PRODUCTOS (actualizado) ============
export interface ProductoUnified {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  categoriaId: string;  // ← Este es el ID de la categoría (debe ser el mismo en todos lados)
  areaId: string;       // ← Área a la que pertenece
  image: string | null;
  isAvailable: boolean;
  isSuggested: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
}