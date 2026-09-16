/**
 * GSAP, loaded off the critical path.
 *
 * Nothing here runs during render and nothing is imported statically, so the
 * library lands in its own chunk that the browser fetches after the page is
 * interactive. One promise is shared by every motion component on the page.
 *
 * ScrollTrigger is deliberately absent: the content site triggers on
 * IntersectionObserver, which is native, cheaper, and cannot hijack a scroll.
 * The homepage prototype keeps its own ScrollTrigger import.
 *
 * OWNER: design system agent.
 */

export type Gsap = typeof import("gsap")["gsap"];

let pending: Promise<Gsap> | null = null;

/** Resolves with the gsap instance. Rejects if the chunk cannot be fetched. */
export function loadGsap(): Promise<Gsap> {
  pending ??= import("gsap").then((mod) => mod.gsap ?? mod.default);
  return pending;
}

/** True when the reader has asked the operating system for less movement. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * True when any part of the element is already on screen, give or take a
 * tenth of a viewport. Anything a reader can already see is left at its
 * resting state: we never hide something to animate it back.
 */
export function isOnScreen(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewport * 0.9 && rect.bottom > 0;
}
