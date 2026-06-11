import type { NextConfig } from "next";

const WEBSITE=process.env.WORDPRESS_ORIGIN;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/wp-content/:path*",
        destination: `${WEBSITE}/wp-content/:path*`,
      },
      {
        source: "/wp-includes/:path*",
        destination: `${WEBSITE}/wp-includes/:path*`,
      },
      {
        source: "/wp-admin/images/:path*",
        destination: `${WEBSITE}/wp-admin/images/:path*`,
      },
    ];
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;