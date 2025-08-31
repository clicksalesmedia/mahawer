import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Suppress dynamic API warnings for NextAuth compatibility
    dynamicIO: false,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
