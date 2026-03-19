import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } })
    if (!category) return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categoría' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, image } = body
    const slug = name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined
    const category = await db.category.update({ where: { id }, data: { name, slug, description, image } })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const productsCount = await db.product.count({ where: { categoryId: id } })
    if (productsCount > 0) return NextResponse.json({ error: 'No se puede eliminar una categoría con productos' }, { status: 400 })
    await db.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 })
  }
}
