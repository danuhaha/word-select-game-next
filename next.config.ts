import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/word-select-game-next' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/word-select-game-next/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
