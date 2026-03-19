import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    })
    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener orden' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const order = await db.order.update({
      where: { id },
      data: { status: data.status },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar orden' }, { status: 500 })
  }
}
