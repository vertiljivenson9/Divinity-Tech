import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'divinity-sky-tools-secret-key-2024'

function base64urlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return atob(str)
}

async function verifyToken(token: string): Promise<any | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, encodedSignature] = parts
    const dataToSign = `${encodedHeader}.${encodedPayload}`

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )

    const signature = new Uint8Array(base64urlDecode(encodedSignature).split('').map(c => c.charCodeAt(0)))
    const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(dataToSign))

    if (!isValid) return null

    const payload = JSON.parse(base64urlDecode(encodedPayload))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || ''
  const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/)

  if (!tokenMatch) return NextResponse.json({ user: null })

  const payload = await verifyToken(tokenMatch[1])
  if (!payload) return NextResponse.json({ user: null })

  return NextResponse.json({
    user: { id: payload.id, email: payload.email, name: payload.name, role: payload.role, image: payload.image }
  })
}
