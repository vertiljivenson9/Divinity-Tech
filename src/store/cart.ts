import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string | null
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.productId === item.productId)
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + 1, item.stock)
          set({
            items: items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: newQuantity } : i
            )
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items
        const item = items.find((i) => i.productId === productId)
        if (!item) return
        const newQuantity = Math.min(Math.max(quantity, 1), item.stock)
        set({
          items: items.map((i) =>
            i.productId === productId ? { ...i, quantity: newQuantity } : i
          )
        })
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0)
    }),
    { name: 'divinity-sky-tools-cart' }
  )
)
