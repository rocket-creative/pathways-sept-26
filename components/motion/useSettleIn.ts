"use client";

import { useEffect, useRef, type RefObject } from "react";
import { isOnScreen, loadGsap, prefersReducedMotion } from "./gsapRuntime";

/**
 * The one piece of animation logic on the content site. Everything in
 * components/motion is a thin wrapper around it.
 *
 * The contract, in order of importance:
 *
 *  1. The markup's resting state is the readable state. Nothing is hidden in
 *     CSS, so the page reads with JavaScript off, before hydration, and if
 *     this chunk or GSAP itself never arrives.
 *  2. An element is only moved off its resting state once GSAP has loaded and
 *     only while it is off screen. A reader never watches text disappear.
 *  3. Transform and opacity only. No property here can reflow the page, so
 *     the animation cannot contribute to CLS.
 *  4. prefers-reduced-motion: reduce exits before the DOM is touched.
 */
export type SettleOptions = {
  /** Vertical travel in px. Positive drops the element in from below. */
  y?: number;
  /** Horizontal travel in px. */
  x?: number;
  /** Starting scale. 1 keeps the footprint exact; images use ~1.02. */
  scaleFrom?: number;
  /** Fade as well as move. Off screen only, so never a visible flash. */
  fade?: boolean;
  /** Seconds. */
  duration?: number;
  /** Seconds. */
  delay?: number;
  /** Seconds between children. Above 0 the children animate, not the box. */
  stagger?: number;
  /** Any GSAP ease string. */
  ease?: string;
  /** IntersectionObserver rootMargin. Negative bottom starts it later. */
  rootMargin?: string;
  /** Skip the animation entirely, e.g. behind a feature flag. */
  disabled?: boolean;
};

export const SETTLE_DEFAULTS = {
  y: 18,
  x: 0,
  scaleFrom: 1,
  fade: true,
  duration: 0.62,
  delay: 0,
  stagger: 0,
  ease: "power2.out",
  rootMargin: "0px 0px -8% 0px",
} as const;

export function useSettleIn<T extends HTMLElement>(
  options: SettleOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);

  const {
    y = SETTLE_DEFAULTS.y,
    x = SETTLE_DEFAULTS.x,
    scaleFrom = SETTLE_DEFAULTS.scaleFrom,
    fade = SETTLE_DEFAULTS.fade,
    duration = SETTLE_DEFAULTS.duration,
    delay = SETTLE_DEFAULTS.delay,
    stagger = SETTLE_DEFAULTS.stagger,
    ease = SETTLE_DEFAULTS.ease,
    rootMargin = SETTLE_DEFAULTS.rootMargin,
    disabled = false,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled || prefersReducedMotion()) return;
    if (typeof IntersectionObserver === "undefined") return;

    const targets: Element[] =
      stagger > 0 ? Array.from(element.children) : [element];
    if (!targets.length) return;

    // Already readable. Leave it exactly as the server rendered it.
    if (isOnScreen(element)) return;

    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let reset: (() => void) | undefined;

    loadGsap()
      .then((gsap) => {
        // The reader may have scrolled during the load. Check again.
        if (cancelled || isOnScreen(element)) return;

        gsap.set(targets, {
          y,
          x,
          scale: scaleFrom,
          opacity: fade ? 0 : 1,
          willChange: "transform, opacity",
        });

        reset = () => {
          gsap.killTweensOf(targets);
          gsap.set(targets, { clearProps: "transform,opacity,willChange" });
        };

        observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer?.disconnect();
            gsap.to(targets, {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration,
              delay,
              stagger,
              ease,
              overwrite: "auto",
              clearProps: "willChange",
            });
          },
          { rootMargin, threshold: 0 },
        );

        observer.observe(element);
      })
      .catch(() => {
        // GSAP never arrived. The element is still at its resting state,
        // which is the readable one, so there is nothing to undo.
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      reset?.();
    };
  }, [
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
  ]);

  return ref;
}
