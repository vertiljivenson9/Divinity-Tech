import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await db.order.findUnique({ where: { id }, include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true, phone: true, address: true } } } })
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pedido' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body
    const order = await db.order.update({ where: { id }, data: { status } })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 })
  }
}
