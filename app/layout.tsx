import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retro Pixel Canvas",
  description: "A pure React state pixel art canvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind Play CDN forces styling on GitHub Pages */}
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}