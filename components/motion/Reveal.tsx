"use client";

import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import { useSettleIn, type SettleOptions } from "./useSettleIn";

/** Elements a reveal is allowed to render as. Keeps the markup semantic. */
export type RevealTag =
  | "div"
  | "span"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "figure"
  | "ul"
  | "ol"
  | "li"
  | "p";

export type RevealProps = SettleOptions &
  Omit<HTMLAttributes<HTMLElement>, "children"> & {
    children: ReactNode;
    /** Defaults to div. Use section/li/figure to keep the outline honest. */
    as?: RevealTag;
  };

/**
 * Content drops in as it comes into view.
 *
 * Wrap it around anything, including server rendered children: the children
 * stay server components, only the wrapper is a client component.
 *
 *   <Reveal as="section" className="section">
 *     <h2>How care works here</h2>
 *     <p>…</p>
 *   </Reveal>
 *
 * With `stagger`, the direct children animate one after another instead of
 * the wrapper moving as a block:
 *
 *   <Reveal as="ul" className="card-grid" stagger={0.08}>
 *     {items.map((item) => <li key={item.slug}>…</li>)}
 *   </Reveal>
 *
 * Anything already on screen when GSAP finishes loading is never touched, so
 * the top of a page never animates and never flashes.
 */
export default function Reveal({
  children,
  as = "div",
  className,
  y,
  x,
  scaleFrom,
  fade,
  duration,
  delay,
  stagger,
  ease,
  rootMargin,
  disabled,
  ...rest
}: RevealProps) {
  const ref = useSettleIn<HTMLElement>({
    y,
    x,
    scaleFrom,
    fade,
    duration,
    delay,
    stagger,
    ease,
    rootMargin,
    disabled,
  });

  const Tag = as as ElementType;

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className} {...rest}>
      {children}
    </Tag>
  );
}
