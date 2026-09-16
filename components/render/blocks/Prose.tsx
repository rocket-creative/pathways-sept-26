import type { Block } from "@/lib/content";
import type { RenderContext } from "../context";
import Inline from "./Inline";

export function Paragraph({
  block,
  ctx,
}: {
  block: Extract<Block, { kind: "paragraph" }>;
  ctx: RenderContext;
}) {
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
