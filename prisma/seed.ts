import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Iniciando seed...')

  console.log('🧹 Limpiando datos existentes...')
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.cartItem.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany()

  const categories = await Promise.all([
    db.category.create({ data: { name: 'Tarjetas de Video', slug: 'tarjetas-de-video', description: 'Tarjetas gráficas para gaming y trabajo profesional' } }),
    db.category.create({ data: { name: 'Procesadores', slug: 'procesadores', description: 'CPUs de alto rendimiento' } }),
    db.category.create({ data: { name: 'Memorias RAM', slug: 'memorias-ram', description: 'Memorias de alta velocidad' } }),
    db.category.create({ data: { name: 'Almacenamiento', slug: 'almacenamiento', description: 'SSDs y discos duros' } })
  ])

  console.log(`✅ Creadas ${categories.length} categorías`)

  const products = [
    { name: 'NVIDIA RTX 4060 Ti 8GB GDDR6', description: 'Tarjeta gráfica de alto rendimiento con 8GB GDDR6, ray tracing y DLSS 3.', price: 2800000, stock: 15, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', featured: true, isNew: true, categoryId: categories[0].id, specs: JSON.stringify({ memoria: '8GB GDDR6', reloj: '2535 MHz', consumo: '160W' }) },
    { name: 'NVIDIA RTX 4070 Ti Super 16GB', description: 'Potencia extrema con 16GB de memoria GDDR6X para gaming 4K.', price: 4200000, stock: 8, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', featured: true, isNew: false, categoryId: categories[0].id, specs: JSON.stringify({ memoria: '16GB GDDR6X', reloj: '2610 MHz', consumo: '285W' }) },
    { name: 'NVIDIA RTX 4080 Super 16GB', description: 'La mejor experiencia gaming con ray tracing en tiempo real.', price: 5800000, stock: 5, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', featured: true, isNew: true, categoryId: categories[0].id, specs: JSON.stringify({ memoria: '16GB GDDR6X', reloj: '2550 MHz', consumo: '320W' }) },
    { name: 'AMD Radeon RX 7800 XT 16GB', description: 'Excelente rendimiento precio-valor con 16GB de memoria.', price: 3200000, stock: 12, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', featured: false, isNew: false, categoryId: categories[0].id, specs: JSON.stringify({ memoria: '16GB GDDR6', reloj: '2430 MHz', consumo: '263W' }) },
    { name: 'AMD Ryzen 7 7800X3D', description: 'El mejor procesador para gaming con tecnología 3D V-Cache.', price: 1950000, stock: 20, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', featured: true, isNew: false, categoryId: categories[1].id, specs: JSON.stringify({ nucleos: '8', hilos: '16', reloj: '5.0 GHz', tdp: '120W' }) },
    { name: 'AMD Ryzen 9 7950X3D', description: 'Máximo rendimiento gaming y productividad con 16 núcleos.', price: 3200000, stock: 10, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', featured: true, isNew: true, categoryId: categories[1].id, specs: JSON.stringify({ nucleos: '16', hilos: '32', reloj: '5.7 GHz', tdp: '120W' }) },
    { name: 'Intel Core i7-14700K', description: 'Procesador de 14ª generación con 20 núcleos.', price: 2450000, stock: 15, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', featured: false, isNew: true, categoryId: categories[1].id, specs: JSON.stringify({ nucleos: '20', hilos: '28', reloj: '5.6 GHz', tdp: '125W' }) },
    { name: 'Intel Core i9-14900K', description: 'El procesador más potente de Intel con 24 núcleos.', price: 3500000, stock: 7, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', featured: true, isNew: false, categoryId: categories[1].id, specs: JSON.stringify({ nucleos: '24', hilos: '32', reloj: '6.0 GHz', tdp: '125W' }) },
    { name: 'Corsair Vengeance DDR5 32GB 6000MHz', description: 'Kit de 2x16GB DDR5 de alta velocidad.', price: 680000, stock: 25, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400', featured: true, isNew: false, categoryId: categories[2].id, specs: JSON.stringify({ capacidad: '32GB', velocidad: '6000 MHz', tipo: 'DDR5' }) },
    { name: 'G.Skill Trident Z5 RGB DDR5 64GB 6400MHz', description: 'Memoria premium con iluminación RGB.', price: 1450000, stock: 8, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400', featured: true, isNew: true, categoryId: categories[2].id, specs: JSON.stringify({ capacidad: '64GB', velocidad: '6400 MHz', tipo: 'DDR5' }) },
    { name: 'Kingston Fury Beast DDR5 16GB 5600MHz', description: 'Memoria confiable y de alto rendimiento.', price: 320000, stock: 35, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400', featured: false, isNew: false, categoryId: categories[2].id, specs: JSON.stringify({ capacidad: '16GB', velocidad: '5600 MHz', tipo: 'DDR5' }) },
    { name: 'Samsung 980 Pro 1TB NVMe SSD', description: 'SSD NVMe PCIe 4.0 de alta velocidad con hasta 7000MB/s.', price: 580000, stock: 30, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', featured: true, isNew: false, categoryId: categories[3].id, specs: JSON.stringify({ capacidad: '1TB', lectura: '7000 MB/s', interfaz: 'PCIe 4.0' }) },
    { name: 'Samsung 990 Pro 2TB NVMe SSD', description: 'El SSD más rápido de Samsung para profesionales.', price: 1150000, stock: 15, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', featured: true, isNew: true, categoryId: categories[3].id, specs: JSON.stringify({ capacidad: '2TB', lectura: '7450 MB/s', interfaz: 'PCIe 4.0' }) },
    { name: 'WD Black SN850X 1TB NVMe SSD', description: 'SSD gaming con modo Game Mode 2.0.', price: 520000, stock: 20, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', featured: false, isNew: false, categoryId: categories[3].id, specs: JSON.stringify({ capacidad: '1TB', lectura: '7300 MB/s', interfaz: 'PCIe 4.0' }) },
    { name: 'Seagate Barracuda 4TB HDD', description: 'Disco duro de gran capacidad para almacenamiento masivo.', price: 380000, stock: 18, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', featured: false, isNew: false, categoryId: categories[3].id, specs: JSON.stringify({ capacidad: '4TB', rpm: '5400', interfaz: 'SATA' }) }
  ]

  for (const product of products) {
    const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await db.product.create({ data: { ...product, slug } })
  }

  console.log(`✅ Creados ${products.length} productos`)

  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await db.user.create({ data: { name: 'Administrador', email: 'admin@divinityskytools.com', password: hashedPassword, role: 'admin' } })
  console.log(`✅ Usuario admin creado: ${admin.email}`)

  const userPassword = await bcrypt.hash('user123', 10)
  const user = await db.user.create({ data: { name: 'Usuario Demo', email: 'user@divinityskytools.com', password: userPassword, role: 'user' } })
  console.log(`✅ Usuario de prueba creado: ${user.email}`)

  console.log('🎉 Seed completado!')
  console.log('\n📋 Credenciales de acceso:')
  console.log('   Admin: admin@divinityskytools.com / admin123')
  console.log('   Usuario: user@divinityskytools.com / user123')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await db.$disconnect() })
