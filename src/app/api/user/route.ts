import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ user: null })
    const user = await db.user.findUnique({ where: { id: session.user.id }, select: { id: true, email: true, name: true, role: true, image: true, phone: true, address: true, createdAt: true } })
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
