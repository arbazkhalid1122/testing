import type { Metadata } from "next";
import "./globals.css";
import { leagueSpartan, quicksand, premiumUltra84 } from "./fonts";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

export const metadata: Metadata = {
  title: "pyt | Real-Time Postcards",
  description: "Print Your Trip",
  icons: {
    icon: "/favicon.ico"
  },
  // Add performance optimizations
  other: {
    'format-detection': 'telephone=no',
  },
  // Add viewport meta for better mobile performance
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//js.stripe.com" />
        <link rel="dns-prefetch" href="//api.stripe.com" />
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${leagueSpartan.variable} ${quicksand.variable} ${premiumUltra84.variable} antialiased`}
      >
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}
