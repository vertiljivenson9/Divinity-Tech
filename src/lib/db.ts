/**
 * Simple in-memory database for demo
 * Replace with D1 bindings when deploying
 */

// Types
export interface User {
  id: string
  name: string | null
  email: string
  password: string
  role: string
  image: string | null
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  image: string
  categoryId: string
  featured: boolean
  isNew: boolean
  specs: string | null
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  status: string
  total: number
  shippingAddress: string | null
  createdAt: Date
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
}

// In-memory storage
let categories: Category[] = [
  { id: 'cat-1', name: 'Tarjetas de Video', slug: 'tarjetas-de-video', description: 'Tarjetas gráficas para gaming', image: null, createdAt: new Date() },
  { id: 'cat-2', name: 'Procesadores', slug: 'procesadores', description: 'CPUs de alto rendimiento', image: null, createdAt: new Date() },
  { id: 'cat-3', name: 'Memorias RAM', slug: 'memorias-ram', description: 'Memorias de alta velocidad', image: null, createdAt: new Date() },
  { id: 'cat-4', name: 'Almacenamiento', slug: 'almacenamiento', description: 'SSDs y discos duros', image: null, createdAt: new Date() },
]

let products: Product[] = [
  { id: 'prod-1', name: 'NVIDIA RTX 4060 Ti 8GB', slug: 'nvidia-rtx-4060-ti', description: 'Tarjeta gráfica de alto rendimiento', price: 2800000, stock: 15, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', categoryId: 'cat-1', featured: true, isNew: true, specs: '{"memoria":"8GB GDDR6"}', createdAt: new Date() },
  { id: 'prod-2', name: 'NVIDIA RTX 4070 Ti Super', slug: 'nvidia-rtx-4070-ti', description: 'Potencia extrema 16GB', price: 4200000, stock: 8, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', categoryId: 'cat-1', featured: true, isNew: false, specs: '{"memoria":"16GB GDDR6X"}', createdAt: new Date() },
  { id: 'prod-3', name: 'NVIDIA RTX 4080 Super 16GB', slug: 'nvidia-rtx-4080-super', description: 'La mejor experiencia gaming', price: 5800000, stock: 5, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', categoryId: 'cat-1', featured: true, isNew: true, specs: '{"memoria":"16GB GDDR6X"}', createdAt: new Date() },
  { id: 'prod-4', name: 'AMD Ryzen 7 7800X3D', slug: 'amd-ryzen-7-7800x3d', description: 'El mejor procesador para gaming', price: 1950000, stock: 20, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', categoryId: 'cat-2', featured: true, isNew: false, specs: '{"nucleos":"8","hilos":"16"}', createdAt: new Date() },
  { id: 'prod-5', name: 'AMD Ryzen 9 7950X3D', slug: 'amd-ryzen-9-7950x3d', description: 'Máximo rendimiento 16 núcleos', price: 3200000, stock: 10, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', categoryId: 'cat-2', featured: true, isNew: true, specs: '{"nucleos":"16","hilos":"32"}', createdAt: new Date() },
  { id: 'prod-6', name: 'Intel Core i9-14900K', slug: 'intel-core-i9-14900k', description: 'El procesador más potente de Intel', price: 3500000, stock: 7, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', categoryId: 'cat-2', featured: true, isNew: false, specs: '{"nucleos":"24","hilos":"32"}', createdAt: new Date() },
  { id: 'prod-7', name: 'Corsair Vengeance DDR5 32GB', slug: 'corsair-vengeance-ddr5-32gb', description: 'Kit de 2x16GB DDR5', price: 680000, stock: 25, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400', categoryId: 'cat-3', featured: true, isNew: false, specs: '{"capacidad":"32GB","velocidad":"6000 MHz"}', createdAt: new Date() },
  { id: 'prod-8', name: 'G.Skill Trident Z5 RGB DDR5 64GB', slug: 'gskill-trident-z5-64gb', description: 'Memoria premium RGB', price: 1450000, stock: 8, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400', categoryId: 'cat-3', featured: true, isNew: true, specs: '{"capacidad":"64GB","velocidad":"6400 MHz"}', createdAt: new Date() },
  { id: 'prod-9', name: 'Samsung 980 Pro 1TB', slug: 'samsung-980-pro-1tb', description: 'SSD NVMe PCIe 4.0', price: 580000, stock: 30, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', categoryId: 'cat-4', featured: true, isNew: false, specs: '{"capacidad":"1TB","lectura":"7000 MB/s"}', createdAt: new Date() },
  { id: 'prod-10', name: 'Samsung 990 Pro 2TB', slug: 'samsung-990-pro-2tb', description: 'El SSD más rápido', price: 1150000, stock: 15, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', categoryId: 'cat-4', featured: true, isNew: true, specs: '{"capacidad":"2TB","lectura":"7450 MB/s"}', createdAt: new Date() },
]

let users: User[] = [
  { id: 'user-1', name: 'Admin', email: 'admin@divinityskytools.com', password: 'admin123', role: 'admin', image: null, createdAt: new Date() },
  { id: 'user-2', name: 'Usuario', email: 'user@divinityskytools.com', password: 'user123', role: 'user', image: null, createdAt: new Date() },
]

let orders: Order[] = []
let cartItems: CartItem[] = []
let orderItems: OrderItem[] = []

// Database operations
export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) return users.find(u => u.email === where.email) || null
      if (where.id) return users.find(u => u.id === where.id) || null
      return null
    },
    findMany: async () => users.map(u => ({ ...u, password: undefined })),
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt'> }) => {
      const user = { ...data, id: `user-${Date.now()}`, createdAt: new Date() } as User
      users.push(user)
      return user
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }) => {
      const idx = users.findIndex(u => u.id === where.id)
      if (idx === -1) return null
      users[idx] = { ...users[idx], ...data }
      return users[idx]
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const idx = users.findIndex(u => u.id === where.id)
      if (idx !== -1) users.splice(idx, 1)
    },
    count: async () => users.length,
  },

  product: {
    findMany: async ({ where, include, take, orderBy }: any = {}) => {
      let result = [...products]
      if (where?.categoryId) result = result.filter(p => p.categoryId === where.categoryId)
      if (where?.featured) result = result.filter(p => p.featured)
      if (where?.stock?.lt !== undefined) result = result.filter(p => p.stock < where.stock.lt)
      if (take) result = result.slice(0, take)
      if (include?.category) {
        result = result.map(p => ({ ...p, category: categories.find(c => c.id === p.categoryId) }))
      }
      return result
    },
    findUnique: async ({ where, include }: { where: { id?: string; slug?: string }; include?: { category?: boolean } }) => {
      let product = where.id
        ? products.find(p => p.id === where.id)
        : where.slug
        ? products.find(p => p.slug === where.slug)
        : null
      if (!product) return null
      if (include?.category) {
        return { ...product, category: categories.find(c => c.id === product!.categoryId) }
      }
      return product
    },
    create: async ({ data }: { data: Omit<Product, 'id' | 'createdAt'> }) => {
      const product = { ...data, id: `prod-${Date.now()}`, createdAt: new Date() } as Product
      products.push(product)
      return product
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<Product> }) => {
      const idx = products.findIndex(p => p.id === where.id)
      if (idx === -1) return null
      products[idx] = { ...products[idx], ...data }
      return products[idx]
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const idx = products.findIndex(p => p.id === where.id)
      if (idx !== -1) products.splice(idx, 1)
    },
    count: async () => products.length,
  },

  category: {
    findMany: async () => categories,
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      if (where.id) return categories.find(c => c.id === where.id) || null
      if (where.slug) return categories.find(c => c.slug === where.slug) || null
      return null
    },
    create: async ({ data }: { data: Omit<Category, 'id' | 'createdAt'> }) => {
      const category = { ...data, id: `cat-${Date.now()}`, createdAt: new Date() } as Category
      categories.push(category)
      return category
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<Category> }) => {
      const idx = categories.findIndex(c => c.id === where.id)
      if (idx === -1) return null
      categories[idx] = { ...categories[idx], ...data }
      return categories[idx]
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const idx = categories.findIndex(c => c.id === where.id)
      if (idx !== -1) categories.splice(idx, 1)
    },
    count: async () => categories.length,
  },

  order: {
    findMany: async ({ include, take, orderBy }: any = {}) => {
      let result = [...orders]
      if (orderBy?.createdAt === 'desc') result.reverse()
      if (take) result = result.slice(0, take)
      if (include?.user) {
        result = result.map(o => ({ ...o, user: users.find(u => u.id === o.userId) }))
      }
      if (include?.items) {
        result = result.map(o => ({ ...o, items: orderItems.filter(oi => oi.orderId === o.id) }))
      }
      return result
    },
    findUnique: async ({ where, include }: { where: { id: string }; include?: any }) => {
      let order = orders.find(o => o.id === where.id)
      if (!order) return null
      if (include?.items) {
        order = { ...order, items: orderItems.filter(oi => oi.orderId === order!.id) }
      }
      return order
    },
    create: async ({ data }: { data: any }) => {
      const order = {
        id: `order-${Date.now()}`,
        userId: data.userId,
        status: data.status || 'pending',
        total: data.total,
        shippingAddress: data.shippingAddress || null,
        createdAt: new Date(),
        items: []
      } as Order
      orders.push(order)
      if (data.items?.create) {
        for (const item of data.items.create) {
          orderItems.push({
            id: `item-${Date.now()}-${Math.random()}`,
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })
        }
      }
      return order
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<Order> }) => {
      const idx = orders.findIndex(o => o.id === where.id)
      if (idx === -1) return null
      orders[idx] = { ...orders[idx], ...data }
      return orders[idx]
    },
    count: async () => orders.length,
    aggregate: async ({ _sum }: { _sum: { total: boolean } }) => {
      if (_sum?.total) {
        return { _sum: { total: orders.reduce((sum, o) => sum + o.total, 0) } }
      }
      return { _sum: {} }
    },
  },

  cartItem: {
    findMany: async ({ where }: { where?: { userId: string } } = {}) => {
      let result = [...cartItems]
      if (where?.userId) result = result.filter(c => c.userId === where.userId)
      return result
    },
    create: async ({ data }: { data: Omit<CartItem, 'id'> }) => {
      const item = { ...data, id: `cart-${Date.now()}` } as CartItem
      cartItems.push(item)
      return item
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const idx = cartItems.findIndex(c => c.id === where.id)
      if (idx !== -1) cartItems.splice(idx, 1)
    },
    deleteMany: async ({ where }: { where: { userId: string } }) => {
      cartItems = cartItems.filter(c => c.userId !== where.userId)
    },
  },

  $disconnect: async () => {},
}
