import { create } from 'zustand'

export type View = 
  | 'home' 
  | 'catalog' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'orders'
  | 'login'
  | 'register'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-product-edit'
  | 'admin-categories'
  | 'admin-orders'

interface AppState {
  view: View
  productId: string | null
  searchQuery: string
  cartOpen: boolean
  setView: (view: View) => void
  setProductId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setCartOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'home',
  productId: null,
  searchQuery: '',
  cartOpen: false,
  setView: (view) => set({ view, productId: null }),
  setProductId: (id) => set({ productId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCartOpen: (open) => set({ cartOpen: open })
}))
