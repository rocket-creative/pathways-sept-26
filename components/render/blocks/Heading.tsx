import type { Block } from "@/lib/content";
import type { RenderContext } from "../context";
import Inline from "./Inline";

export type HeadingBlock = Extract<Block, { kind: "heading" }>;

/**
 * The single `#` is the page h1. Everything below it carries the slug id the
 * parser computed, so "read more" deep links and section labelling both work.
 */
export default function Heading({ block, ctx }: { block: HeadingBlock; ctx: RenderContext }) {
  const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4";

  return (
    <Tag id={block.level > 1 ? block.id : undefined} className={`heading heading--${Tag}`}>
      <Inline nodes={block.inline} ctx={ctx} />
    </Tag>
  );
}
