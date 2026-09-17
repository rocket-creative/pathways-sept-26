/**
 * Chooses the photograph for a GridFill tile. Server side only: it reads the
 * photo registry, which the client bundle has no business carrying. The
 * result is plain data (FillPhoto) that crosses to a client component freely.
 */
import { resolvePhoto, type Focal } from "@/lib/images";
import type { FillPhoto } from "./GridFill";

/** Warm rooms, for a grid of people. */
const PROVIDER_FILLS: { asset: string; focal: Focal }[] = [
  { asset: "th-session-two-chairs", focal: "center" },
  { asset: "th-quiet-room-plant", focal: "40% 55%" },
  { asset: "cw-chair-among-plants", focal: "55% 45%" },
  { asset: "cw-warm-sunlight", focal: "50% 30%" },
];

/** The shore and the labyrinth, for a grid of offices. */
const LOCATION_FILLS: { asset: string; focal: Focal }[] = [
  { asset: "pr-beach-labyrinth", focal: "50% 62%" },
  { asset: "pr-cairn-pebble-beach", focal: "75% 55%" },
  { asset: "pr-coastal-headland", focal: "50% 60%" },
  { asset: "cw-sea-foam-stones", focal: "center" },
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
export function pickFillPhoto(pool: "providers" | "locations", seed: string): FillPhoto | undefined {
  const candidates = pool === "providers" ? PROVIDER_FILLS : LOCATION_FILLS;
  const start = hash(seed) % candidates.length;
  // Walk the ring from the seeded start so a missing build falls through to
  // the next candidate instead of dropping the tile.
  for (let step = 0; step < candidates.length; step++) {
    const pick = candidates[(start + step) % candidates.length];
    // resolvePhoto throws for an id no group declares; a decorative tile is
    // never worth a 500, so treat that the same as an unbuilt asset.
    let resolved: ReturnType<typeof resolvePhoto>;
    try {
      resolved = resolvePhoto({ asset: pick.asset, alt: "", focal: pick.focal });
    } catch {
      resolved = undefined;
    }
    if (resolved) {
      const { src, srcSet, width, height, focal } = resolved;
      return { src, srcSet, width, height, focal };
    }
  }
  return undefined;
}
