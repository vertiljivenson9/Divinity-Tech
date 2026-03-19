import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'divinity-sky-tools-secret-key-2024'

function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function createToken(payload: any): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = { ...payload, iat: now, exp: now + 7 * 24 * 60 * 60 }

  const encodedHeader = base64urlEncode(JSON.stringify(header))
  const encodedPayload = base64urlEncode(JSON.stringify(tokenPayload))
  const dataToSign = `${encodedHeader}.${encodedPayload}`

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign))
  const encodedSignature = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)))

  return `${dataToSign}.${encodedSignature}`
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = await createToken({
      id: user.id, email: user.email, name: user.name, role: user.role, image: user.image
    })

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image }
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
