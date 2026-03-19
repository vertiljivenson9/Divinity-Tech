import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const session = await requireAuth(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: session.id } })
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image
  })
}

export async function PUT(request: NextRequest) {
  const session = await requireAuth(request)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const user = await db.user.update({
      where: { id: session.id },
      data: { name: data.name, image: data.image }
    })
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}
