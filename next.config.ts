import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/word-select-game' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/word-select-game/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
