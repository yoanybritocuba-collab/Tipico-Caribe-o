// lib/cart-store.ts

import { Product } from './types'

export interface CartItem {
  product: Product
  quantity: number
  notes?: string
}

const CART_STORAGE_KEY = 'tipico_caribeno_cart'

// Obtener carrito
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(CART_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Guardar carrito
export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

// Agregar al carrito (acepta producto parcial)
export function addToCart(product: Partial<Product> & { id: string; name: string; price: number }, quantity: number = 1, notes?: string): void {
  const cart = getCart()
  const existingIndex = cart.findIndex(item => item.product.id === product.id)
  
  // Crear un producto completo con valores por defecto
  const fullProduct: Product = {
    id: product.id,
    name: product.name,
    nameEn: product.nameEn || '',
    description: product.description || '',
    descriptionEn: product.descriptionEn || '',
    price: product.price,
    categoryId: product.categoryId || '',
    image: product.image || null,
    isAvailable: product.isAvailable ?? true,
    isSuggested: product.isSuggested ?? false,
    order: product.order || 0,
    createdAt: product.createdAt || new Date().toISOString(),
  }
  
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity
  } else {
    cart.push({ product: fullProduct, quantity, notes })
  }
  saveCart(cart)
}

// Quitar del carrito
export function removeFromCart(productId: string): void {
  const cart = getCart()
  const filtered = cart.filter(item => item.product.id !== productId)
  saveCart(filtered)
}

// Actualizar cantidad
export function updateQuantity(productId: string, quantity: number): void {
  const cart = getCart()
  const item = cart.find(item => item.product.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      saveCart(cart)
    }
  }
}

// Vaciar carrito
export function clearCart(): void {
  saveCart([])
}

// Obtener total
export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
}

// Obtener cantidad total de items
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}