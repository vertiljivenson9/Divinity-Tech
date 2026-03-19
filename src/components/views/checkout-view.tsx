'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAppStore } from '@/store'
import { useCartStore } from '@/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Truck, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function CheckoutView() {
  const { setView } = useAppStore()
  const { items, getTotal, clearCart } = useCartStore()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    phone: '',
    address: '',
    notes: ''
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const subtotal = getTotal()
  const shipping = subtotal > 500000 ? 0 : 15000
  const tax = subtotal * 0.19
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) {
      toast.error('Debes iniciar sesión para continuar')
      return
    }

    if (items.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          shippingName: formData.name,
          shippingPhone: formData.phone,
          shippingAddr: formData.address,
          notes: formData.notes
        })
      })

      if (res.ok) {
        const order = await res.json()
        setOrderId(order.id)
        setSuccess(true)
        clearCart()
        toast.success('¡Pedido realizado con éxito!')
      } else {
        throw new Error('Error al procesar el pedido')
      }
    } catch (error) {
      toast.error('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
        <p className="text-muted-foreground mb-4">
          Tu pedido ha sido procesado exitosamente.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Número de pedido: <span className="font-mono font-bold">{orderId}</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setView('orders')}>Ver Mis Pedidos</Button>
          <Button variant="outline" onClick={() => setView('catalog')}>
            Seguir Comprando
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">Tu carrito está vacío</p>
        <Button onClick={() => setView('catalog')}>Ver Productos</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => setView('catalog')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al catálogo
      </Button>

      <h1 className="text-3xl font-bold">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+57 300 000 0000"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección de envío *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle 123 #45-67, Barrio, Ciudad"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-muted">
                  <p className="font-medium">Pago contra entrega</p>
                  <p className="text-sm text-muted-foreground">
                    Paga en efectivo o con tarjeta al recibir tu pedido
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar Pedido'
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">DS</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Envío {subtotal > 500000 && (
                      <Badge variant="secondary" className="ml-1 text-xs">Gratis</Badge>
                    )}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
