// Helped with Tailwind CSS
// https://tailwindcss.com/docs/installation/play-cdn

import type { Metadata } from "next";
import "./globals.css";

// Defines metadata for application, browser tab titles (and SEO but that doesn't matter for this)
export const metadata: Metadata = {
  title: "Pixel Canvas",
  description: "A pure React state pixel art canvas",
};

// RootLayout: wraps every page in the application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 
          Tailwind Play CDN: Forces browser to evaluate and apply Tailwind utility classes on the fly, 
          solving the issue where GitHub Pages hides CSS.
        */}
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body className="antialiased">
        {/* Renders the content of the current page */}
        {children}
      </body>
    </html>
  );
}