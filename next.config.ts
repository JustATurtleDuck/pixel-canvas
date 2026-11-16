import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: 'export',
  basePath: '/pixel-canvas',
  assetPrefix: '/pixel-canvas/',
  images: {
    unoptimized: true,
  },

  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
