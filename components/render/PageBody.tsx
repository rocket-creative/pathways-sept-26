import { Fragment } from "react";
import Link from "next/link";
import { FORM_EMBEDS, type Block, type InlineNode, type Page } from "@/lib/content";
import LocationCards from "@/components/directory/LocationCards";
import ProviderCards from "@/components/directory/ProviderCards";

/**
 * Renders the parsed block model. Copy is never altered here: the parser in
 * lib/content.ts decides what a block is, this decides what it looks like.
 *
 * OWNER: renderer agent.
 */
export default function PageBody({ page }: { page: Page }) {
  return (
    <article className="prose">
      {page.blocks.map((block, position) => (
        <RenderBlock key={position} block={block} />
      ))}
    </article>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "heading": {
      const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4";
      return (
        <Tag id={block.level > 1 ? block.id : undefined}>
          <Inline nodes={block.inline} />
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p>
          <Inline nodes={block.inline} />
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag>
          {block.items.map((item, position) => (
            <li key={position}>
              <Inline nodes={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote>
          <Inline nodes={block.inline} />
        </blockquote>
      );
    case "cta":
      return (
        <p className="cta">
          <Link href={block.href} className="button">
            {block.label}
          </Link>
        </p>
      );
    case "form":
      return (
        <iframe
          className="form-embed"
          src={FORM_EMBEDS[block.variant]}
          title={`${block.variant === "therapy" ? "Therapy" : "Wellness"} intake form`}
          loading="lazy"
        />
      );
    case "providerCards":
      return <ProviderCards filter={block.filter} />;
    case "locationCards":
      return <LocationCards slugs={block.slugs} />;
    case "image":
      return (
        <figure className="content-image">
          {block.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={block.alt} loading="lazy" />
          ) : (
            <div className="content-image__placeholder" role="img" aria-label={block.alt} />
          )}
          <figcaption>{block.alt}</figcaption>
        </figure>
      );
    case "needs":
      return <Needs value={block.value} />;
    case "byline":
      return (
        <p className="byline">
          <Inline nodes={block.inline} />
        </p>
      );
  }
}

/** Gaps the client still owes: visible in dev, inert in production. */
function Needs({ value }: { value: string }) {
  if (process.env.NODE_ENV === "production") {
    return <span data-needs={value} hidden />;
  }
  return <mark className="needs">[NEEDS: {value}]</mark>;
}

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, position) => (
        <Fragment key={position}>{renderInline(node)}</Fragment>
      ))}
    </>
  );
}

function renderInline(node: InlineNode) {
  switch (node.kind) {
    case "text":
      return node.value;
    case "strong":
      return (
        <strong>
          <Inline nodes={node.children} />
        </strong>
      );
    case "em":
      return (
        <em>
          <Inline nodes={node.children} />
        </em>
      );
    case "code":
      return <code>{node.value}</code>;
    case "needs":
      return <Needs value={node.value} />;
    case "link":
      return node.external ? (
        <a href={node.href} rel="noopener">
          <Inline nodes={node.children} />
        </a>
      ) : (
        <Link href={node.href}>
          <Inline nodes={node.children} />
        </Link>
      );
  }
}
