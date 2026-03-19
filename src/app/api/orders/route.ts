import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const orders = await db.order.findMany({
      where,
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, shippingName, shippingPhone, shippingAddr, notes } = body

    let subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shippingCost = subtotal > 500000 ? 0 : 15000
    const tax = subtotal * 0.19
    const total = subtotal + shippingCost + tax

    const order = await db.order.create({
      data: {
        userId, status: 'pending', total, shippingCost, tax, notes, shippingName, shippingPhone, shippingAddr,
        items: { create: items.map((item: any) => ({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity })) }
      },
      include: { items: true }
    })

    for (const item of items) {
      await db.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear pedido' }, { status: 500 })
  }
}
