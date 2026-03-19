interface CloudflareEnv {
  DB: D1Database
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {
      DATABASE_URL: string
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

export { CloudflareEnv }
