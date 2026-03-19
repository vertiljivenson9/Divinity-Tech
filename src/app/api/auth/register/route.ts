import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        role: 'user',
      },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}
