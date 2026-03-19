'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ShoppingCart, Star, Search, SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  image: string | null
  featured: boolean
  isNew: boolean
  category: { id: string; name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
  _count?: { products: number }
}

export function CatalogView() {
  const { setView, setProductId, searchQuery, setSearchQuery } = useAppStore()
  const { addItem } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [gridCols, setGridCols] = useState<3 | 4>(3)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?category=${selectedCategory}&sort=${sortBy}&search=${searchQuery}`),
          fetch('/api/categories')
        ])
        setProducts(await productsRes.json())
        setCategories(await categoriesRes.json())
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCategory, sortBy, searchQuery])

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    })
    toast.success('Producto agregado al carrito')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
          <p className="text-muted-foreground">
            {products.length} productos disponibles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setGridCols(3)}
            className={gridCols === 3 ? 'bg-primary text-primary-foreground' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setGridCols(4)}
            className={gridCols === 4 ? 'bg-primary text-primary-foreground' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name} {cat._count && `(${cat._count.products})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="price-asc">Precio: Menor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor</SelectItem>
              <SelectItem value="name">Nombre</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No se encontraron productos</p>
          <Button variant="link" onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
          }}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          gridCols === 3 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-muted">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
                    <span className="text-4xl font-bold text-primary/30">DS</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" /> Destacado
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="text-xs bg-green-500 hover:bg-green-600">Nuevo</Badge>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setProductId(product.id)
                      setView('product')
                    }}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
                <h3 className="font-semibold truncate mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      En stock ({product.stock})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Agotado
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
