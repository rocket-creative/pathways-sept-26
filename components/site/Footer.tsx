import Link from "next/link";
import { SITE_PHONE, SITE_PHONE_HREF, WELCOME_EMAIL, getLocations } from "@/lib/content";

/** OWNER: site chrome agent. Replace with the full footer from the spec. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <p>Pathways Within</p>
      <a href={SITE_PHONE_HREF}>{SITE_PHONE}</a>
      <a href={`mailto:${WELCOME_EMAIL}`}>{WELCOME_EMAIL}</a>
      <ul>
        {getLocations().map((location) => (
          <li key={location.slug}>
            <Link href={`/locations/${location.slug}`}>{location.name}</Link>
            <address>{location.addressLine}</address>
          </li>
        ))}
      </ul>
    </footer>
  );
}
