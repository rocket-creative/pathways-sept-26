import type { CSSProperties, ReactNode } from "react";
import type { Block } from "@/lib/content";
import type { RenderContext } from "@/components/render/context";
import Heading, { type HeadingBlock } from "@/components/render/blocks/Heading";
import CtaRow, { type CtaBlock } from "@/components/render/blocks/Cta";
import { Paragraph } from "@/components/render/blocks/Prose";
import HeroStage from "./HeroStage";
import { BRANCH, HANDOFF_IMAGE, anchorFor, stopPhoto } from "./anchors";
import "@/components/backdrop/backdrop.css";
import "./hero.css";

/**
 * The homepage hero: the stops between [HERO] and [/HERO] in
 * content/pages/home.md, rendered as six <section> elements in reading order,
 * each with the supplied <h2> (slug id), <p>, and one link.
 *
 * Everything here is in the HTML at load. On desktop, with motion allowed,
 * HeroStage pins the wrapper and scrubs the track with native scroll. Under
 * 768px, under prefers-reduced-motion, or without JavaScript, the same markup
 * is a vertical stack with image 1 static and unblurred.
 *
 * The h1 is passed in as children and sits inside the pin, outside the
 * track, so it stays on screen for the side-scroll instead of moving up.
 */
export type HeroBlock = Extract<Block, { kind: "widget" }>;

interface Stop {
  heading: HeadingBlock;
  blocks: Block[];
}

function groupStops(blocks: Block[]): Stop[] {
  const stops: Stop[] = [];
  for (const block of blocks) {
    if (block.kind === "heading" && block.level === 2) {
      stops.push({ heading: block, blocks: [] });
      continue;
    }
    if (stops.length) stops[stops.length - 1].blocks.push(block);
  }
  return stops;
}

/**
 * Runs before the hero markup is parsed. When the reader is on a desktop
 * viewport with motion allowed, the pinned layout applies from the first
 * paint, so hydrating into it moves nothing (CLS). If the hero controller has
 * not taken over within six seconds (script failed to load, for instance),
 * the flag is dropped and the CSS stacked fallback shows every card.
 */
const PIN_BOOT = `(function(){try{var m=window.matchMedia;if(!m)return;if(m('(min-width: 768px)').matches&&!m('(prefers-reduced-motion: reduce)').matches){var h=document.documentElement;h.setAttribute('data-hero-mode','pin');setTimeout(function(){if(!h.hasAttribute('data-hero-live'))h.removeAttribute('data-hero-mode')},6000)}}catch(e){}})();`;

export default function HomeHero({
  block,
  ctx,
  children,
}: {
  block: HeroBlock;
  ctx: RenderContext;
  children?: ReactNode;
}) {
  const stops = groupStops(block.blocks);

  /*
    The first card that hangs above the branch is the one the h1 lockup can
    collide with (the below cards sit under the lockup's bottom edge). Its
    anchor x, as a fraction of image 1, lets hero.css stop the lockup's text
    column short of that card's left edge at any viewport.
  */
  const fence =
    stops.map((_, index) => anchorFor(index, stops.length)).find((anchor) => anchor.place === "above") ?? null;
  const pinStyle = fence ? ({ "--hero-fence-sx": fence.sx } as CSSProperties) : undefined;

  return (
    <>
      {/*
        Image 1 is the LCP candidate on desktop, where the pinned stage is the
        first screen; React hoists this into <head>. Under 768px the stacked
        layout puts the image below the h1 block, so the preload is scoped to
        desktop and does not compete with the fonts the text LCP needs.
      */}
      <link
        rel="preload"
        as="image"
        href={BRANCH.src}
        imageSrcSet={BRANCH.srcSet}
        imageSizes={BRANCH.sizes}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <script dangerouslySetInnerHTML={{ __html: PIN_BOOT }} />
      <HeroStage>
        <div className="hero-stage__pin" data-hero-pin style={pinStyle}>
          {children}
          <div className="hero-stage__track">
            {/* Image 1. Opacity only during the handoff; no text descendants. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-stage__branch"
              data-hero-image-1
              src={BRANCH.src}
              srcSet={BRANCH.srcSet}
              sizes={BRANCH.sizes}
              width={BRANCH.width}
              height={BRANCH.height}
              alt="The Pathways Within labyrinth path winding through a white landscape with a cairn, a tide pool, and two figures at callout stops"
              decoding="async"
            />

            {stops.map((stop, index) => {
              const isLast = index === stops.length - 1;
              const anchor = anchorFor(index, stops.length);
              const style = isLast
                ? undefined
                : ({ "--sx": anchor.sx, "--sy": anchor.sy } as CSSProperties);
              const placement = isLast ? "hero-stop--cta" : `hero-stop--${anchor.place}`;
              const surface = "hero-stop--card";
              /*
                The close up of where this card lands on the branch, for the
                stacked layouts (hero.css hides it when the hero is pinned,
                where the card sits on the real thing). Decorative: the
                heading carries the meaning. Lazy, so the phone downloads
                the branch banner first.
              */
              const photo = isLast ? null : stopPhoto(index);

              return (
                <section
                  key={stop.heading.id}
                  className={`hero-stop ${placement} ${surface}${photo ? " hero-stop--photo" : ""}`}
                  data-stop={index + 1}
                  aria-labelledby={stop.heading.id}
                  style={style}
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="hero-stop__photo"
                      src={photo.src}
                      srcSet={photo.srcSet}
                      sizes={photo.sizes}
                      width={photo.width}
                      height={photo.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="hero-stop__inner" data-stop={String(index + 1).padStart(2, "0")}>
                    <Heading block={stop.heading} ctx={ctx} />
                    {renderStopBody(stop.blocks, ctx)}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/*
          Image 2. Fixed behind the page at full strength, no overlay on the
          picture itself (see hero.css). The src is attached by the controller
          at about 40% of hero progress, or when the third stop scrolls into
          view in the stacked layouts, so it is never a candidate for LCP and
          never competes with image 1.

          The second copy is the veil under the fixed nav, the same one the
          inner pages have (backdrop.css .page-backdrop--veil): fixed to the
          same box, layered above the page and below the bar, masked to a
          short band, so copy fades into image 2 before it slides under the
          pills. Same tiers, so it costs no extra download; the controller
          fades both copies together.
        */}
        <HandoffImage />
        <HandoffImage veil />
      </HeroStage>
    </>
  );
}

function HandoffImage({ veil = false }: { veil?: boolean }) {
  return (
    <div
      className={veil ? "hero-handoff hero-handoff--veil" : "hero-handoff"}
      data-hero-image-2
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-handoff__img"
        alt=""
        data-src={HANDOFF_IMAGE.src}
        data-srcset={HANDOFF_IMAGE.srcSet}
        sizes={HANDOFF_IMAGE.sizes}
        width={HANDOFF_IMAGE.width}
        height={HANDOFF_IMAGE.height}
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
}

function renderStopBody(blocks: Block[], ctx: RenderContext) {
  const out = [];
  let index = 0;
  while (index < blocks.length) {
    const block = blocks[index];
    if (block.kind === "cta") {
      const run: CtaBlock[] = [];
      while (index < blocks.length && blocks[index].kind === "cta") {
        run.push(blocks[index] as CtaBlock);
        index += 1;
      }
      out.push(<CtaRow key={`cta-${index}`} ctas={run} ctx={ctx} />);
      continue;
    }
    if (block.kind === "paragraph") {
      out.push(<Paragraph key={index} block={block} ctx={ctx} />);
    }
    index += 1;
  }
  return out;
}
