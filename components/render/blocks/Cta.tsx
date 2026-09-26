import Link from "next/link";
import type { Block } from "@/lib/content";
import { assertInternalHref, isExternalUrl, isNonHttpScheme, type RenderContext } from "../context";
import type { PromotedLink } from "../promoteLinks";

export type CtaBlock = Extract<Block, { kind: "cta" }>;

/**
 * Consecutive `[CTA]` markers belong in one row of buttons rather than a stack
 * of one button paragraphs. Promoted prose links reuse the same row with the
 * quiet (outline) variant so primary intake CTAs stay visually primary.
 */
export default function CtaRow({
  ctas,
  ctx,
  quiet = false,
}: {
  ctas: CtaBlock[];
  ctx: RenderContext;
  quiet?: boolean;
}) {
  return (
    <div className={ctaClassName(ctas.length, quiet)}>
      {ctas.map((cta, position) => (
        <CtaButton key={position} label={cta.label} href={cta.href} ctx={ctx} quiet={quiet} />
      ))}
    </div>
  );
}

/** Same pill row for links promoted out of prose (Explore, Browse, concern strips). */
export function PromotedCtaRow({
  links,
  ctx,
  quiet = true,
}: {
  links: PromotedLink[];
  ctx: RenderContext;
  quiet?: boolean;
}) {
  return (
    <div className={ctaClassName(links.length, quiet)}>
      {links.map((link) => (
        <CtaButton key={`${link.href}:${link.label}`} label={link.label} href={link.href} ctx={ctx} quiet={quiet} />
      ))}
    </div>
  );
}

/** Layout modifier from count: one pill, a paired row, or an equal-cell strip. */
function ctaClassName(count: number, quiet: boolean): string {
  const parts = ["cta"];
  if (quiet) parts.push("cta--quiet");
  if (count >= 3) parts.push("cta--strip");
  else if (count === 2) parts.push("cta--pair");
  return parts.join(" ");
}

function CtaButton({
  label,
  href,
  ctx,
  quiet,
}: {
  label: string;
  href: string;
  ctx: RenderContext;
  quiet: boolean;
}) {
  const className = quiet ? "button button--quiet" : "button";

  if (isExternalUrl(href)) {
    return (
      <a className={className} href={href} rel="noopener">
        {label}
      </a>
    );
  }

  if (isNonHttpScheme(href)) {
    return (
      <a className={className} href={href}>
        {label}
      </a>
    );
  }

  const resolved = assertInternalHref(href, ctx);
  if (resolved.startsWith("#")) {
    return (
      <a className={className} href={resolved}>
        {label}
      </a>
    );
  }

  return (
    <Link className={className} href={resolved}>
      {label}
    </Link>
  );
}
