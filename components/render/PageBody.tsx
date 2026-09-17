import type { ReactNode } from "react";
import { inlineToText, type Block, type Page } from "@/lib/content";
import { getPagePhotos, resolvePhoto, type ResolvedPhoto } from "@/lib/images";
import LocationCards from "@/components/directory/LocationCards";
import ProviderCards from "@/components/directory/ProviderCards";
import ProviderDirectory from "@/components/directory/ProviderDirectory";
import Quiz from "@/components/quiz";
import PageHero from "@/components/site/PageHero";
import type { RenderContext } from "./context";
import Byline, { type BylineBlock } from "./blocks/Byline";
import ContentImage from "./blocks/ContentImage";
import CtaRow, { type CtaBlock } from "./blocks/Cta";
import FormEmbed from "./blocks/FormEmbed";
import Heading, { type HeadingBlock } from "./blocks/Heading";
import List from "./blocks/List";
import Needs from "./blocks/Needs";
import { Paragraph, Quote } from "./blocks/Prose";
import SectionFigure from "./blocks/SectionFigure";
import "./render.css";
import "./photos.css";

/**
 * Renders the parsed block model. Copy is never altered here: the parser in
 * lib/content.ts decides what a block is, this decides what it looks like.
 *
 * Photographs come from lib/images, keyed by page url and section id, so the
 * copy files never change to gain or lose a picture. Two placements: a figure
 * beside a section's copy, and a local asset behind an `[IMAGE: alt]` marker.
 * A page's `hero` entry in the registry is not rendered; it only supplies the
 * og:image (lib/images ogImageFor).
 *
 * Everything below the article is server rendered and fully visible on load.
 * No accordion, no tab, no disclosure: the FAQ answers are in the DOM.
 *
 * OWNER: renderer agent.
 */
export default function PageBody({ page }: { page: Page }) {
  const photos = getPagePhotos(page.frontMatter.url);

  const ctx: RenderContext = {
    source: `${page.frontMatter.url} (${page.sourceFile})`,
    url: page.frontMatter.url,
    eagerForms: page.frontMatter.url === "/contact",
    firstForm: page.blocks.find((block) => block.kind === "form") ?? null,
    inlinePhotos: matchInlinePhotos(page.blocks, photos?.inline),
  };

  const { sections, bylines } = groupSections(page.blocks);

  return (
    <article className="prose">
      {sections.map((section, position) => {
        if (!section.heading) {
          return (
            <section key={position} className="page-section page-section--intro" data-hero-lockup="">
              <PageHero>{renderBlocks(section.blocks, ctx)}</PageHero>
            </section>
          );
        }

        const figure = photos?.sections?.[section.heading.id];
        const resolved = resolvePhoto(figure);

        if (figure && resolved) {
          return (
            <section
              key={position}
              className="page-section page-section--figure"
              aria-labelledby={section.heading.id}
              data-section={section.heading.id}
              data-side={figure.side ?? "end"}
            >
              <div className="section-figure__copy">
                <Heading block={section.heading} ctx={ctx} />
                {renderSectionBody(section.heading, section.blocks, ctx)}
              </div>
              <SectionFigure photo={resolved} shape={figure.shape} aspect={figure.aspect} />
            </section>
          );
        }

        return (
          <section
            key={position}
            className="page-section"
            aria-labelledby={section.heading.id}
            data-section={section.heading.id}
          >
            <Heading block={section.heading} ctx={ctx} />
            {renderSectionBody(section.heading, section.blocks, ctx)}
          </section>
        );
      })}

      {bylines.map((block, position) => (
        <Byline
          key={position}
          block={block}
          lastReviewed={page.frontMatter.last_reviewed}
          ctx={ctx}
        />
      ))}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Sectioning                                                          */
/* ------------------------------------------------------------------ */

interface Section {
  /** null for the opening blocks that come before the first h2. */
  heading: HeadingBlock | null;
  blocks: Block[];
}

/**
 * Every h2 opens a section that runs to the next h2, so the design system has
 * real edge to edge sections to work with. The byline is lifted out of the
 * flow and rendered once, after the last section.
 */
function groupSections(blocks: Block[]): { sections: Section[]; bylines: BylineBlock[] } {
  const sections: Section[] = [];
  const bylines: BylineBlock[] = [];
  let current: Section = { heading: null, blocks: [] };

  for (const block of blocks) {
    if (block.kind === "byline") {
      bylines.push(block);
      continue;
    }

    if (block.kind === "heading" && block.level === 2) {
      if (current.heading || current.blocks.length) sections.push(current);
      current = { heading: block, blocks: [] };
      continue;
    }

    current.blocks.push(block);
  }

  if (current.heading || current.blocks.length) sections.push(current);
  return { sections, bylines };
}

/**
 * Pairs the registry's inline photographs with the `[IMAGE: alt]` blocks that
 * carry no src, in document order (widget regions included). Extra entries
 * on either side are ignored: a missing photo falls back to the placeholder.
 */
function matchInlinePhotos(
  blocks: Block[],
  inline: NonNullable<ReturnType<typeof getPagePhotos>>["inline"],
): Map<Block, ResolvedPhoto> | undefined {
  if (!inline?.length) return undefined;

  const targets: Block[] = [];
  const walk = (list: Block[]) => {
    for (const block of list) {
      if (block.kind === "image" && !block.src) targets.push(block);
      if (block.kind === "widget") walk(block.blocks);
    }
  };
  walk(blocks);

  const map = new Map<Block, ResolvedPhoto>();
  targets.forEach((block, index) => {
    const resolved = resolvePhoto(inline[index]);
    if (resolved) map.set(block, resolved);
  });
  return map;
}

function isQuestionSection(heading: HeadingBlock): boolean {
  return heading.id === "common-questions" || heading.id === "questions";
}

function renderSectionBody(heading: HeadingBlock, blocks: Block[], ctx: RenderContext): ReactNode {
  return isQuestionSection(heading) ? renderQuestions(blocks, ctx) : renderBlocks(blocks, ctx);
}

/**
 * Under "Common questions" each h3 and the blocks below it are grouped so they
 * can be styled as a unit. The question and its answer stay in the document,
 * visible, in heading order.
 */
function renderQuestions(blocks: Block[], ctx: RenderContext): ReactNode {
  const lead: Block[] = [];
  const items: { question: HeadingBlock; answer: Block[] }[] = [];

  for (const block of blocks) {
    if (block.kind === "heading" && block.level >= 3) {
      items.push({ question: block, answer: [] });
      continue;
    }

    if (items.length) items[items.length - 1].answer.push(block);
    else lead.push(block);
  }

  return (
    <>
      {renderBlocks(lead, ctx)}
      {items.length ? (
        <div className="faq">
          {items.map((item, position) => (
            <div key={position} className="faq-item">
              <Heading block={item.question} ctx={ctx} />
              {renderBlocks(item.answer, ctx)}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

function renderBlocks(blocks: Block[], ctx: RenderContext): ReactNode[] {
  const out: ReactNode[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (block.kind === "cta") {
      const run: CtaBlock[] = [];
      let cursor = index;
      while (cursor < blocks.length) {
        const next = blocks[cursor];
        if (next.kind !== "cta") break;
        run.push(next);
        cursor += 1;
      }
      out.push(<CtaRow key={index} ctas={run} ctx={ctx} />);
      index = cursor;
      continue;
    }

    out.push(<RenderBlock key={index} block={block} ctx={ctx} />);
    index += 1;
  }

  return out;
}

function RenderBlock({ block, ctx }: { block: Block; ctx: RenderContext }) {
  switch (block.kind) {
    case "heading":
      return <Heading block={block} ctx={ctx} />;
    case "paragraph":
      return <Paragraph block={block} ctx={ctx} />;
    case "list":
      return <List block={block} ctx={ctx} />;
    case "quote":
      return <Quote block={block} ctx={ctx} />;
    case "cta":
      return <CtaRow ctas={[block]} ctx={ctx} />;
    case "form":
      return <FormEmbed variant={block.variant} eager={ctx.eagerForms && block === ctx.firstForm} />;
    case "providerCards":
      return <ProviderCards filter={block.filter} />;
    case "locationCards":
      return <LocationCards slugs={block.slugs} />;
    case "image":
      return <ContentImage block={block} ctx={ctx} />;
    case "needs":
      return <Needs value={block.value} />;
    case "byline":
      return <Byline block={block} lastReviewed={undefined} ctx={ctx} />;
    case "embed":
      return (
        <div className="embed-slot" data-embed={block.label}>
          <Paragraph block={{ kind: "paragraph", inline: block.note }} ctx={ctx} />
        </div>
      );
    case "widget":
      return <Widget block={block} ctx={ctx} />;
  }
}

/** A quiz question line in the source copy, e.g. "Q3. Have you done...". */
const QUIZ_QUESTION_RE = /^Q\d+\.\s/;

/**
 * A widget marker mounts a component where copy would otherwise go. Copy inside
 * the marker that the component does not itself render still renders here, so
 * the page never loses a sentence the writer put in.
 *
 * The provider directory, resource library, and blog index are still fallback
 * copy only; they get wired in as their components land.
 */
function Widget({
  block,
  ctx,
}: {
  block: Extract<Block, { kind: "widget" }>;
  ctx: RenderContext;
}) {
  if (block.name === "quiz") {
    // Quiz renders the five questions itself, including a no JavaScript
    // fallback, so only the lead in copy comes from the block.
    const lead = block.blocks.filter(
      (inner) => !(inner.kind === "paragraph" && QUIZ_QUESTION_RE.test(inlineToText(inner.inline))),
    );

    return (
      <div className="widget" data-widget="quiz">
        {renderBlocks(lead, ctx)}
        <Quiz />
      </div>
    );
  }

  // The homepage lifts the hero region out of the article itself (app/page.tsx)
  // and hands it to components/hero. Rendered here, it is plain copy in order.
  return (
    <div className="widget" data-widget={block.name}>
      {renderBlocks(block.blocks, ctx)}
      {block.name === "providerDirectory" ? <ProviderDirectory /> : null}
    </div>
  );
}
