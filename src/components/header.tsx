'use client'

import { ShoppingCart, LayoutDashboard, Package, User, LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { useCartStore } from '@/store/cart'
import { ThemeToggle } from './theme-toggle'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/context/session-context'
import { toast } from 'sonner'

export function Header() {
  const { view, setView, setCartOpen } = useAppStore()
  const { items } = useCartStore()
  const { user, status, signOut } = useSession()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = async () => {
    await signOut()
    setView('home')
    toast.success('Sesión cerrada')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold">
            DS
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg">DIVINITY</span>
            <span className="font-bold text-lg text-primary"> SKY TOOLS</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant={view === 'home' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('home')}>
            Inicio
          </Button>
          <Button variant={view === 'catalog' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('catalog')}>
            <Package className="h-4 w-4 mr-1" />
            Catálogo
          </Button>
          {status === 'authenticated' && user?.role !== 'admin' && (
            <Button variant={view === 'orders' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('orders')}>
              Mis Pedidos
            </Button>
          )}
          {user?.role === 'admin' && (
            <Button variant={view.startsWith('admin') ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('admin-dashboard')}>
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Admin
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === 'authenticated' ? (
            <>
              {user?.role !== 'admin' && (
                <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              )}
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{user?.name || user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setView('login')}>
              <LogIn className="h-4 w-4 mr-1" />
              Ingresar
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
