import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathways Within — Therapy & Wellness Collaborative on Long Island",
  description:
    "Pathways Within is a Long Island therapy and wellness collaborative. Find your way within: individual, couples, family and group therapy, EMDR, somatic work and more.",
};

export const viewport: Viewport = {
  themeColor: "#EBEBEB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // suppressHydrationWarning: components/hero/HomeHero's inline PIN_BOOT
  // script sets data-hero-mode on <html> before React hydrates (prevents
  // CLS), so the server/client attribute set intentionally differs.
  return (
    <html lang="en" className={fontClassNames} suppressHydrationWarning>
      {/* Image 1 (the branch) is preloaded by components/hero/HomeHero on the
          homepage only; every other page has no use for it. */}
      <body>{children}</body>
    </html>
  );
}
