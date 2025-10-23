import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console logs in production
  },
  // Font optimization is handled automatically by Next.js 15+
  // Enable compression
  compress: true,
  // Add resource hints
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
