import type { NextConfig } from 'next'

const WORDPRESS_ORIGIN =
  process.env.WORDPRESS_ORIGIN || 'https://kisiselgelisimforum.com'

const WORDPRESS_HOST = new URL(WORDPRESS_ORIGIN).hostname

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: WORDPRESS_HOST,
      },
      {
        protocol: 'https',
        hostname: `**.${WORDPRESS_HOST}`,
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/wp-content/:path*',
        destination: `${WORDPRESS_ORIGIN}/wp-content/:path*`,
      },
      {
        source: '/wp-includes/:path*',
        destination: `${WORDPRESS_ORIGIN}/wp-includes/:path*`,
      },
    ]
  },
}

export default nextConfig