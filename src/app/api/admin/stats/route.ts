import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [totalProducts, totalCategories, totalOrders, totalUsers, recentOrders, topProducts, lowStockProducts, revenue] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.order.count(),
      db.user.count(),
      db.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true, items: true } }),
      db.product.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { category: true } }),
      db.product.findMany({ where: { stock: { lt: 5 } }, include: { category: true } }),
      db.order.aggregate({ _sum: { total: true } })
    ])
    return NextResponse.json({ totalProducts, totalCategories, totalOrders, totalUsers, recentOrders, topProducts, lowStockProducts, totalRevenue: revenue._sum.total || 0 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
