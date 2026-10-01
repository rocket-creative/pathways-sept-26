"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_PHONE, SITE_PHONE_SMS } from "@/lib/site";
import { THERAPY_LINKS } from "./therapy-links";
import "./site-chrome.css";

/** Primary nav, in the order the design concept fixes it. */
const PRIMARY_NAV = [
  { label: "Therapy", href: "/therapy", children: THERAPY_LINKS },
  { label: "Wellness", href: "/wellness" },
  { label: "Coaching", href: "/coaching" },
  { label: "Medication Management", href: "/medication-management" },
  { label: "Concerns", href: "/concerns" },
  { label: "Providers", href: "/providers" },
  { label: "Locations", href: "/locations" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

const NAV_PANEL_ID = "site-nav";

/** /therapy/emdr sits inside /therapy; /telehealth does not sit inside /tele. */
function isCurrentSection(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const THERAPY_MENU_ID = "therapy-services-menu";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [therapyOpen, setTherapyOpen] = useState(false);

  // The mobile panel stays open across a client side navigation otherwise.
  useEffect(() => {
    setOpen(false);
    setTherapyOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !therapyOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (therapyOpen) setTherapyOpen(false);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, therapyOpen]);

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
              {PRIMARY_NAV.map((item) => {
                const children = "children" in item ? item.children : undefined;
                return (
                  <li
                    key={item.href}
                    className={children ? "site-header__drop" : undefined}
                    data-open={children && therapyOpen ? "true" : undefined}
                  >
                    <Link
                      href={item.href}
                      aria-current={isCurrentSection(pathname, item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                    {children ? (
                      <>
                        <button
                          type="button"
                          className="site-header__drop-toggle"
                          aria-expanded={therapyOpen}
                          aria-controls={THERAPY_MENU_ID}
                          aria-label="Therapy services"
                          onClick={() => setTherapyOpen((wasOpen) => !wasOpen)}
                        >
                          <span className="site-header__chevron" aria-hidden="true" />
                        </button>
                        <ul id={THERAPY_MENU_ID} className="site-header__menu" aria-label="Therapy services">
                          {children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                aria-current={pathname === child.href ? "page" : undefined}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="site-header__actions">
            <a className="site-header__phone" href={SITE_PHONE_SMS}>
              <strong>{SITE_PHONE}</strong>
            </a>
            <Link href="/contact#send-a-message" className="button">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
