/**
 * Chooses the photograph for a GridFill tile. Server side only: it reads the
 * photo registry, which the client bundle has no business carrying. The
 * result is plain data (FillPhoto) that crosses to a client component freely.
 */
import { resolvePhoto, type Focal } from "@/lib/images";
import type { FillPhoto } from "./GridFill";

/** Session portraits and rooms, for the empty cells of a people grid. */
const PROVIDER_FILLS: { asset: string; focal: Focal }[] = [
  { asset: "th-ap26-green-quiet", focal: "center" },
  { asset: "th-ap26-couple", focal: "center" },
  { asset: "th-ap26-fam-child", focal: "center" },
  { asset: "th-ap26-kids-three", focal: "center" },
  { asset: "pr-ap-gc-therapy-joy", focal: "45% 50%" },
  { asset: "ha-ap-therapy-massapequa", focal: "center" },
  { asset: "cw-ap26-med-couples", focal: "center" },
  { asset: "pr-ap-pj-teal-room", focal: "center" },
];

/** Approved office interiors, for the empty cells of an office grid. */
const LOCATION_FILLS: { asset: string; focal: Focal }[] = [
  { asset: "pr-ap-desk-logo", focal: "50% 40%" },
  { asset: "pr-ap-smt-plants-room", focal: "center" },
  { asset: "pr-ap-smt-waiting", focal: "50% 45%" },
  { asset: "pr-ap-gc-flower-wall", focal: "center" },
  { asset: "pr-ap-mpq-underwater", focal: "center" },
  { asset: "pr-ap-pj-pink-room", focal: "center" },
  { asset: "pr-ap-gc-wellness-navy", focal: "center" },
  { asset: "pr-ap-smt-dreamcatcher", focal: "center" },
];

/** Small deterministic hash so the same page always gets the same picture. */
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Pick and resolve the tile's photograph. Returns undefined when no
 * candidate's tiers have been built, in which case the grid simply keeps its
 * empty cell rather than shipping a broken image.
 */
function resolveFill(asset: string, focal: Focal): FillPhoto | undefined {
  try {
    const resolved = resolvePhoto({ asset, alt: "", focal });
    if (!resolved) return undefined;
    const { src, srcSet, width, height } = resolved;
    return { src, srcSet, width, height, focal: resolved.focal };
  } catch {
    return undefined;
  }
}

/** One photograph, for callers that still expect a single frame. */
export function pickFillPhoto(pool: "providers" | "locations", seed: string): FillPhoto | undefined {
  return pickFillPhotos(pool, seed)[0];
}

/** Four frames for the circle bento that closes a card grid's last row. */
export function pickFillPhotos(pool: "providers" | "locations", seed: string): FillPhoto[] {
  const candidates = pool === "providers" ? PROVIDER_FILLS : LOCATION_FILLS;
  const start = hash(seed) % candidates.length;
  const photos: FillPhoto[] = [];
  for (let step = 0; step < candidates.length && photos.length < 4; step++) {
    const pick = candidates[(start + step) % candidates.length];
    const resolved = resolveFill(pick.asset, pick.focal);
    if (resolved) photos.push(resolved);
  }
  return photos;
}
