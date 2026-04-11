'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getCart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, clearCart, CartItem } from '@/lib/cart-store'

export function CartDrawer() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const updateCartState = () => {
    setCart(getCart())
  }

  useEffect(() => {
    updateCartState()
    
    const handleStorageChange = () => {
      updateCartState()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const total = getCartTotal()
  const itemCount = getCartItemCount()

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    updateCartState()
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
    updateCartState()
  }

  const handleClearCart = () => {
    clearCart()
    updateCartState()
  }

  const handleCheckout = () => {
    const pedido = cart.map(item => 
      `${item.quantity}x ${item.product.name} - €${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n')
    
    alert(`✅ Pedido realizado por €${total.toFixed(2)}\n\n${pedido}\n\nGracias por tu orden. Tu pedido ha sido enviado a la cocina.`)
    clearCart()
    updateCartState()
    setIsOpen(false)
  }

  return (
    <>
      {/* Botón flotante del carrito */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative">
                <ShoppingBag className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>Mi Pedido</span>
                  <Button variant="ghost" size="sm" onClick={handleClearCart}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Vaciar
                  </Button>
                </SheetTitle>
              </SheetHeader>
              
              <Separator className="my-4" />
              
              <ScrollArea className="flex-1">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Tu pedido está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        {/* Imagen */}
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.product.image ? (
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">€{item.product.price.toFixed(2)} c/u</p>
                          {item.notes && <p className="text-xs text-muted-foreground mt-1">📝 {item.notes}</p>}
                        </div>
                        
                        {/* Cantidad y precio */}
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="mt-2 font-bold text-sm">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        {/* Eliminar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemove(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Confirmar Pedido
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Tu pedido se enviará directamente a la cocina
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  )
}