import Link from "next/link";
import { SITE_PHONE, SITE_PHONE_HREF, WELCOME_EMAIL, getLocations } from "@/lib/content";
import Needs from "./Needs";
import "./site-chrome.css";

/** The client's brand line, taken from content/pages/home.md. Not ours to reword. */
const TAGLINE = "Healing is not a straight line.";

const CARE_LINKS = [
  { label: "Therapy", href: "/therapy" },
  { label: "Wellness", href: "/wellness" },
  { label: "Medication Management", href: "/medication-management" },
  { label: "Concerns", href: "/concerns" },
  { label: "Providers", href: "/providers" },
  { label: "Locations", href: "/locations" },
  { label: "How It Works", href: "/how-it-works" },
] as const;

const PRACTICE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Insurance and Fees", href: "/insurance-and-fees" },
  { label: "FAQ", href: "/faq" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Notice of Privacy Practices", href: "/notice-of-privacy-practices" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Accessibility Statement", href: "/accessibility-statement" },
] as const;

/** The client has not supplied handles yet, so each one stays a tracked gap. */
const SOCIAL_NEEDS = ["Instagram URL", "Facebook URL", "LinkedIn URL"] as const;

export default function Footer() {
  const locations = getLocations();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <Link href="/" className="site-footer__logo" aria-label="Pathways Within home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="" width={500} height={500} loading="lazy" decoding="async" />
          </Link>
          <p className="site-footer__tagline">{TAGLINE}</p>
          <p className="site-footer__contact">
            <a href={SITE_PHONE_HREF}>{SITE_PHONE}</a>
            <a href={`mailto:${WELCOME_EMAIL}`}>{WELCOME_EMAIL}</a>
          </p>
        </div>

        <nav aria-labelledby="site-footer-care">
          <p className="site-footer__label" id="site-footer-care">
            Care
          </p>
          <ul>
            {CARE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="site-footer-practice">
          <p className="site-footer__label" id="site-footer-practice">
            Practice
          </p>
          <ul>
            {PRACTICE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__offices">
          <p className="site-footer__label">Offices</p>
          <ul>
            {locations.map((location) => (
              <li key={location.slug}>
                <Link href={`/locations/${location.slug}`}>
                  {/* The brand sits in the logo above, so the office reads by town. */}
                  {location.name.replace(/^Pathways Within\s+/, "")}
                </Link>
                <address>{location.addressLine}</address>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__social">
          {/* In production the markers are inert, so the label would head an empty list. */}
          {process.env.NODE_ENV === "production" ? null : (
            <p className="site-footer__label">Follow</p>
          )}
          <ul>
            {SOCIAL_NEEDS.map((value) => (
              <li key={value}>
                <Needs value={value} />
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; {new Date().getFullYear()} Pathways Within</p>
          <nav aria-label="Legal">
            <ul>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
