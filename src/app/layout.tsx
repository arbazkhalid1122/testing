import type { Metadata } from "next";
import "./globals.css";
import { leagueSpartan, quicksand, premiumUltra84 } from "./fonts";

export const metadata: Metadata = {
  title: "pyt | Real-Time Postcards",
  description: "Print Your Trip",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preload" href="/fonts/PremiumUltra84.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS inline for faster rendering */
            body { font-family: var(--font-league-spartan), system-ui, sans-serif; }
            .bg-accent { background-color: oklch(0.9612 0.0152 90.24); }
            .min-h-screen { min-height: 100vh; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .w-full { width: 100%; }
            .relative { position: relative; }
            .overflow-x-hidden { overflow-x: hidden; }
            .rounded-b-\\[3rem\\] { border-bottom-left-radius: 3rem; border-bottom-right-radius: 3rem; }
            .p-5 { padding: 1.25rem; }
            .pt-30 { padding-top: 7.5rem; }
            .gap-2 { gap: 0.5rem; }
            .gap-5 { gap: 1.25rem; }
            .gap-10 { gap: 2.5rem; }
            .text-\\[35px\\] { font-size: 35px; }
            .md\\:text-\\[56px\\] { font-size: 56px; }
            .leading-none { line-height: 1; }
            .font-\\[600\\] { font-weight: 600; }
            .font-\\[500\\] { font-weight: 500; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .w-fit { width: fit-content; }
            .inline-flex { display: inline-flex; }
            .whitespace-nowrap { white-space: nowrap; }
            .rounded-full { border-radius: 9999px; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .font-medium { font-weight: 500; }
            .transition-all { transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); }
            .cursor-pointer { cursor: pointer; }
            .bg-primary { background-color: oklch(59.461% 0.0699 145.318); }
            .text-primary-foreground { color: oklch(0.9906 0.0135 92.98); }
            .shadow-xs { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
            .hover\\:bg-primary\\/90:hover { background-color: oklch(59.461% 0.0699 145.318 / 0.9); }
            .z-10 { z-index: 10; }
            .scale-115 { transform: scale(1.15); }
            .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          `
        }} />
      </head>
      <body
        className={`${leagueSpartan.variable} ${quicksand.variable} ${premiumUltra84.variable} antialiased`}
      >
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
