import type { Block } from "@/lib/content";
import type { RenderContext } from "../context";
import { promoteParagraphLinks } from "../promoteLinks";
import { PromotedCtaRow } from "./Cta";
import Inline from "./Inline";

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

  return (
    <p>
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
