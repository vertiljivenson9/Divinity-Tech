import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const where: any = {}
    if (userId) where.userId = userId

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const order = await db.order.create({
      data: {
        userId: data.userId || null,
        total: data.total,
        status: 'pending',
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Error al crear orden' }, { status: 500 })
  }
}
