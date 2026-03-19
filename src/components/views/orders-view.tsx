'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react'

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  product?: {
    image: string | null
  }
}

interface Order {
  id: string
  status: string
  total: number
  shippingCost: number
  tax: number
  shippingName: string | null
  shippingPhone: string | null
  shippingAddr: string | null
  createdAt: string
  items: OrderItem[]
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'Procesando', color: 'bg-blue-500', icon: Package },
  shipped: { label: 'Enviado', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Entregado', color: 'bg-green-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle }
}

export function OrdersView() {
  const { setView } = useAppStore()
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return
      try {
        const res = await fetch(`/api/orders?userId=${session.user.id}`)
        if (res.ok) {
          setOrders(await res.json())
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [session?.user?.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => setView('home')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al inicio
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Mis Pedidos</h1>
        <p className="text-muted-foreground">Historial de tus compras</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg mb-4">No tienes pedidos aún</p>
          <Button onClick={() => setView('catalog')}>Ver Productos</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={`${status.color} text-white`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Shipping Info */}
                  {order.shippingName && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{order.shippingName}</p>
                      <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
                      <p className="text-sm text-muted-foreground">{order.shippingAddr}</p>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                          {item.product?.image ? (
                            <img src={item.product.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">DS</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Totals */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(order.total - order.tax - order.shippingCost)}</span>
                    </div>
                    {order.shippingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Envío</span>
                        <span>{formatPrice(order.shippingCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IVA</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
