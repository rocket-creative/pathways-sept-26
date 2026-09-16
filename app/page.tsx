import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_ORIGIN, getPageByUrl, type Block } from "@/lib/content";
import { buildPageGraph } from "@/lib/schema";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import SkipLink from "@/components/site/SkipLink";
import PageBody from "@/components/render/PageBody";
import HomeHero, { type HeroBlock } from "@/components/hero/HomeHero";

/**
 * The homepage renders content/pages/home.md like every other page, with one
 * difference: the [HERO] … [/HERO] region is lifted out of the article and
 * handed to HomeHero, which pins it on desktop. The h1 and everything before
 * the region stay in normal flow above the hero; everything after it renders
 * through the ordinary renderer below.
 */

function homePage() {
  const page = getPageByUrl("/");
  if (!page) notFound();
  return page;
}

function isHero(block: Block): block is HeroBlock {
  return block.kind === "widget" && block.name === "hero";
}

export function generateMetadata(): Metadata {
  const { title, meta, url, index, hero_image } = homePage().frontMatter;
  const canonical = `${SITE_ORIGIN}${url}`;
  const ogImage = hero_image && /^https?:\/\//.test(hero_image) ? hero_image : undefined;

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

export default function Home() {
  const page = homePage();
  const heroAt = page.blocks.findIndex(isHero);
  const hero = heroAt === -1 ? null : (page.blocks[heroAt] as HeroBlock);
  const before = heroAt === -1 ? page.blocks : page.blocks.slice(0, heroAt);
  const after = heroAt === -1 ? [] : page.blocks.slice(heroAt + 1);
  const graph = buildPageGraph(page);

  const ctx = {
    source: `${page.frontMatter.url} (${page.sourceFile})`,
    url: page.frontMatter.url,
    eagerForms: false,
    firstForm: null,
  };

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" className="page page--home page--lanes" data-page-type={page.frontMatter.page_type}>
        <div className="home-intro">
          <PageBody page={{ ...page, blocks: before }} />
        </div>
        {hero ? <HomeHero block={hero} ctx={ctx} /> : null}
        {after.length ? <PageBody page={{ ...page, blocks: after }} /> : null}
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
