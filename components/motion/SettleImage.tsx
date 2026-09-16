"use client";

import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import { useSettleIn, type SettleOptions } from "./useSettleIn";

export type SettleImageProps = SettleOptions &
  Omit<HTMLAttributes<HTMLElement>, "children"> & {
    children: ReactNode;
    /** figure by default, so a caption can travel with the image. */
    as?: "figure" | "div" | "span" | "li";
  };

/**
 * An image that settles a beat behind the words around it.
 *
 * Same contract as Reveal: the picture is on the page at full opacity from
 * the first paint, and it only moves if GSAP has loaded while the figure is
 * still below the fold. Longer travel, longer duration and a 2% scale give
 * the weight difference; because it is all transform, the image's reserved
 * box never changes and the width and height attributes still hold the
 * layout.
 *
 *   <SettleImage className="content-image">
 *     <img src="/images/room.webp" alt="…" width={1280} height={853} />
 *     <figcaption>…</figcaption>
 *   </SettleImage>
 */
export default function SettleImage({
  children,
  as = "figure",
  className,
  y = 34,
  x,
  scaleFrom = 1.02,
  fade,
  duration = 0.95,
  delay = 0.08,
  stagger,
  ease = "power2.out",
  rootMargin,
  disabled,
  ...rest
}: SettleImageProps) {
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
