import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [productsCount, categoriesCount, ordersCount, usersCount, totalRevenue] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({
        _sum: { total: true },
        where: { status: 'completed' },
      }),
    ])

    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json({
      productsCount,
      categoriesCount,
      ordersCount,
      usersCount,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
