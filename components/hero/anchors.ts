/**
 * Where each hero stop sits on the branch render (image 1) when the hero is
 * pinned. `sx` / `sy` are fractions of the image's width and height and mark
 * the anchor dot; `place` says which side of the anchor the card hangs on.
 *
 * Copy never lives here. The stops themselves come from content/pages/home.md;
 * this only decides where the supplied cards land on the artwork. Anything
 * past the fifth anchor is spaced evenly along the remaining branch.
 */
export interface Anchor {
  sx: number;
  sy: number;
  place: "above" | "below";
}

export const ANCHORS: Anchor[] = [
  { sx: 0.15, sy: 0.415, place: "below" }, // the cairn
  { sx: 0.362, sy: 0.52, place: "above" }, // the tide pool
  { sx: 0.503, sy: 0.535, place: "above" }, // the labyrinth
  { sx: 0.653, sy: 0.395, place: "below" }, // the seated figure
  { sx: 0.828, sy: 0.41, place: "below" }, // the standing figure
];

export function anchorFor(index: number, total: number): Anchor {
  if (index < ANCHORS.length) return ANCHORS[index];
  const remaining = Math.max(total - ANCHORS.length, 1);
  const step = (0.95 - 0.85) / remaining;
  return { sx: 0.85 + step * (index - ANCHORS.length + 1), sy: 0.41, place: "below" };
}

/** Image 1, the branch render. Same tiers as lib/stops.ts so the head preload matches. */
export { BRANCH } from "@/lib/stops";

/**
 * Image 2, the labyrinth close up the rest of the site sits on. Never
 * preloaded in <head>. Same tiers as the inner-page backdrop.
 */
export { LABYRINTH as HANDOFF_IMAGE } from "@/lib/backdropImage";
