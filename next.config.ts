import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,

  // T0 — HTML cache lifetime.
  // Pages export revalidate = 3600 (see app/layout.tsx). Next.js derives the HTML
  // Cache-Control header from revalidate + expireTime, giving:
  //   Cache-Control: s-maxage=3600, stale-while-revalidate=86400
  // (Next.js overrides any Cache-Control set in headers() for pages, so this is the
  // only reliable place to set it.) /_next/static/* stays immutable for one year.
  expireTime: 3600 + 86400,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  allowedDevOrigins: [
    "http://192.168.88.33:3000",
    "http://192.168.88.40:3000",
    "http://localhost:3000",
  ],

  images: {
    // ✅ Reduced to only required domains (fixes 50+ limit issue)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // uploads / dynamic assets
      },
    ],

    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 100],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
  },

  async redirects() {
    return [
      // T4 — wrong NLP slugs that were linked from /nlp-computer-vision
      {
        source: "/nlp-computer-vision/computer-vision-solutions",
        destination: "/nlp-computer-vision/computer-vision",
        permanent: true,
      },
      {
        source: "/nlp-computer-vision/natural-language-processing-nlp",
        destination: "/nlp-computer-vision/natural-language-processing",
        permanent: true,
      },
      {
        source: "/nlp-computer-vision/speech-recognition-systems",
        destination: "/nlp-computer-vision/speech-recognition",
        permanent: true,
      },
      // T9 — CTA image moved from PNG to WebP
      {
        source: "/images/ctaImage.png",
        destination: "/images/ctaImage.webp",
        permanent: true,
      },
      // T7 — thin hire page cannibalising the custom software development service page
      {
        source: "/hire/custom-software-development",
        destination: "/software-development/custom-software-development",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/software-solutions",
        permanent: true,
      },
      {
        source: "/services/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/locations/:location/services/:service",
        destination: "/locations/:location/:service",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/uploads/:path*",
          destination: "/api/uploads/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { 
            key: "Content-Security-Policy", 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://www.google-analytics.com https://www.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.googletagmanager.com https://www.clarity.ms https://www.google-analytics.com https://www.google.com;" 
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=120",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  typescript: {
    tsconfigPath: "./tsconfig.json",
  },

  poweredByHeader: false,
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withBundleAnalyzer(nextConfig);