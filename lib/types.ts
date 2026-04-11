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