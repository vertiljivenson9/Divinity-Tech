import type { CloudflareEnv } from '../env.d.ts'

declare global {
  interface CloudflareEnv {
    DB: D1Database
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
  }
}

// Adapter para usar D1 con Prisma en Cloudflare
// En desarrollo local usa SQLite, en producción usa D1

export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  return 'file:./dev.db'
}

// Para Cloudflare Pages, necesitamos usar el adaptador D1
export async function getPrismaClient(env?: CloudflareEnv) {
  if (env?.DB) {
    // Cloudflare D1
    const { PrismaClient } = await import('@prisma/client')
    const { PrismaD1 } = await import('@prisma/adapter-d1')
    
    const adapter = new PrismaD1(env.DB)
    return new PrismaClient({ adapter })
  }
  
  // Local development with SQLite
  const { PrismaClient } = await import('@prisma/client')
  return new PrismaClient()
}
