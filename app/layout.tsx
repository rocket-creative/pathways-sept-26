import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import { BRANCH } from "@/lib/stops";
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
  return (
    <html lang="en" className={fontClassNames}>
      <head>
        <link
          rel="preload"
          as="image"
          href={BRANCH.src}
          imageSrcSet={BRANCH.srcSet}
          imageSizes={BRANCH.sizes}
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
