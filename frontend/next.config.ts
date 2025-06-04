import type { NextConfig } from "next";

// Configuration for ngrok domains
const nextConfig: NextConfig = {
  // Configure CORS headers for development and production
  async headers() {
    const allowedOrigins = [
      "https://8ab7-197-248-44-59.ngrok-free.app", //frontend link
      "https://1d4d-197-248-44-59.ngrok-free.app", //backend link
      "https://cbc5-197-248-44-59.ngrok-free.app", //new backend link
      "http://localhost:3000",
      "http://localhost:3001",
      "https://sbckenya.com",
    ];

    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/(.*).(jpg|jpeg|png|webp|gif|ico|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1d4d-197-248-44-59.ngrok-free.app", //old backend link
      },
      {
        protocol: "https",
        hostname: "cbc5-197-248-44-59.ngrok-free.app", //new backend link
      },
      {
        protocol: "https",
        hostname: "sbckenya.com",
	
      },
      {
        protocol: "https",
        hostname: "sbckenya.com", //frontend link
        port: "",
        pathname: "/media/images/**",
      },
    ],
    unoptimized: false,
    domains: [
      "sbckenya.com", //backend link
      "sbckenya.com", //frontend link
      "localhost",
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};
export default nextConfig;
