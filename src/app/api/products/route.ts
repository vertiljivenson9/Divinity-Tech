import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        image: data.image,
        categoryId: data.categoryId || null,
        stock: parseInt(data.stock) || 0,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
