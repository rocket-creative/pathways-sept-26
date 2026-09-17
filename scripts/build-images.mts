/**
 * Cuts responsive WebP tiers for every photograph the registry declares.
 *
 *   npm run images            build what is missing or out of date
 *   npm run images -- --force rebuild everything
 *   npm run images -- --prune also delete tiers whose id is no longer declared
 *
 * Reads   images/pathwayswithin-images/**   (old site export, never served)
 * Writes  public/images/photos/{id}-{w}.webp
 *         public/images/providers/{slug}-{w}.webp   (square, for the circle mask)
 *         lib/images/generated.json               (intrinsic sizes, read by lib/images)
 *
 * The `sharp` used here ships inside next; nothing new is installed.
 */
import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import type { AssetSource, GeneratedAsset, GeneratedManifest, GeneratedTier, HeadshotSource, ImageGroup } from "../lib/images/types.ts";

// The registry files import each other through the `@/` alias like the app does.
register(new URL("./alias-hook.mjs", import.meta.url));
const { GROUPS } = (await import("../lib/images/groups/index.ts")) as { GROUPS: ImageGroup[] };
const { HEADSHOTS } = (await import("../lib/images/groups/providers.ts")) as { HEADSHOTS: HeadshotSource[] };

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOT = path.join(ROOT, "images", "pathwayswithin-images");
const PHOTO_OUT = path.join(ROOT, "public", "images", "photos");
const HEADSHOT_OUT = path.join(ROOT, "public", "images", "providers");
const MANIFEST = path.join(ROOT, "lib", "images", "generated.json");

/** Tier widths. A source narrower than a tier stops at its own width. */
const PHOTO_WIDTHS = [640, 960, 1280, 1600, 2000];
const SQUARE_WIDTHS = [480, 800, 1200];
const HEADSHOT_WIDTHS = [320, 640];
const WEBP = { quality: 80, effort: 5, smartSubsample: true } as const;

const force = process.argv.includes("--force");
/** Removing tiers for ids no longer declared is opt in, so parallel curation runs never delete each other's work. */
const prune = process.argv.includes("--prune");

function publicPath(absolute: string): string {
  return "/" + path.relative(path.join(ROOT, "public"), absolute).split(path.sep).join("/");
}

function sourcePath(file: string): string {
  const absolute = path.join(SOURCE_ROOT, file);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Source photograph not found: images/pathwayswithin-images/${file}`);
  }
  return absolute;
}

/** Rebuild a tier when it is missing or older than the photograph it was cut from. */
function stale(out: string, source: string, rebuild = false): boolean {
  if (force || rebuild || !fs.existsSync(out)) return true;
  return fs.statSync(out).mtimeMs < fs.statSync(source).mtimeMs;
}

function gravity(square: AssetSource["square"]): string | number {
  if (square === "attention") return sharp.strategy.attention;
  if (square === "top") return "north";
  return "centre";
}

async function cutTiers(
  source: string,
  outDir: string,
  stem: string,
  widths: number[],
  square: AssetSource["square"] | undefined,
  /** The crop changed since the last run, so existing tiers are wrong even if newer than the source. */
  rebuild = false,
): Promise<GeneratedAsset> {
  const image = sharp(source, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  if (!srcW || !srcH) throw new Error(`Could not read dimensions of ${source}`);

  // Square crops measure against the shorter side.
  const limit = square ? Math.min(srcW, srcH) : srcW;
  let targets = widths.filter((w) => w <= limit);
  if (!targets.length) targets = [limit];
  // Keep the largest tier the source can honestly give if it is well past the last stop.
  if (limit > targets[targets.length - 1] * 1.25 && limit <= widths[widths.length - 1] * 1.5) {
    targets.push(Math.min(limit, widths[widths.length - 1]));
  }

  const tiers: GeneratedTier[] = [];
  for (const width of targets) {
    const out = path.join(outDir, `${stem}-${width}.webp`);
    let height: number;
    if (square) {
      height = width;
      if (stale(out, source, rebuild)) {
        await sharp(source, { failOn: "none" })
          .rotate()
          .resize(width, width, { fit: "cover", position: gravity(square) })
          .webp(WEBP)
          .toFile(out);
      }
    } else {
      height = Math.round((srcH / srcW) * width);
      if (stale(out, source, rebuild)) {
        await sharp(source, { failOn: "none" })
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp(WEBP)
          .toFile(out);
      }
      const written = await sharp(out).metadata();
      height = written.height ?? height;
    }
    tiers.push({ width, height, src: publicPath(out) });
  }

  const largest = tiers[tiers.length - 1];
  return { id: stem, width: largest.width, height: largest.height, crop: square ?? "full", tiers };
}

function pruneStale(dir: string, keepStems: Set<string>): string[] {
  if (!fs.existsSync(dir)) return [];
  const removed: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const stem = entry.replace(/-\d+\.webp$/, "");
    if (entry.endsWith(".webp") && !keepStems.has(stem)) {
      fs.rmSync(path.join(dir, entry));
      removed.push(entry);
    }
  }
  return removed;
}

async function main() {
  fs.mkdirSync(PHOTO_OUT, { recursive: true });
  fs.mkdirSync(HEADSHOT_OUT, { recursive: true });

  // Start from the previous manifest so a run that builds one group keeps the others' entries.
  const previous: GeneratedManifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
    : { builtAt: "", photos: {}, headshots: {} };
  const manifest: GeneratedManifest = {
    builtAt: new Date().toISOString(),
    photos: prune ? {} : { ...previous.photos },
    headshots: prune ? {} : { ...previous.headshots },
  };
  const seen = new Set<string>();
  /** Tier stems that are real files on disk (aliases share another id's stem). */
  const stems = new Set<string>();
  /** source file + crop -> the id whose tiers were cut. Groups are curated in
      parallel and often pick the same photograph under different ids; the
      tiers are cut once and every alias shares the same files, so the browser
      caches one download across pages. */
  const bySource = new Map<string, string>();
  let count = 0;
  let aliased = 0;

  for (const group of GROUPS) {
    for (const asset of group.assets) {
      if (seen.has(asset.id)) throw new Error(`Duplicate photo id "${asset.id}" in group ${group.name}`);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(asset.id)) {
        throw new Error(`Photo id "${asset.id}" must be kebab case`);
      }
      seen.add(asset.id);

      const key = `${asset.file}|${asset.square ?? "full"}`;
      const canonical = bySource.get(key);
      if (canonical) {
        manifest.photos[asset.id] = { ...manifest.photos[canonical], id: asset.id };
        aliased += 1;
        process.stdout.write(`  ${group.name.padEnd(18)} ${asset.id}  = ${canonical}\n`);
        continue;
      }

      const widths = asset.square ? SQUARE_WIDTHS : PHOTO_WIDTHS;
      const cropChanged = (previous.photos[asset.id]?.crop ?? "full") !== (asset.square ?? "full");
      manifest.photos[asset.id] = await cutTiers(
        sourcePath(asset.file),
        PHOTO_OUT,
        asset.id,
        widths,
        asset.square,
        cropChanged,
      );
      bySource.set(key, asset.id);
      stems.add(asset.id);
      count += 1;
      process.stdout.write(`  ${group.name.padEnd(18)} ${asset.id}\n`);
    }
  }

  const headshotSlugs = new Set<string>();
  for (const row of HEADSHOTS) {
    if (headshotSlugs.has(row.slug)) throw new Error(`Duplicate headshot for ${row.slug}`);
    headshotSlugs.add(row.slug);
    manifest.headshots[row.slug] = await cutTiers(
      sourcePath(row.file),
      HEADSHOT_OUT,
      row.slug,
      HEADSHOT_WIDTHS,
      row.square ?? "attention",
      (previous.headshots[row.slug]?.crop ?? "attention") !== (row.square ?? "attention"),
    );
    count += 1;
    process.stdout.write(`  ${"headshot".padEnd(18)} ${row.slug}\n`);
  }

  const pruned = prune ? [...pruneStale(PHOTO_OUT, stems), ...pruneStale(HEADSHOT_OUT, headshotSlugs)] : [];
  if (prune) {
    for (const id of Object.keys(manifest.photos)) if (!seen.has(id)) delete manifest.photos[id];
    for (const slug of Object.keys(manifest.headshots)) if (!headshotSlugs.has(slug)) delete manifest.headshots[slug];
  }

  // Stable key order so the diff of generated.json is readable.
  manifest.photos = Object.fromEntries(Object.entries(manifest.photos).sort(([a], [b]) => a.localeCompare(b)));
  manifest.headshots = Object.fromEntries(
    Object.entries(manifest.headshots).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

  const bytes = [PHOTO_OUT, HEADSHOT_OUT]
    .flatMap((dir) => fs.readdirSync(dir).map((f) => fs.statSync(path.join(dir, f)).size))
    .reduce((a, b) => a + b, 0);

  console.log(
    `\n${count} photographs cut${aliased ? ` (${aliased} more ids share them)` : ""}, ` +
      `${(bytes / 1024 / 1024).toFixed(1)} MB of WebP in public/images` +
      (pruned.length ? `, pruned ${pruned.length} stale file(s)` : ""),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
