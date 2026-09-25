import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'next-auth.js.org',
      },
      {
        protocol: 'https',
        hostname: 'supabase.com',
      },
      {
        protocol: 'https',
        hostname: 'neon.tech',
      },
      {
        protocol: 'https',
        hostname: 'www.postman.com',
      },
      {
        protocol: 'https',
        hostname: 'vercel.com',
      },
      {
        protocol: 'https',
        hostname: 'render.com',
      },
      {
        protocol: 'https',
        hostname: 'www.hostinger.com',
      },
      {
        protocol: 'https',
        hostname: 'tanstack.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.svgcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'nodejs.org',
      },
      {
        protocol: 'https',
        hostname: 'seeklogo.com',
      },
      {
        protocol: 'https',
        hostname: 'community.appsmith.com',
      },
      {
        protocol: 'https',
        hostname: 'ajeetchaulagain.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl.replace(/\/api$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
