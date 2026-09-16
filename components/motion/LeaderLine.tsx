"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { isOnScreen, loadGsap, prefersReducedMotion } from "./gsapRuntime";

export type LeaderLineProps = {
  children: ReactNode;
  /** vertical draws down into the callout, horizontal draws in from the left. */
  orientation?: "vertical" | "horizontal";
  className?: string;
  /** Seconds. */
  duration?: number;
  /** Seconds. */
  delay?: number;
};

const GEOMETRY = {
  vertical: { viewBox: "0 0 2 64", d: "M1 0.6 L1 61", cx: 1, cy: 62.4 },
  horizontal: { viewBox: "0 0 64 2", d: "M0.6 1 L61 1", cx: 62.4, cy: 1 },
} as const;

/**
 * A thin leader line that draws itself into a callout, the same gesture the
 * homepage prototype uses on the branch.
 *
 *   <LeaderLine orientation="vertical">
 *     <p className="lede">Your Welcome Team member stays your contact.</p>
 *   </LeaderLine>
 *
 * The line is fully drawn in the markup. The dash is applied by JavaScript
 * only after GSAP has loaded and only while the line is off screen, so with
 * scripting off, with reduced motion on, or if the chunk fails, the reader
 * sees a finished line rather than a missing one. The SVG has a fixed CSS
 * size, so nothing around it moves while it draws.
 */
export default function LeaderLine({
  children,
  orientation = "vertical",
  className,
  duration = 0.7,
  delay = 0,
}: LeaderLineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!root || !path || !dot || prefersReducedMotion()) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (isOnScreen(root)) return;

    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let reset: (() => void) | undefined;

    loadGsap()
      .then((gsap) => {
        if (cancelled || isOnScreen(root)) return;

        // pathLength="1" in the markup means the dash maths needs no measuring.
        gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(dot, { opacity: 0 });

        reset = () => {
          gsap.killTweensOf([path, dot]);
          gsap.set([path, dot], {
            clearProps: "strokeDasharray,strokeDashoffset,opacity",
          });
        };

        observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer?.disconnect();
            gsap
              .timeline({ delay })
              .to(path, {
                strokeDashoffset: 0,
                duration,
                ease: "power2.inOut",
              })
              .to(dot, { opacity: 1, duration: 0.25 }, duration * 0.8);
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0 },
        );

        observer.observe(root);
      })
      .catch(() => {
        // No GSAP, no dash: the line stays drawn.
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      reset?.();
    };
  }, [duration, delay]);

  const geometry = GEOMETRY[orientation];

  return (
    <div
      ref={rootRef}
      className={["leader", `leader--${orientation}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        className="leader__line"
        viewBox={geometry.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={pathRef}
          className="leader__path"
          d={geometry.d}
          pathLength={1}
        />
        <circle
          ref={dotRef}
          className="leader__dot"
          cx={geometry.cx}
          cy={geometry.cy}
          r={1.4}
        />
      </svg>
      <div className="leader__body">{children}</div>
    </div>
  );
}
