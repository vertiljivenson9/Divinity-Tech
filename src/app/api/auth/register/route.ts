import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: { name, email, password: hashedPassword, role: 'user' }
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}
