import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SITE_ORIGIN,
  getAllUrls,
  getBreadcrumbTrail,
  getPageByUrl,
  segmentsToUrl,
  urlToSegments,
  type Page,
} from "@/lib/content";
import { ogImageFor, resolveHeadshot } from "@/lib/images";
import { getProviderPage } from "@/lib/providers";
import { buildPageGraph } from "@/lib/schema";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import SkipLink from "@/components/site/SkipLink";
import PageBody from "@/components/render/PageBody";
import PageBackdrop from "@/components/backdrop/PageBackdrop";

type RouteParams = { slug: string[] };

function resolvePage(segments: string[]): Page | undefined {
  const url = segmentsToUrl(segments);
  return getPageByUrl(url) ?? getProviderPage(url);
}

export function generateStaticParams(): RouteParams[] {
  return getAllUrls()
    .filter((url) => url !== "/")
    .map((url) => ({ slug: urlToSegments(url) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) return {};

  const { title, meta, url, index, hero_image } = page.frontMatter;
  const canonical = `${SITE_ORIGIN}${url}`;
  // The registry's hero photograph first; a provider's local headshot next;
  // then whatever absolute url the front matter still carries from the old site.
  const providerSlug = /^\/providers\/([a-z0-9-]+)$/.exec(url)?.[1];
  const headshot = providerSlug ? resolveHeadshot(providerSlug) : undefined;
  const ogImage =
    ogImageFor(url, SITE_ORIGIN) ??
    (headshot ? `${SITE_ORIGIN}${headshot.src}` : undefined) ??
    (hero_image && /^https?:\/\//.test(hero_image) ? hero_image.split(" ")[0] : undefined);

  return {
    title,
    description: meta,
    alternates: { canonical },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description: meta,
      url: canonical,
      siteName: "Pathways Within",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ContentPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) notFound();

  const graph = buildPageGraph(page);

  return (
    <>
      <PageBackdrop />
      <SkipLink />
      <Header />
      {/* Breadcrumbs sit below the header but outside main, so the skip link
          drops the reader at the page content rather than at navigation. */}
      <Breadcrumbs
        url={page.frontMatter.url}
        title={page.frontMatter.h1}
        authored={getBreadcrumbTrail(page)}
      />
      <main id="main" className="page page--lanes" data-page-type={page.frontMatter.page_type}>
        <PageBody page={page} />
      </main>
      <Footer />
      {graph.map((node, position) => (
        <script
          key={position}
          type="application/ld+json"
          // Schema graphs are built from our own content, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
