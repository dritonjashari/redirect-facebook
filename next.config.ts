import type { NextConfig } from "next";

const WORDPRESS_ORIGIN: any = process.env.WORDPRESS_ORIGIN

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/wp-content/:path*",
        destination: `${WORDPRESS_ORIGIN}/wp-content/:path*`,
      },
      {
        source: "/wp-includes/:path*",
        destination: `${WORDPRESS_ORIGIN}/wp-includes/:path*`,
      },
      {
        source: "/wp-admin/images/:path*",
        destination: `${WORDPRESS_ORIGIN}/wp-admin/images/:path*`,
      },
    ];
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;