import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Suppress dynamic API warnings for NextAuth compatibility
    cacheComponents: false,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    // Allow production builds to successfully complete even if ESLint errors are found
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to successfully complete even if TypeScript errors are found
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
