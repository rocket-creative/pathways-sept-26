/**
 * Plain data the cards and the client side directory render. Keeping it free
 * of the content pipeline means these objects cross the server to client
 * boundary without dragging the filesystem loaders into the browser bundle.
 */
import type { Provider } from "@/lib/content";
import { resolveHeadshot } from "@/lib/images";

export interface ProviderCardData {
  slug: string;
  name: string;
  displayName: string;
  credentials: string;
  titleLine: string;
  /** First bullet from the sheet, the one line the card shows. */
  bullet: string;
  /**
   * Local square WebP tiers built from the client's photographs, when the
   * registry has one for this provider. Wins over headshotUrl.
   */
  headshot?: { src: string; srcSet: string; width: number; height: number };
  headshotUrl: string;
  initials: string;
  /** Admin rows have no profile page, so their card carries no link. */
  url: string | null;
  pillars: string[];
  specialties: string[];
  modalities: string[];
  ageGroups: string[];
  locations: string[];
  formats: string[];
}

export function toProviderCardData(provider: Provider): ProviderCardData {
  return {
    slug: provider.slug,
    name: `${provider.first_name} ${provider.last_name}`,
    displayName: provider.displayName,
    credentials: provider.credentials,
    titleLine: provider.title_line,
    bullet: firstBullet(provider),
    headshot: localHeadshot(provider.slug),
    headshotUrl: provider.headshot_url,
    initials: initialsFor(provider.first_name, provider.last_name),
    url: provider.isAdmin ? null : `/providers/${provider.slug}`,
    pillars: provider.pillars,
    specialties: provider.specialties,
    modalities: provider.modalities,
    ageGroups: provider.age_groups,
    locations: provider.locations,
    formats: provider.formats,
  };
}

/**
 * The card shows the title line and then the first bullet. When the sheet
 * repeats the title as the bullet ("Licensed Acupuncturist" twice) the card
 * would say it twice, so an exact repeat (case and whitespace aside) is
 * dropped. Anything else is left exactly as written.
 */
function firstBullet(provider: Provider): string {
  const bullet = provider.bullets[0] ?? "";
  const same = bullet.trim().toLowerCase() === provider.title_line.trim().toLowerCase();
  return same ? "" : bullet;
}

function localHeadshot(slug: string): ProviderCardData["headshot"] {
  const resolved = resolveHeadshot(slug);
  if (!resolved) return undefined;
  const { src, srcSet, width, height } = resolved;
  return { src, srcSet, width, height };
}

/** "Charity (Valen)" and "Karen (Ren)" both need the parenthetical dropped. */
function initialsFor(first: string, last: string): string {
  const clean = (value: string) => value.replace(/\(.*?\)/g, "").trim();
  return `${clean(first).charAt(0)}${clean(last).charAt(0)}`.toUpperCase();
}
