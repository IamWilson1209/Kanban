import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 解決 img.clerk.com is not configured under images in next.config.ts
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ]
  }
};

export default nextConfig;
