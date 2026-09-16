import Link from "next/link";
import type { Block } from "@/lib/content";
import { assertInternalHref, isExternalUrl, isNonHttpScheme, type RenderContext } from "../context";

export type CtaBlock = Extract<Block, { kind: "cta" }>;

/**
 * Consecutive `[CTA]` markers belong in one row of buttons rather than a stack
 * of one button paragraphs.
 */
export default function CtaRow({ ctas, ctx }: { ctas: CtaBlock[]; ctx: RenderContext }) {
  return (
    <div className="cta">
      {ctas.map((cta, position) => (
        <CtaButton key={position} cta={cta} ctx={ctx} />
      ))}
    </div>
  );
}

function CtaButton({ cta, ctx }: { cta: CtaBlock; ctx: RenderContext }) {
  if (isExternalUrl(cta.href)) {
    return (
      <a className="button" href={cta.href} rel="noopener">
        {cta.label}
      </a>
    );
  }

  if (isNonHttpScheme(cta.href)) {
    return (
      <a className="button" href={cta.href}>
        {cta.label}
      </a>
    );
  }

  const href = assertInternalHref(cta.href, ctx);
  if (href.startsWith("#")) {
    return (
      <a className="button" href={href}>
        {cta.label}
      </a>
    );
  }

  return (
    <Link className="button" href={href}>
      {cta.label}
    </Link>
  );
}
