'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star, Minus, Plus, ArrowLeft, Check, Truck, Shield, RotateCcw } from 'lucide-react'
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
  images?: string | null
  specs?: string | null
  featured: boolean
  isNew: boolean
  category: { id: string; name: string; slug: string }
}

interface ProductDetailViewProps {
  productId: string
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { setView } = useAppStore()
  const { addItem, items, updateQuantity } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const cartItem = items.find(i => i.productId === productId)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`)
        if (res.ok) {
          setProduct(await res.json())
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    })
    toast.success('Producto agregado al carrito')
  }

  const handleUpdateCart = (newQty: number) => {
    if (!product || newQty < 1 || newQty > product.stock) return
    updateQuantity(productId, newQty)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Producto no encontrado</p>
        <Button className="mt-4" onClick={() => setView('catalog')}>
          Volver al catálogo
        </Button>
      </div>
    )
  }

  const specs = product.specs ? JSON.parse(product.specs) : null

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => setView('catalog')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al catálogo
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-6xl font-bold text-primary/30">DS</span>
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" /> Destacado
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600">Nuevo</Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category.name}</p>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          <div>
            <span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
            <p className="text-sm text-muted-foreground mt-1">
              Precio incluye IVA
            </p>
          </div>

          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Badge variant="outline" className="text-green-600 border-green-600 text-sm py-1">
                  <Check className="h-4 w-4 mr-1" />
                  En stock ({product.stock} disponibles)
                </Badge>
              </>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Agotado
              </Badge>
            )}
          </div>

          {/* Add to Cart Section */}
          {product.stock > 0 && (
            <div className="space-y-4">
              {!cartItem ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Agregar al Carrito
                  </Button>
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium">En tu carrito: {cartItem.quantity} unidad(es)</p>
                  <div className="flex items-center border rounded-lg bg-background w-fit">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdateCart(cartItem.quantity - 1)}
                      disabled={cartItem.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{cartItem.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdateCart(cartItem.quantity + 1)}
                      disabled={cartItem.quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted">
              <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium">Envío Gratis</p>
              <p className="text-xs text-muted-foreground">+$500.000</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium">Garantía</p>
              <p className="text-xs text-muted-foreground">12 meses</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium">Devolución</p>
              <p className="text-xs text-muted-foreground">30 días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {specs && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Especificaciones</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground capitalize">{key}</p>
                  <p className="font-medium">{String(value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
