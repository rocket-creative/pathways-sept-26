import type { Block } from "@/lib/content";
import type { RenderContext } from "../context";
import { promoteListItemLinks, type PromotedLink } from "../promoteLinks";
import { PromotedCtaRow } from "./Cta";
import Inline from "./Inline";

/**
 * Link-only list items promote to quiet buttons. Consecutive ones share one
 * row so "family therapy" and "individual therapy" sit side by side.
 */
export default function List({
  block,
  ctx,
}: {
  block: Extract<Block, { kind: "list" }>;
  ctx: RenderContext;
}) {
  const promoted = block.items.map((item) => promoteListItemLinks(item));
  if (promoted.length && promoted.every((link): link is PromotedLink => Boolean(link))) {
    return <PromotedCtaRow links={promoted} ctx={ctx} />;
  }

  const Tag = block.ordered ? "ol" : "ul";
  const nodes = [];
  let index = 0;

  while (index < block.items.length) {
    const lone = promoted[index];
    if (lone) {
      const links: PromotedLink[] = [];
      const start = index;
      while (index < block.items.length) {
        const next = promoted[index];
        if (!next) break;
        links.push(next);
        index += 1;
      }
      nodes.push(
        <li key={`cta-${start}`} className="list__cta">
          <PromotedCtaRow links={links} ctx={ctx} />
        </li>,
      );
      continue;
    }

    nodes.push(
      <li key={index}>
        <Inline nodes={block.items[index]} ctx={ctx} />
      </li>,
    );
    index += 1;
  }

  return (
    <Tag className={block.ordered ? "list list--ordered" : "list"}>{nodes}</Tag>
  );
}
