'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Zap, Truck, Shield, ArrowRight } from 'lucide-react'
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
  category: { name: string; slug: string }
}

export function HomeView() {
  const { setView, setProductId } = useAppStore()
  const { addItem } = useCartStore()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=4'),
          fetch('/api/products?limit=8')
        ])
        const featured = await featuredRes.json()
        const newItems = await newRes.json()
        setFeaturedProducts(featured)
        setNewProducts(newItems.filter((p: Product) => p.isNew))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat opacity-10"></div>
        <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              DIVINITY <span className="text-secondary">SKY TOOLS</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Tu catálogo digital de productos tecnológicos. Las mejores marcas, los mejores precios.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" onClick={() => setView('catalog')}>
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Ofertas Especiales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, title: 'Envío Gratis', desc: 'Compras +$500.000' },
          { icon: Shield, title: 'Garantía', desc: 'Todos los productos' },
          { icon: Zap, title: 'Entrega Rápida', desc: '24-48 horas' },
          { icon: Star, title: 'Soporte', desc: 'Expertos en tech' }
        ].map((feature, i) => (
          <Card key={i} className="text-center p-4">
            <CardContent className="p-0 space-y-2">
              <feature.icon className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Productos Destacados</h2>
            <p className="text-muted-foreground">Lo mejor de nuestra selección</p>
          </div>
          <Button variant="ghost" onClick={() => setView('catalog')}>
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
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
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      En stock
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
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Nuevos Productos</h2>
              <p className="text-muted-foreground">Lo último en tecnología</p>
            </div>
            <Button variant="ghost" onClick={() => setView('catalog')}>
              Ver todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.slice(0, 4).map((product) => (
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
                  <Badge className="absolute top-2 left-2 text-xs bg-green-500 hover:bg-green-600">
                    Nuevo
                  </Badge>
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
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        En stock
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
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Necesitas ayuda con tu compra?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Nuestro equipo de expertos está listo para asesorarte en tu próxima compra de tecnología.
        </p>
        <Button size="lg">
          Contáctanos
        </Button>
      </section>
    </div>
  )
}
