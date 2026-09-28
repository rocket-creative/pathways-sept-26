import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/how-it-works", destination: "/contact", permanent: true },
      { source: "/get-started", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
