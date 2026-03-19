"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProductForm } from "@/components/product-form"
import { useCartStore } from "@/store/cart"
import { 
  Package, Search, Plus, Edit, Trash2, ShoppingBag, 
  LayoutDashboard, Users, FolderTree, ClipboardList,
  TrendingUp, DollarSign, Eye, X
} from "lucide-react"

// Types
interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  categoryId?: string
  stock: number
  category?: { id: string; name: string }
}

interface Category {
  id: string
  name: string
  description?: string
  image?: string
  _count?: { products: number }
}

interface User {
  id: string
  email: string
  name?: string
  role: string
}

interface Order {
  id: string
  userId?: string
  total: number
  status: string
  createdAt: string
  user?: { name?: string; email: string }
  items?: { product: { name: string }; quantity: number; price: number }[]
}

export default function HomePage() {
  // State
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<any>({})
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerMode, setRegisterMode] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' })
  const [loginError, setLoginError] = useState('')
  
  const [currentView, setCurrentView] = useState<'catalog' | 'admin'>('catalog')
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'users'>('dashboard')
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' })
  
  const [orderSuccess, setOrderSuccess] = useState(false)

  const { items, addItem } = useCartStore()
  const isAdmin = user?.role === 'admin'

  // Fetch initial data
  useEffect(() => {
    fetchProducts()
    fetchCategories()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data?.user) {
        setUser(data.user)
      }
    } catch (e) {
      console.error('Auth check failed:', e)
    }
  }

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set('categoryId', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch products:', e)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch categories:', e)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch orders:', e)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch users:', e)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error('Failed to fetch stats:', e)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    if (currentView === 'admin' && isAdmin) {
      fetchStats()
      fetchOrders()
      fetchUsers()
    }
  }, [currentView, adminTab, isAdmin])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      if (registerMode) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Error al registrar')
        }
      }

      // Login after register or direct login
      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email: loginForm.email,
          password: loginForm.password,
        }),
      })

      if (res.ok) {
        await checkAuth()
        setLoginOpen(false)
        setLoginForm({ email: '', password: '', name: '' })
      } else {
        setLoginError('Credenciales incorrectas')
      }
    } catch (error: any) {
      setLoginError(error.message || 'Error en la autenticación')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
    setCurrentView('catalog')
  }

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  // Admin handlers
  const handleSaveProduct = async (data: any) => {
    try {
      const url = data.id ? `/api/products/${data.id}` : '/api/products'
      const method = data.id ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      fetchProducts()
      setProductFormOpen(false)
      setEditingProduct(undefined)
    } catch (e) {
      console.error('Failed to save product:', e)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (e) {
      console.error('Failed to delete product:', e)
    }
  }

  const handleSaveCategory = async () => {
    try {
      const url = editingCategory?.id ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory?.id ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      })
      fetchCategories()
      setCategoryFormOpen(false)
      setEditingCategory(undefined)
      setCategoryForm({ name: '', description: '', image: '' })
    } catch (e) {
      console.error('Failed to save category:', e)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      fetchCategories()
    } catch (e) {
      console.error('Failed to delete category:', e)
    }
  }

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchOrders()
    } catch (e) {
      console.error('Failed to update order:', e)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        cartCount={items.length}
        onCartClick={() => setCartOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
        onAdminClick={() => setCurrentView('admin')}
        onCatalogClick={() => setCurrentView('catalog')}
        isAdmin={isAdmin}
      />

      {currentView === 'catalog' ? (
        // CATALOG VIEW
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-[#2563EB]">DIVINITY</span>{' '}
              <span className="text-[#FF6B35]">SKY TOOLS</span>
            </h1>
            <p className="text-gray-600">Tu catálogo digital de productos tecnológicos</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className={selectedCategory === '' ? 'bg-[#2563EB]' : ''}
              >
                Todos
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={selectedCategory === cat.id ? 'bg-[#2563EB]' : ''}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    {product.category && (
                      <Badge className="absolute top-2 right-2 bg-[#FF6B35]">
                        {product.category.name}
                      </Badge>
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">Agotado</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#2563EB]">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      ) : (
        // ADMIN VIEW
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-[#2563EB]" />
                Panel Admin
              </h2>
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                  { id: 'products', label: 'Productos', icon: Package },
                  { id: 'categories', label: 'Categorías', icon: FolderTree },
                  { id: 'orders', label: 'Pedidos', icon: ClipboardList },
                  { id: 'users', label: 'Usuarios', icon: Users },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAdminTab(item.id as any)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                      adminTab === item.id
                        ? 'bg-[#2563EB] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Admin Content */}
            <div className="flex-1">
              {adminTab === 'dashboard' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Dashboard</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Productos', value: stats.productsCount || 0, icon: Package, color: 'bg-blue-500' },
                      { label: 'Categorías', value: stats.categoriesCount || 0, icon: FolderTree, color: 'bg-green-500' },
                      { label: 'Pedidos', value: stats.ordersCount || 0, icon: ClipboardList, color: 'bg-orange-500' },
                      { label: 'Usuarios', value: stats.usersCount || 0, icon: Users, color: 'bg-purple-500' },
                    ].map((stat) => (
                      <Card key={stat.label}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                              <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{stat.value}</p>
                              <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        Ingresos Totales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">
                        ${(stats.totalRevenue || 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {adminTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Productos</h2>
                    <Button
                      onClick={() => { setEditingProduct(undefined); setProductFormOpen(true); }}
                      className="bg-[#2563EB]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Producto
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Producto</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Precio</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Categoría</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                    {product.image ? (
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                  <span className="font-medium">{product.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-[#2563EB]">
                                ${product.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant={product.stock > 0 ? 'success' : 'destructive'}>
                                  {product.stock}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {product.category?.name || '-'}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setEditingProduct(product); setProductFormOpen(true); }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'categories' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Categorías</h2>
                    <Button
                      onClick={() => { 
                        setEditingCategory(undefined)
                        setCategoryForm({ name: '', description: '', image: '' })
                        setCategoryFormOpen(true)
                      }}
                      className="bg-[#2563EB]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card key={category.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingCategory(category)
                                  setCategoryForm({
                                    name: category.name,
                                    description: category.description || '',
                                    image: category.image || '',
                                  })
                                  setCategoryFormOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 mb-2">{category.description || 'Sin descripción'}</p>
                          <Badge variant="secondary">
                            {category._count?.products || 0} productos
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Pedidos</h2>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cliente</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                              <td className="px-4 py-3">{order.user?.email || 'Invitado'}</td>
                              <td className="px-4 py-3 font-medium">${order.total.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={
                                    order.status === 'completed' ? 'success' :
                                    order.status === 'pending' ? 'warning' :
                                    order.status === 'cancelled' ? 'destructive' : 'secondary'
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                    className="text-green-600"
                                  >
                                    ✓
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                    className="text-red-600"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'users' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Usuarios</h2>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nombre</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rol</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">{u.name || '-'}</td>
                              <td className="px-4 py-3">{u.email}</td>
                              <td className="px-4 py-3">
                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                                  {u.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        user={user}
        onCheckoutComplete={() => setOrderSuccess(true)}
      />

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{registerMode ? 'Crear Cuenta' : 'Iniciar Sesión'}</DialogTitle>
            <DialogDescription>
              {registerMode ? 'Crea tu cuenta para comenzar' : 'Accede a tu cuenta'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            {registerMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-500">{loginError}</p>
            )}
            <Button type="submit" className="w-full bg-[#2563EB]">
              {registerMode ? 'Crear Cuenta' : 'Entrar'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setRegisterMode(!registerMode)}
            >
              {registerMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </Button>
            <div className="text-xs text-center text-gray-500 border-t pt-4">
              <p><strong>Demo Admin:</strong> admin@divinityskytools.com / admin123</p>
              <p><strong>Demo Usuario:</strong> user@divinityskytools.com / user123</p>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Form Dialog */}
      <ProductForm
        open={productFormOpen}
        onOpenChange={setProductFormOpen}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      {/* Category Form Dialog */}
      <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input
                value={categoryForm.image}
                onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCategoryFormOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveCategory} className="bg-[#2563EB]">Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog open={orderSuccess} onOpenChange={setOrderSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">¡Pedido Exitoso!</DialogTitle>
            <DialogDescription>
              Tu pedido ha sido registrado correctamente.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setOrderSuccess(false)} className="bg-[#2563EB]">
            Continuar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
