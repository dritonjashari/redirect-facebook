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

}

export default nextConfig