import { inlineToText, type Block, type InlineNode } from "@/lib/content";
import type { RenderContext } from "../context";
import { promoteParagraphLinks } from "../promoteLinks";
import { PromotedCtaRow } from "./Cta";
import Inline from "./Inline";

/** The notice that closes a service, concern, or quiz card. Posted as its own paragraph. */
const CRISIS_LINE =
  "If you are in crisis or thinking about harming yourself, call or text 988 (Veterans: press 1) or call 911.";

export function isCrisisLine(nodes: InlineNode[]): boolean {
  return inlineToText(nodes).replace(/\s+/g, " ").trim() === CRISIS_LINE;
}

export function Paragraph({
  block,
  ctx,
}: {
  block: Extract<Block, { kind: "paragraph" }>;
  ctx: RenderContext;
}) {
  const promoted = promoteParagraphLinks(block.inline);

  if (promoted.kind === "link-row") {
    return <PromotedCtaRow links={promoted.links} ctx={ctx} />;
  }

  if (promoted.kind === "split") {
    return (
      <>
        {promoted.prose.length ? (
          <p>
            <Inline nodes={promoted.prose} ctx={ctx} />
          </p>
        ) : null}
        <PromotedCtaRow links={[promoted.link]} ctx={ctx} />
      </>
    );
  }

  const crisis = isCrisisLine(block.inline);

  return (
    <p className={crisis ? "crisis-line" : undefined}>
      <Inline nodes={block.inline} ctx={ctx} />
    </p>
  );
}

export function Quote({
  block,
  ctx,
}: {
  block: Extract<Block, { kind: "quote" }>;
  ctx: RenderContext;
}) {
  return (
    <blockquote>
      {block.paragraphs.map((nodes, position) => (
        <p key={position}>
          <Inline nodes={nodes} ctx={ctx} />
        </p>
      ))}
    </blockquote>
  );
}
