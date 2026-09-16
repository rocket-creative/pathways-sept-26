import type { Block } from "@/lib/content";
import type { RenderContext } from "../context";
import Inline from "./Inline";

export default function List({
  block,
  ctx,
}: {
  block: Extract<Block, { kind: "list" }>;
  ctx: RenderContext;
}) {
  const Tag = block.ordered ? "ol" : "ul";

  return (
    <Tag className={block.ordered ? "list list--ordered" : "list"}>
      {block.items.map((item, position) => (
        <li key={position}>
          <Inline nodes={item} ctx={ctx} />
        </li>
      ))}
    </Tag>
  );
}
