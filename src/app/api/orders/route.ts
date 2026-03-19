import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requireAdmin } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const session = await requireAuth(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const orders = session.role === 'ADMIN'
      ? await db.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } })
      : await db.order.findMany({ where: { userId: session.id }, include: { items: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const order = await db.order.create({
      data: {
        userId: session.id,
        status: 'pending',
        total: data.total,
        shippingAddress: data.shippingAddress,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear orden' }, { status: 500 })
  }
}
