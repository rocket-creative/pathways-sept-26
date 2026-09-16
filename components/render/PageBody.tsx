import type { ReactNode } from "react";
import type { Block, Page } from "@/lib/content";
import LocationCards from "@/components/directory/LocationCards";
import ProviderCards from "@/components/directory/ProviderCards";
import type { RenderContext } from "./context";
import Byline, { type BylineBlock } from "./blocks/Byline";
import ContentImage from "./blocks/ContentImage";
import CtaRow, { type CtaBlock } from "./blocks/Cta";
import FormEmbed from "./blocks/FormEmbed";
import Heading, { type HeadingBlock } from "./blocks/Heading";
import List from "./blocks/List";
import Needs from "./blocks/Needs";
import { Paragraph, Quote } from "./blocks/Prose";
import "./render.css";

/**
 * Renders the parsed block model. Copy is never altered here: the parser in
 * lib/content.ts decides what a block is, this decides what it looks like.
 *
 * Everything below the article is server rendered and fully visible on load.
 * No accordion, no tab, no disclosure: the FAQ answers are in the DOM.
 *
 * OWNER: renderer agent.
 */
export default function PageBody({ page }: { page: Page }) {
  const ctx: RenderContext = {
    source: `${page.frontMatter.url} (${page.sourceFile})`,
    url: page.frontMatter.url,
    eagerForms: page.frontMatter.url === "/contact",
    firstForm: page.blocks.find((block) => block.kind === "form") ?? null,
  };

  const { sections, bylines } = groupSections(page.blocks);

  return (
    <article className="prose">
      {sections.map((section, position) =>
        section.heading ? (
          <section
            key={position}
            className="page-section"
            aria-labelledby={section.heading.id}
            data-section={section.heading.id}
          >
            <Heading block={section.heading} ctx={ctx} />
            {renderSectionBody(section.heading, section.blocks, ctx)}
          </section>
        ) : (
          <section key={position} className="page-section page-section--intro">
            {renderBlocks(section.blocks, ctx)}
          </section>
        ),
      )}

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
      return <ContentImage block={block} />;
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

/**
 * A widget marker mounts a component where copy would otherwise go. The copy
 * inside the marker is the no JavaScript fallback and always renders, so the
 * interactive version layers on top rather than replacing the document.
 *
 * The quiz and the provider directory are owned by other agents and get wired
 * in at integration; until then the fallback copy is the whole experience.
 */
function Widget({
  block,
  ctx,
}: {
  block: Extract<Block, { kind: "widget" }>;
  ctx: RenderContext;
}) {
  return (
    <div className="widget" data-widget={block.name}>
      {renderBlocks(block.blocks, ctx)}
    </div>
  );
}
