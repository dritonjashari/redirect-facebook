import type { NextConfig } from "next";

// Fallback to an empty string or a placeholder so the build doesn't crash if env is missing
const WORDPRESS_ORIGIN = process.env.WORDPRESS_ORIGIN || "";

const nextConfig: NextConfig = {
  async rewrites() {
    // If the origin isn't defined, return an empty array to prevent malformed URL errors
    if (!WORDPRESS_ORIGIN) {
      console.warn("⚠️ WORDPRESS_ORIGIN is not defined in your environment variables.");
      return [];
    }

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