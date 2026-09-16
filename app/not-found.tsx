import type { Metadata } from "next";
import Link from "next/link";
import { SITE_PHONE, SITE_PHONE_HREF, getAllPages, getProfileProviders } from "@/lib/content";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import Needs from "@/components/site/Needs";
import NotFoundSearch, { type SearchEntry } from "@/components/site/NotFoundSearch";
import SkipLink from "@/components/site/SkipLink";

export const metadata: Metadata = {
  title: "Page Not Found | Pathways Within",
  robots: { index: false, follow: true },
};

const PILLARS = [
  { label: "Therapy", href: "/therapy" },
  { label: "Wellness", href: "/wellness" },
  { label: "Medication Management", href: "/medication-management" },
] as const;

/** Every real destination, built once at module scope and handed to the client. */
function buildSearchIndex(): SearchEntry[] {
  const fromPages = getAllPages()
    .filter((page) => page.frontMatter.index && !page.frontMatter.url.includes("{"))
    .map((page) => ({ url: page.frontMatter.url, h1: page.frontMatter.h1 }));

  const fromProviders = getProfileProviders().map((provider) => ({
    url: `/providers/${provider.slug}`,
    h1: provider.displayName,
  }));

  const byUrl = new Map<string, SearchEntry>();
  for (const entry of [...fromPages, ...fromProviders]) {
    if (!byUrl.has(entry.url)) byUrl.set(entry.url, entry);
  }

  return [...byUrl.values()].sort((left, right) => left.h1.localeCompare(right.h1));
}

const SEARCH_INDEX = buildSearchIndex();

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" className="not-found">
        <h1>Page not found</h1>
        <p className="not-found__lede">
          Sorry, this page is not here. It may have moved or the address may have a typo.
          Search below, or start with one of the three pillars of care.
          <Needs value="approved 404 page copy" />
        </p>

        <NotFoundSearch pages={SEARCH_INDEX} />

        <h2>Start with a pillar</h2>
        <ul className="not-found__pillars">
          {PILLARS.map((pillar) => (
            <li key={pillar.href}>
              <Link href={pillar.href}>{pillar.label}</Link>
            </li>
          ))}
        </ul>

        <p className="not-found__help">
          Still stuck? Call the Welcome Team at{" "}
          <a href={SITE_PHONE_HREF}>{SITE_PHONE}</a> or{" "}
          <Link href="/contact">start your 360 intake</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
