import { LABYRINTH } from "@/lib/backdropImage";
import faceFocus from "./face-focus.json";
import generated from "./generated.json";
import { GROUPS } from "./groups";
import { HEADSHOTS } from "./groups/providers";
import type {
  AssetSource,
  Focal,
  GeneratedAsset,
  GeneratedManifest,
  PagePhotos,
  Photo,
  SectionPhoto,
} from "./types";

export type {
  Focal,
  PagePhotos,
  Photo,
  SectionPhoto,
  SectionPhotoLayout,
  SectionPhotos,
} from "./types";

const manifest = generated as GeneratedManifest;

/** Everything a component needs to render one photograph responsively. */
export interface ResolvedPhoto {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  focal: Focal;
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

let assetIndex: Map<string, AssetSource> | undefined;
let pageIndex: Map<string, PagePhotos> | undefined;

function assets(): Map<string, AssetSource> {
  if (assetIndex) return assetIndex;
  assetIndex = new Map();
  for (const group of GROUPS) {
    for (const asset of group.assets) {
      if (assetIndex.has(asset.id)) {
        throw new Error(`Photo id "${asset.id}" is declared twice (group ${group.name}).`);
      }
      assetIndex.set(asset.id, asset);
    }
  }
  return assetIndex;
}

function pages(): Map<string, PagePhotos> {
  if (pageIndex) return pageIndex;
  pageIndex = new Map();
  for (const group of GROUPS) {
    for (const [url, photos] of Object.entries(group.pages)) {
      if (pageIndex.has(url)) {
        throw new Error(`Page "${url}" is decorated by two groups (second: ${group.name}).`);
      }
      pageIndex.set(url, photos);
    }
  }
  return pageIndex;
}

export function getAllAssetSources(): AssetSource[] {
  return [...assets().values()];
}

/** Gloria at the Smithtown desk, used for every Insurance / Insurance and cost section. */
const INSURANCE_FIGURE: SectionPhoto = {
  asset: "ha-ap-front-desk-team",
  alt: "Gloria Saladino at the Smithtown front desk with a colleague and a visitor",
  shape: "rounded",
  aspect: "landscape",
  side: "start",
  layout: "feature",
  focal: "center",
};

/** Gloria at the Smithtown desk, used for every Take the next step section. */
const NEXT_STEP_FIGURE: SectionPhoto = {
  asset: "ha-ap-front-desk-welcome",
  alt: "Gloria Saladino at the Smithtown front desk with a visitor",
  shape: "rounded",
  aspect: "landscape",
  side: "end",
  layout: "split",
  focal: "center",
};

/**
 * These two cards are the same on every page. Applied here so a page that
 * never lists them in its group file still gets them, and a page that listed
 * a different closing photograph matches the rest of the site.
 */
const STANDARD_SECTIONS: NonNullable<PagePhotos["sections"]> = {
  insurance: INSURANCE_FIGURE,
  "insurance-and-cost": INSURANCE_FIGURE,
  "take-the-next-step": NEXT_STEP_FIGURE,
};

export function getPagePhotos(url: string): PagePhotos | undefined {
  const page = pages().get(url);
  if (!page) return { sections: { ...STANDARD_SECTIONS } };
  return {
    ...page,
    sections: {
      ...page.sections,
      ...STANDARD_SECTIONS,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Resolution against the generated tiers                              */
/* ------------------------------------------------------------------ */

function chosenFocal(photo: Photo): Focal {
  const detected = (faceFocus.photos as Record<string, Focal | undefined>)[photo.asset];
  // "center" is the default. A detected face replaces it so a cover crop
  // keeps the person in the frame. An explicit point such as "40% 55%" stays.
  if (detected && (!photo.focal || photo.focal === "center")) return detected;
  return photo.focal ?? "center";
}

function toResolved(built: GeneratedAsset, alt: string, focal: Focal | undefined): ResolvedPhoto {
  const largest = built.tiers[built.tiers.length - 1];
  return {
    src: largest.src,
    srcSet: built.tiers.map((tier) => `${tier.src} ${tier.width}w`).join(", "),
    width: built.width,
    height: built.height,
    alt,
    focal: focal ?? "center",
  };
}

/**
 * A photo whose tiers have not been built yet resolves to undefined and the
 * component renders nothing, so a fresh checkout never ships a broken image.
 * Run `npm run images` to build.
 */
export function resolvePhoto(photo: Photo | undefined): ResolvedPhoto | undefined {
  if (!photo || photo.missing) return undefined;
  /* The site backdrop (public/labyrinth-*.webp) is not a library crop.
     One homepage card shows that same photograph inside the glass. */
  if (photo.asset === "site-labyrinth") {
    return {
      src: LABYRINTH.src,
      srcSet: LABYRINTH.srcSet,
      width: LABYRINTH.width,
      height: LABYRINTH.height,
      alt: photo.alt,
      focal: photo.focal && photo.focal !== "center" ? photo.focal : "center",
    };
  }
  if (!assets().has(photo.asset)) {
    throw new Error(`Photo "${photo.asset}" is not declared in any lib/images/groups file.`);
  }
  const built = manifest.photos[photo.asset];
  if (!built || !built.tiers.length) return undefined;
  return toResolved(built, photo.alt, chosenFocal(photo));
}

/**
 * A local headshot for a provider, or undefined when the sheet still points
 * at the old site (or nowhere). Square, so the circle mask has nothing to hide.
 */
export function resolveHeadshot(slug: string): ResolvedPhoto | undefined {
  const built = manifest.headshots[slug];
  if (!built || !built.tiers.length) return undefined;
  return toResolved(built, "", "center");
}

export function hasHeadshotSource(slug: string): boolean {
  return HEADSHOTS.some((row) => row.slug === slug);
}

/** Absolute URL of the page's hero photograph for og:image, if it has one. */
export function ogImageFor(url: string, origin: string): string | undefined {
  const resolved = resolvePhoto(getPagePhotos(url)?.hero);
  if (!resolved) return undefined;
  // The 1280 tier is closest to the 1200 wide social card.
  const tier = manifest.photos[getPagePhotos(url)!.hero!.asset].tiers.find((t) => t.width >= 1200);
  return `${origin}${tier?.src ?? resolved.src}`;
}
