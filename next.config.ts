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
  // Experimental features necesarias para Cloudflare
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
}

export default nextConfig
