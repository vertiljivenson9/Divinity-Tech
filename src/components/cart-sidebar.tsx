"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Plus, Minus, X, ShoppingBag } from "lucide-react"
import { useCartStore, type CartItem } from "@/store/cart"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onCheckoutComplete: () => void
}

export function CartSidebar({ isOpen, onClose, user, onCheckoutComplete }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    setCheckingOut(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          total: getTotal(),
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (response.ok) {
        clearCart()
        onCheckoutComplete()
        onClose()
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <>
      {/* Cart Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#2563EB]" />
              Tu Carrito
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-[#2563EB] font-bold">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold text-[#2563EB]">${getTotal().toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? 'Procesando...' : 'Finalizar Compra'}
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Vaciar Carrito
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inicia sesión para continuar</DialogTitle>
            <DialogDescription>
              Necesitas una cuenta para realizar compras.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => { setShowLoginPrompt(false); onClose(); }} className="bg-[#2563EB]">
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
