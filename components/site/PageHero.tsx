import Link from "next/link";
import type { ReactNode } from "react";
import "./page-hero.css";

/**
 * Opening hero used on every content page. The mark and the copy are
 * siblings: the homepage lockup places them side by side, and on an inner
 * page the copy is the first glass card while the mark is fixed in the
 * left margin, outside that card.
 */
export default function PageHero({ children, notice }: { children: ReactNode; notice?: ReactNode }) {
  return (
    <>
      <Link href="/" className="page-hero__logo" aria-label="Pathways Within home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.webp" alt="" width={500} height={500} decoding="async" />
      </Link>
      <div className="page-hero">
        <div className="page-hero__copy">{children}</div>
        {notice}
      </div>
    </>
  );
}
