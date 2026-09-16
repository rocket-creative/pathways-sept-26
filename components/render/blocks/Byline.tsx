import { Fragment, type ReactNode } from "react";
import type { Block, InlineNode } from "@/lib/content";
import type { RenderContext } from "../context";
import Inline from "./Inline";

export type BylineBlock = Extract<Block, { kind: "byline" }>;

/** "September 16, 2026" inside the last sentence of the author block. */
const WRITTEN_DATE = /\b([A-Z][a-z]+\s+\d{1,2},\s+\d{4})\b/;

/**
 * "**Written by** X. **Clinically reviewed by** Y. **Last reviewed** Month D,
 * YYYY." The names already link to provider pages in the copy, so the only
 * thing added here is a machine readable date from the front matter.
 */
export default function Byline({
  block,
  lastReviewed,
  ctx,
}: {
  block: BylineBlock;
  lastReviewed: unknown;
  ctx: RenderContext;
}) {
  const iso = isoDate(lastReviewed);

  return (
    <footer className="byline">
      <p className="byline__line">{withDateElement(block.inline, iso, ctx)}</p>
    </footer>
  );
}

function withDateElement(nodes: InlineNode[], iso: string | null, ctx: RenderContext): ReactNode {
  if (!iso) return <Inline nodes={nodes} ctx={ctx} />;

  let wrapped = false;

  return nodes.map((node, position) => {
    const match = node.kind === "text" && !wrapped ? WRITTEN_DATE.exec(node.value) : null;
    if (!match || node.kind !== "text") {
      return (
        <Fragment key={position}>
          <Inline nodes={[node]} ctx={ctx} />
        </Fragment>
      );
    }

    wrapped = true;
    const start = match.index;
    const end = start + match[0].length;

    return (
      <Fragment key={position}>
        {node.value.slice(0, start)}
        <time dateTime={iso}>{match[0]}</time>
        {node.value.slice(end)}
      </Fragment>
    );
  });
}

/**
 * YAML turns an unquoted `last_reviewed: 2026-09-16` into a Date, so the
 * declared string type is not what always arrives here.
 */
function isoDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
    if (match) return match[1];
  }

  return null;
}
