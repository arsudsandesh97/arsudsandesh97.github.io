/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.vectorlogo.zone',
      },
      {
        protocol: 'https',
        hostname: '**.raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.hashnode.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.encrypted-tbn.gstatic.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: [
      '@mui/material', 
      '@mui/icons-material',
      'framer-motion',
      'react-icons',
    ],
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // GitHub Pages configuration - only apply in production
  ...(isProd && {
    basePath: '/webtest',
    assetPrefix: '/webtest/',
  }),
  trailingSlash: true,
}

module.exports = nextConfig
