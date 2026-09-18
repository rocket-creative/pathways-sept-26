/**
 * Cuts the close up each stacked hero card carries: the piece of image 1
 * (the branch render) the card lands on when the hero is pinned.
 *
 *   npm run hero-crops            build what is missing or out of date
 *   npm run hero-crops -- --force rebuild everything
 *
 * Reads   public/branch-16368.webp            (largest branch tier)
 *         components/hero/anchors.ts          (ANCHORS, STOP_PHOTO)
 * Writes  public/images/hero/stop-{n}-{w}.webp
 *
 * The geometry lives in anchors.ts next to the anchors themselves, so a
 * moved anchor moves its crop on the next run. The `sharp` used here ships
 * inside next; nothing new is installed.
 */
import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

register(new URL("./alias-hook.mjs", import.meta.url));
const { ANCHORS, STOP_PHOTO } = (await import("../components/hero/anchors.ts")) as {
  ANCHORS: { sx: number; sy: number }[];
  STOP_PHOTO: { window: number; aspect: number; anchorY: number; widths: readonly number[]; dir: string };
};

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "public", "branch-16368.webp");
const OUT = path.join(ROOT, "public", STOP_PHOTO.dir);
const WEBP = { quality: 82, effort: 5, smartSubsample: true } as const;
const force = process.argv.includes("--force");
const self = fileURLToPath(import.meta.url);
const anchorsFile = path.join(ROOT, "components", "hero", "anchors.ts");

if (!fs.existsSync(SOURCE)) throw new Error(`Branch render not found: ${path.relative(ROOT, SOURCE)}`);
fs.mkdirSync(OUT, { recursive: true });

/** Rebuild when the output is missing or older than the render, the anchors, or this script. */
function stale(out: string): boolean {
  if (force || !fs.existsSync(out)) return true;
  const built = fs.statSync(out).mtimeMs;
  return [SOURCE, anchorsFile, self].some((dep) => fs.statSync(dep).mtimeMs > built);
}

const meta = await sharp(SOURCE, { limitInputPixels: false }).metadata();
const W = meta.width ?? 0;
const H = meta.height ?? 0;
if (!W || !H) throw new Error("Could not read the branch render's dimensions");

const cropW = Math.round(W * STOP_PHOTO.window);
const cropH = Math.round(cropW / STOP_PHOTO.aspect);
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

let written = 0;
for (const [index, anchor] of ANCHORS.entries()) {
  const left = clamp(Math.round(anchor.sx * W - cropW / 2), 0, W - cropW);
  const top = clamp(Math.round(anchor.sy * H - cropH * STOP_PHOTO.anchorY), 0, H - cropH);
  for (const width of STOP_PHOTO.widths) {
    const out = path.join(OUT, `stop-${index + 1}-${width}.webp`);
    if (!stale(out)) continue;
    await sharp(SOURCE, { limitInputPixels: false })
      .extract({ left, top, width: cropW, height: cropH })
      .resize({ width, withoutEnlargement: true })
      .webp(WEBP)
      .toFile(out);
    written += 1;
  }
}

console.log(`hero crops: ${written} file(s) written to ${path.relative(ROOT, OUT)} (${ANCHORS.length} stops × ${STOP_PHOTO.widths.length} tiers)`);
