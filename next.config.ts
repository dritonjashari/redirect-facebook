import type { NextConfig } from "next";

const WORDPRESS_ORIGIN = process.env.WORDPRESS_ORIGIN

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'kisiselgelisimforum.com' },
      { protocol: 'https', hostname: '**.kisiselgelisimforum.com' },
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
    ];
  },
};

export default nextConfig;
