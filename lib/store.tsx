import { create } from 'zustand';
import { getAllProductos, getCategoriasActivasGlobales } from './firebase-services';
import { Product, Category } from './data';

interface StoreState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  loadAll: () => Promise<void>;
  getSuggestions: () => Product[];
  getProductsBySection: (sectionId: string) => Product[];
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,

  loadAll: async () => {
    set({ isLoading: true });
    
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
      
      set({ products, categories, isLoading: false });
    } catch (error) {
      console.error('Error loading data:', error);
      set({ isLoading: false });
    }
  },

  getSuggestions: () => {
    return get().products.filter(p => p.isSuggested && p.isAvailable);
  },

  getProductsBySection: (sectionId: string) => {
    return get().products.filter(p => p.categoryId === sectionId && p.isAvailable);
  },
}));

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}