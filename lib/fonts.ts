/**
 * Site typography.
 *
 * FONT SWAP POINT. Quicksand (display) and Nunito (body) are stand ins for
 * [NEEDS: real brand fonts]. Swap the two next/font calls below and the whole
 * site follows: nothing else names a typeface except the layered fallback in
 * app/globals.css.
 *
 * next/font self hosts the files at build time (no request to Google at
 * runtime), sets font-display: swap, preloads the latin subset, and generates
 * a size-adjusted local fallback so the swap does not reflow the page. Keep
 * all of that when the real faces arrive; if they ship as files rather than
 * Google fonts, move to next/font/local with the same variable names.
 */
import { Quicksand, Nunito } from "next/font/google";

export const displayFont = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["ui-rounded", "system-ui", "-apple-system", "sans-serif"],
});

export const bodyFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Helvetica", "sans-serif"],
});

/** Class names to put on <html> so the variables are available globally. */
export const fontClassNames = `${displayFont.variable} ${bodyFont.variable}`;
