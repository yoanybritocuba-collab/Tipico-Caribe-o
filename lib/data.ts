import { getAllProductos, getCategoriasActivasGlobales, type Producto, type CategoriaGlobal } from './firebase-services';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  categoryId: string;
  image: string | null;
  isAvailable: boolean;
  isSuggested: boolean;
  order?: number;
  createdAt?: string | Date;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  activo: boolean;
  order?: number;
}

export async function loadProductsAndCategories(): Promise<{ products: Product[]; categories: Category[] }> {
  try {
    const [productos, categoriesData] = await Promise.all([
      getAllProductos(),
      getCategoriasActivasGlobales()
    ]);

    const categories: Category[] = categoriesData.map(cat => ({
      id: cat.id,
      name: cat.nombre,
      nameEn: cat.nameEn || '',
      description: '',
      activo: cat.activo,
      order: cat.order,
    }));

    const products: Product[] = productos.map(p => {
      const description = p.descripcion || '';
      const descriptionEn = p.descriptionEn || '';
      const image = p.imagenUrl || null;
      
      return {
        id: p.id,
        name: p.nombre,
        nameEn: p.nameEn || '',
        description: description,
        descriptionEn: descriptionEn,
        price: p.precio,
        categoryId: p.categoriaGlobalId,
        image: image,
        isAvailable: p.activo,
        isSuggested: p.destacado || false,
        order: p.orden,
        createdAt: undefined,
      };
    });

    return { products, categories };
  } catch (error) {
    console.error('Error loading data:', error);
    return { products: [], categories: [] };
  }
}

export function getProductsByCategory(products: Product[], categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId && p.isAvailable);
}

export function getSuggestedProducts(products: Product[]): Product[] {
  return products.filter(p => p.isSuggested && p.isAvailable);
}