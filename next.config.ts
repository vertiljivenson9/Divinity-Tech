import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Usar standalone para Cloudflare Pages con next-on-pages
  output: 'export',
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  // Necesario para Cloudflare
  experimental: {
    serverActions: {
      allowedOrigins: ['*.pages.dev', 'localhost:3000'],
    },
  },
}

export default nextConfig
