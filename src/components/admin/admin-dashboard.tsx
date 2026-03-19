'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  LayoutDashboard,
  PackageSearch,
  Tags,
  ClipboardList
} from 'lucide-react'

interface Stats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    status: string
    total: number
    createdAt: string
    user: { name: string | null; email: string }
  }>
  topProducts: Array<{
    id: string
    name: string
    price: number
    stock: number
    category: { name: string }
  }>
  lowStockProducts: Array<{
    id: string
    name: string
    stock: number
    category: { name: string }
  }>
}

export function AdminDashboard() {
  const { setView } = useAppStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          setStats(await res.json())
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      month: 'short',
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

  const menuItems = [
    { view: 'admin-products' as const, label: 'Productos', icon: Package, color: 'text-blue-500' },
    { view: 'admin-categories' as const, label: 'Categorías', icon: Tags, color: 'text-green-500' },
    { view: 'admin-orders' as const, label: 'Pedidos', icon: ClipboardList, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu tienda DIVINITY SKY TOOLS
          </p>
        </div>
        <div className="flex gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.view}
              variant="outline"
              onClick={() => setView(item.view)}
            >
              <item.icon className={`h-4 w-4 mr-2 ${item.color}`} />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-muted-foreground">Pedidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                <p className="text-sm text-muted-foreground">Usuarios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
                <p className="text-sm text-muted-foreground">Ingresos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Pedidos Recientes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView('admin-orders')}>
              Ver todos <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.name || order.user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                    {order.status}
                  </Badge>
                </div>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No hay pedidos recientes</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Stock Bajo
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView('admin-products')}>
              Ver todos <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.lowStockProducts?.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category.name}</p>
                  </div>
                  <Badge variant="destructive">
                    {product.stock} und
                  </Badge>
                </div>
              ))}
              {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No hay productos con stock bajo</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Productos Recientes
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setView('admin-products')}>
            Ver todos <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats?.topProducts?.map((product) => (
              <div key={product.id} className="p-3 bg-muted rounded-lg">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category.name}</p>
                <p className="text-sm font-bold text-primary mt-1">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
