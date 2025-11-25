const nextConfig = {
  webpack(config, { isServer }) {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
          openAnalyzer: true,
        })
      );
    }
    return config;
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Only use 'export' for production builds (GitHub Pages)
  // In dev, use default server rendering for dynamic routes
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
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
  // For User Pages (username.github.io), basePath should be empty
  ...(process.env.NODE_ENV === 'production' && {
    // basePath: '',
    // assetPrefix: '',
  }),
  trailingSlash: true,
}

module.exports = nextConfig
