import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuración para Cloudflare Pages
  typescript: { 
    ignoreBuildErrors: true 
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  // Server external packages (moved from experimental in Next.js 15)
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
}

export default nextConfig
