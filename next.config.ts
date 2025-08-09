import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Using default SSR/ISR settings so API routes work on Vercel
  // Remove static export to enable /api routes
  images: {
    unoptimized: true, // keep as-is; can be toggled later if needed
  },
};

export default nextConfig;
