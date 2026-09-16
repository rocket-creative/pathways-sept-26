/**
 * Site typography. Quicksand (display) and Nunito (body) are stand-ins;
 * swap them here and the CSS variables below keep working everywhere.
 */
import { Quicksand, Nunito } from "next/font/google";

export const displayFont = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const bodyFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Class names to put on <html> so the variables are available globally. */
export const fontClassNames = `${displayFont.variable} ${bodyFont.variable}`;
