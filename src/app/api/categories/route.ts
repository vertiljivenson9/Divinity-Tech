import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const category = await db.category.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
      },
    })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }
}
