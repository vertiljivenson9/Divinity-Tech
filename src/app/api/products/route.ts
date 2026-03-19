import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const available = searchParams.get('available')
    const sort = searchParams.get('sort')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (category && category !== 'all') where.category = { slug: category }
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
    if (featured === 'true') where.featured = true
    if (available === 'true') where.stock = { gt: 0 }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'name') orderBy = { name: 'asc' }

    const products = await db.product.findMany({
      where, include: { category: true }, orderBy,
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, stock, image, images, specs, featured, isNew, categoryId } = body
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const product = await db.product.create({
      data: { name, slug, description, price: parseFloat(price), stock: parseInt(stock), image, images, specs, featured: featured || false, isNew: isNew || false, categoryId },
      include: { category: true }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creando producto:', error)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
