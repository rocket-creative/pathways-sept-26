/**
 * JSON LD. The site wide graph goes on every page; each page file carries its
 * own graph in a trailing json fence, which we emit alongside it.
 *
 * OWNER: SEO agent. Expand siteGraph and add per page type enrichment here.
 */
import { SITE_ORIGIN, WELCOME_EMAIL, type Page } from "@/lib/content";

export function siteGraph(): unknown {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": `${SITE_ORIGIN}/#org`,
        name: "Pathways Within",
        url: `${SITE_ORIGIN}/`,
        logo: `${SITE_ORIGIN}/logo.webp`,
        telephone: "+1-631-371-3825",
        email: WELCOME_EMAIL,
        founder: { "@id": `${SITE_ORIGIN}/providers/rachel-lessard#person` },
        medicalSpecialty: ["Psychiatric", "Psychotherapy"],
        areaServed: [
          { "@type": "AdministrativeArea", name: "Nassau County, NY" },
          { "@type": "AdministrativeArea", name: "Suffolk County, NY" },
        ],
        sameAs: ["https://wizehire.com/cmp/pathways-within"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: "Pathways Within",
        publisher: { "@id": `${SITE_ORIGIN}/#org` },
      },
    ],
  };
}

/** Site wide graph plus whatever the page file supplied. */
export function buildPageGraph(page: Page): unknown[] {
  return page.jsonLd ? [siteGraph(), page.jsonLd] : [siteGraph()];
}
