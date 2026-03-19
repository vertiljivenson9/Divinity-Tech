'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { useCartStore } from '@/store/cart'
import { useSession } from 'next-auth/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface CartSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { setView } = useAppStore()
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const { status } = useSession()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleCheckout = () => {
    onOpenChange(false)
    if (status === 'authenticated') {
      setView('checkout')
    } else {
      setView('login')
    }
  }

  const subtotal = getTotal()
  const shipping = subtotal > 500000 ? 0 : 15000
  const tax = subtotal * 0.19
  const total = subtotal + shipping + tax

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <Button variant="outline" onClick={() => {
              onOpenChange(false)
              setView('catalog')
            }}>
              Ver Productos
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 p-3 bg-muted rounded-lg">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-background flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <span className="text-xs font-bold text-primary/50">DS</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <p className="text-sm text-primary font-semibold">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Summary */}
            <div className="space-y-2 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Envío {subtotal > 500000 && <span className="text-green-600">(Gratis)</span>}
                </span>
                <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (19%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceder al Pago
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onOpenChange(false)
                  setView('catalog')
                }}
              >
                Seguir Comprando
              </Button>
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive"
                onClick={clearCart}
              >
                Vaciar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
