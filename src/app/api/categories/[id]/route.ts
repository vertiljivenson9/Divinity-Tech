import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({ where: { id } })
    if (!category) return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categoría' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { requireAdmin } = await import('@/lib/auth-helpers')
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const data = await request.json()
    const category = await db.category.update({
      where: { id },
      data: { name: data.name, slug: data.slug, description: data.description, image: data.image }
    })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { requireAdmin } = await import('@/lib/auth-helpers')
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await db.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 })
  }
}
