import { League_Spartan, Quicksand } from "next/font/google";
import localFont from "next/font/local";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  preload: true, // Preload critical font
  display: "swap", // Use font-display: swap for better performance
  fallback: ["system-ui", "arial"], // Add fallback fonts
  adjustFontFallback: true, // Optimize font fallback
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  preload: false, // Don't preload secondary font
  display: "swap", // Use font-display: swap for better performance
  fallback: ["system-ui", "arial"], // Add fallback fonts
  adjustFontFallback: true, // Optimize font fallback
});

const premiumUltra84 = localFont({
  variable: "--font-premium-ultra-84",
  src: [
    {
      path: "./PremiumUltra84.ttf",
    },
  ],
  preload: false, // Only used in specific components, not immediately
  display: "swap", // Use font-display: swap for better performance
  fallback: ["system-ui", "arial"], // Add fallback fonts
  adjustFontFallback: true, // Optimize font fallback
});

export { leagueSpartan, quicksand, premiumUltra84 };
