import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "places.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "egtxldpivpbneksknmne.supabase.co",
      },
    ],
  },
};

export default nextConfig;
