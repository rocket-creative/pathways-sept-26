/**
 * Motion for the content site. GSAP, deferred, small, and safe to omit.
 *
 *   import { Reveal, SettleImage, LeaderLine } from "@/components/motion";
 *
 * Every component here renders its children at their resting, readable state
 * and only animates when GSAP has loaded, the element is still off screen,
 * and the reader has not asked for reduced motion. Transform and opacity
 * only, so none of it can shift the layout.
 *
 * OWNER: design system agent.
 */

export { default as Reveal } from "./Reveal";
export type { RevealProps, RevealTag } from "./Reveal";

export { default as SettleImage } from "./SettleImage";
export type { SettleImageProps } from "./SettleImage";

export { default as LeaderLine } from "./LeaderLine";
export type { LeaderLineProps } from "./LeaderLine";

export { useSettleIn, SETTLE_DEFAULTS } from "./useSettleIn";
export type { SettleOptions } from "./useSettleIn";

export { useReducedMotion } from "./useReducedMotion";
export { loadGsap, prefersReducedMotion } from "./gsapRuntime";
export type { Gsap } from "./gsapRuntime";
