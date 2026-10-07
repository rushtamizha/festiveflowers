import { IMAGE_VERSION } from './src/config/image-version.mjs';
import { IMAGE_HOSTS } from './src/config/image-hosts.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Only our own versioned files (/public/images and the logo) may be optimised (see src/config/image-version.mjs).
    localPatterns: [
      { pathname: '/images/**', search: `?v=${IMAGE_VERSION}` },
      { pathname: '/logo.png', search: `?v=${IMAGE_VERSION}` },
    ],
    // Photos hosted on other websites (src/config/image-hosts.mjs).
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({ protocol: 'https', hostname })),
    qualities: [75],
    deviceSizes: [420, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 200, 320],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    optimizePackageImports: ['motion', 'swiper'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;
