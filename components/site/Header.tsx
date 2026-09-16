import Link from "next/link";
import { SITE_PHONE, SITE_PHONE_HREF } from "@/lib/content";

/** OWNER: site chrome agent. Replace with the full persistent header. */
export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="site-header__logo">
        Pathways Within
      </Link>
      <nav aria-label="Primary">
        <Link href="/therapy">Therapy</Link>
        <Link href="/wellness">Wellness</Link>
        <Link href="/medication-management">Medication Management</Link>
        <Link href="/concerns">Concerns</Link>
        <Link href="/providers">Providers</Link>
        <Link href="/locations">Locations</Link>
        <Link href="/how-it-works">How It Works</Link>
      </nav>
      <a href={SITE_PHONE_HREF}>{SITE_PHONE}</a>
      <Link href="/contact" className="button">
        Start your 360 intake
      </Link>
    </header>
  );
}
