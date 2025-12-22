import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // For Docker optimization
  images: {
    qualities: [75, 85, 90, 95],
  },
};

export default nextConfig;
