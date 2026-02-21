import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://3.91.67.136:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
