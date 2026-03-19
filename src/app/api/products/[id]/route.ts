import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({ where: { id }, include: { category: true } })
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { requireAdmin } = await import('@/lib/auth-helpers')
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const data = await request.json()
    const product = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        image: data.image,
        categoryId: data.categoryId,
        featured: data.featured,
        isNew: data.isNew,
        specs: data.specs ? JSON.stringify(data.specs) : null
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { requireAdmin } = await import('@/lib/auth-helpers')
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
