import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // You can still add more config here, e.g., images, etc.
};

export default nextConfig;
