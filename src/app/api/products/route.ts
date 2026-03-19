import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const products = await db.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { requireAdmin } = await import('@/lib/auth-helpers')
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description || '',
        price: Number(data.price),
        stock: Number(data.stock) || 0,
        image: data.image || '',
        categoryId: data.categoryId,
        featured: data.featured || false,
        isNew: data.isNew || false,
        specs: data.specs ? JSON.stringify(data.specs) : null
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
