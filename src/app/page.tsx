'use client'

import { useCallback } from 'react'
import { useSession } from '@/context/session-context'
import { Header } from '@/components/header'
import { HomeView } from '@/components/views/home-view'
import { CatalogView } from '@/components/views/catalog-view'
import { ProductDetailView } from '@/components/views/product-detail-view'
import { CartSidebar } from '@/components/cart-sidebar'
import { CheckoutView } from '@/components/views/checkout-view'
import { OrdersView } from '@/components/views/orders-view'
import { LoginView } from '@/components/views/login-view'
import { RegisterView } from '@/components/views/register-view'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminProducts } from '@/components/admin/admin-products'
import { AdminCategories } from '@/components/admin/admin-categories'
import { AdminOrders } from '@/components/admin/admin-orders'
import { useAppStore } from '@/store'

export default function Page() {
  const { user, status } = useSession()
  const { view, productId, cartOpen, setCartOpen } = useAppStore()

  const renderView = useCallback(() => {
    switch (view) {
      case 'home':
        return <HomeView />
      case 'catalog':
        return <CatalogView />
      case 'product':
        return productId ? <ProductDetailView productId={productId} /> : <CatalogView />
      case 'checkout':
        return status === 'authenticated' ? <CheckoutView /> : <LoginView />
      case 'orders':
        return status === 'authenticated' ? <OrdersView /> : <LoginView />
      case 'login':
        return <LoginView />
      case 'register':
        return <RegisterView />
      case 'admin-dashboard':
        return user?.role === 'admin' ? <AdminDashboard /> : <HomeView />
      case 'admin-products':
        return user?.role === 'admin' ? <AdminProducts /> : <HomeView />
      case 'admin-categories':
        return user?.role === 'admin' ? <AdminCategories /> : <HomeView />
      case 'admin-orders':
        return user?.role === 'admin' ? <AdminOrders /> : <HomeView />
      default:
        return <HomeView />
    }
  }, [view, productId, user?.role, status])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-6">
        {renderView()}
      </main>
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
