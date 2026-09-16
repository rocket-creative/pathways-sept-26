import Link from "next/link";
import { getLocations } from "@/lib/content";

/** OWNER: providers and locations agent. Accessibility icon, map, hours. */
export default function LocationCards({ slugs }: { slugs: string[] }) {
  const all = getLocations();
  const wanted = slugs.length
    ? slugs
        .map((slug) => all.find((location) => location.slug === slug))
        .filter((location): location is (typeof all)[number] => Boolean(location))
    : all;

  if (!wanted.length) return null;

  return (
    <ul className="location-cards">
      {wanted.map((location) => (
        <li key={location.slug} className="location-card">
          <Link href={`/locations/${location.slug}`}>{location.name}</Link>
          <address>{location.addressLine}</address>
        </li>
      ))}
    </ul>
  );
}
