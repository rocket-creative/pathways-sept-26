import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type { InlineNode } from "@/lib/content";
import { assertInternalHref, isExternalUrl, isNonHttpScheme, type RenderContext } from "../context";
import Needs from "./Needs";

export default function Inline({ nodes, ctx }: { nodes: InlineNode[]; ctx: RenderContext }) {
  return (
    <>
      {nodes.map((node, position) => (
        <Fragment key={position}>{renderInline(node, ctx)}</Fragment>
      ))}
    </>
  );
}

function renderInline(node: InlineNode, ctx: RenderContext): ReactNode {
  switch (node.kind) {
    case "text":
      return node.value;
    case "strong":
      return (
        <strong>
          <Inline nodes={node.children} ctx={ctx} />
        </strong>
      );
    case "em":
      return (
        <em>
          <Inline nodes={node.children} ctx={ctx} />
        </em>
      );
    case "code":
      return <code>{node.value}</code>;
    case "needs":
      return <Needs value={node.value} />;
    case "link":
      return <InlineLink node={node} ctx={ctx} />;
  }
}

function InlineLink({
  node,
  ctx,
}: {
  node: Extract<InlineNode, { kind: "link" }>;
  ctx: RenderContext;
}) {
  const children = <Inline nodes={node.children} ctx={ctx} />;

  if (isExternalUrl(node.href)) {
    return (
      <a href={node.href} rel="noopener">
        {children}
      </a>
    );
  }

  if (isNonHttpScheme(node.href)) {
    return <a href={node.href}>{children}</a>;
  }

  const href = assertInternalHref(node.href, ctx);
  if (href.startsWith("#")) {
    return <a href={href}>{children}</a>;
  }

  return <Link href={href}>{children}</Link>;
}
