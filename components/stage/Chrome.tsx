import Link from "next/link";
import type { RefObject } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Therapy", href: "/therapy" },
  { label: "Wellness", href: "/wellness" },
  { label: "Our Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

type Props = {
  progressFillRef: RefObject<HTMLSpanElement | null>;
  progressLabelRef: RefObject<HTMLSpanElement | null>;
};

export default function Chrome({ progressFillRef, progressLabelRef }: Props) {
  return (
    <>
      <nav className="nav" aria-label="Primary">
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={item.href === "/" ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link href="/" className="logo" aria-label="Pathways Within — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.webp"
          alt="Pathways Within — Wisdom and Wellness Collaborative"
          width={500}
          height={500}
          decoding="async"
        />
      </Link>

      <div className="cta-pill">
        <Link href="/contact" className="pill">
          Book a consultation
        </Link>
      </div>

      <div className="progress" aria-live="off">
        <span className="progress__rail" aria-hidden="true">
          <span className="progress__fill" ref={progressFillRef} />
        </span>
        <span className="progress__label" ref={progressLabelRef}>
          0% walked
        </span>
      </div>
    </>
  );
}
