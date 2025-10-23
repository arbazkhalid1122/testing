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
      <body
        className={`${leagueSpartan.variable} ${quicksand.variable} ${premiumUltra84.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
