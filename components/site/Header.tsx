"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_PHONE, SITE_PHONE_HREF } from "@/lib/content";
import "./site-chrome.css";

/** Primary nav, in the order the design concept fixes it. */
const PRIMARY_NAV = [
  { label: "Therapy", href: "/therapy" },
  { label: "Wellness", href: "/wellness" },
  { label: "Medication Management", href: "/medication-management" },
  { label: "Concerns", href: "/concerns" },
  { label: "Providers", href: "/providers" },
  { label: "Locations", href: "/locations" },
  { label: "How It Works", href: "/how-it-works" },
] as const;

const NAV_PANEL_ID = "site-nav";

/** /therapy/emdr sits inside /therapy; /telehealth does not sit inside /tele. */
function isCurrentSection(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The mobile panel stays open across a client side navigation otherwise.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner" data-open={open ? "true" : "false"}>
        <Link href="/" className="site-header__logo" aria-label="Pathways Within home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="" width={500} height={500} decoding="async" />
        </Link>

        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls={NAV_PANEL_ID}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          <span className="site-header__bars" aria-hidden="true" />
          {open ? "Close" : "Menu"}
        </button>

        <div className="site-header__panel" id={NAV_PANEL_ID}>
          <nav className="site-header__nav" aria-label="Primary">
            <ul>
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrentSection(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <a className="site-header__phone" href={SITE_PHONE_HREF}>
              {SITE_PHONE}
            </a>
            <Link href="/contact" className="button">
              Start your 360 intake
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
