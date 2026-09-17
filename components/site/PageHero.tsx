import Link from "next/link";
import type { ReactNode } from "react";
import "./page-hero.css";

/**
 * Opening hero used on every content page: the mark on the left, the page
 * h1 and its lead copy on the right. Homepage and inner pages share this
 * markup so the lockup stays one layout.
 */
export default function PageHero({ children }: { children: ReactNode }) {
  return (
    <div className="page-hero">
      <Link href="/" className="page-hero__logo" aria-label="Pathways Within home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.webp" alt="" width={500} height={500} decoding="async" />
      </Link>
      <div className="page-hero__copy">{children}</div>
    </div>
  );
}
