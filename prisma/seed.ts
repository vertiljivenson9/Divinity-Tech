import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await db.user.upsert({
    where: { email: 'admin@divinityskytools.com' },
    update: {},
    create: {
      email: 'admin@divinityskytools.com',
      name: 'Admin',
      password: adminPassword,
      role: 'admin',
    },
  })

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await db.user.upsert({
    where: { email: 'user@divinityskytools.com' },
    update: {},
    create: {
      email: 'user@divinityskytools.com',
      name: 'Usuario Demo',
      password: userPassword,
      role: 'user',
    },
  })

  // Create categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { name: 'Smartphones' },
      update: {},
      create: {
        name: 'Smartphones',
        description: 'Teléfonos inteligentes de última generación',
      },
    }),
    db.category.upsert({
      where: { name: 'Laptops' },
      update: {},
      create: {
        name: 'Laptops',
        description: 'Portátiles para trabajo y gaming',
      },
    }),
    db.category.upsert({
      where: { name: 'Accesorios' },
      update: {},
      create: {
        name: 'Accesorios',
        description: 'Accesorios y periféricos',
      },
    }),
    db.category.upsert({
      where: { name: 'Audio' },
      update: {},
      create: {
        name: 'Audio',
        description: 'Auriculares, bocinas y equipos de audio',
      },
    }),
  ])

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      description: 'El smartphone más avanzado de Apple con chip A17 Pro y cámara de 48MP',
      price: 1199.99,
      stock: 25,
      categoryId: categories[0].id,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'El flagship de Samsung con S Pen integrado y zoom 100x',
      price: 1299.99,
      stock: 30,
      categoryId: categories[0].id,
    },
    {
      name: 'MacBook Pro 16" M3 Max',
      description: 'La laptop más potente de Apple con chip M3 Max y 36GB RAM',
      price: 3499.99,
      stock: 10,
      categoryId: categories[1].id,
    },
    {
      name: 'Dell XPS 15',
      description: 'Laptop premium con pantalla OLED y procesador Intel Core i9',
      price: 1899.99,
      stock: 15,
      categoryId: categories[1].id,
    },
    {
      name: 'AirPods Pro 2',
      description: 'Auriculares inalámbricos con cancelación activa de ruido',
      price: 249.99,
      stock: 50,
      categoryId: categories[2].id,
    },
    {
      name: 'Magic Keyboard',
      description: 'Teclado inalámbrico con Touch ID y diseño compacto',
      price: 199.99,
      stock: 40,
      categoryId: categories[2].id,
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Auriculares premium con la mejor cancelación de ruido del mercado',
      price: 399.99,
      stock: 35,
      categoryId: categories[3].id,
    },
    {
      name: 'Sonos One',
      description: 'Bocina inteligente con Alexa y sonido Hi-Fi',
      price: 219.99,
      stock: 20,
      categoryId: categories[3].id,
    },
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { name: product.name },
      update: { price: product.price, stock: product.stock },
      create: product,
    })
  }

  console.log('Seed completed successfully!')
  console.log('Admin:', admin.email)
  console.log('User:', user.email)
  console.log('Categories:', categories.length)
  console.log('Products created:', products.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
