import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requireAdmin } from '@/lib/auth-helpers'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const order = await db.order.findUnique({ where: { id }, include: { items: true } })
    if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

    if (session.role !== 'ADMIN' && order.userId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener orden' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const data = await request.json()
    const order = await db.order.update({
      where: { id },
      data: { status: data.status }
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar orden' }, { status: 500 })
  }
}
