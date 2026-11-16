import type { NextConfig } from "next";

// Check if running in production environment ( like when building for GitHub Pages)
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Enables static HTML export, which is needed for GitHub Pages hosting
  output: "export",
  
  // Sets the base path for assets. This is important for GitHub Pages since the site 
  // is at /pixel-canvas rather than root.
  basePath: isProd ? "/pixel-canvas" : "",
  
  images: {
    // Turns Next.js image optimization API off. 
    // Static exports don't have Node.js server to optimize images so this isn't needed.
    unoptimized: true,
  },

  experimental: {
    agentFeedback: true,
  },
  
  cacheComponents: true,
  partialPrefetching: true,
  
  // Configures Turbopack to bundle and process Tailwind CSS
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