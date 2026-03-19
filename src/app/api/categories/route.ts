import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { requireAdmin } = await import('@/lib/auth-helpers')
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description || null,
        image: data.image || null
      }
    })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }
}
