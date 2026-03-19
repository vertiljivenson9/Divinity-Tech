'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Package, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  id: string
  userId: string
  status: string
  total: number
  shippingAddress: string | null
  createdAt: string
  items: { id: string; productId: string; quantity: number; price: number }[]
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'Procesando', color: 'bg-blue-500', icon: Package },
  shipped: { label: 'Enviado', color: 'bg-purple-500', icon: ShoppingBag },
  delivered: { label: 'Entregado', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle }
}

export function AdminOrders() {
  const { setView } = useAppStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch {
      toast.error('Error al cargar órdenes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success('Estado actualizado')
        fetchOrders()
      }
    } catch {
      toast.error('Error al actualizar')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return <div className="flex justify-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setView('admin-dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Gestionar Órdenes</h1>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay órdenes</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = config.icon
            return (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={config.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{formatPrice(order.total)}</span>
                      <Select value={order.status} onValueChange={(value) => updateStatus(order.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="processing">Procesando</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>ID:</strong> {order.id}</p>
                    <p className="text-sm"><strong>Usuario:</strong> {order.userId}</p>
                    <p className="text-sm"><strong>Artículos:</strong> {order.items?.length || 0}</p>
                    {order.shippingAddress && (
                      <p className="text-sm"><strong>Dirección:</strong> {order.shippingAddress}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
