/**
 * Plain data the cards and the client side directory render. Keeping it free
 * of the content pipeline means these objects cross the server to client
 * boundary without dragging the filesystem loaders into the browser bundle.
 */
import type { Provider } from "@/lib/content";

export interface ProviderCardData {
  slug: string;
  name: string;
  displayName: string;
  credentials: string;
  titleLine: string;
  /** First bullet from the sheet, the one line the card shows. */
  bullet: string;
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
    bullet: provider.bullets[0] ?? "",
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

/** "Charity (Valen)" and "Karen (Ren)" both need the parenthetical dropped. */
function initialsFor(first: string, last: string): string {
  const clean = (value: string) => value.replace(/\(.*?\)/g, "").trim();
  return `${clean(first).charAt(0)}${clean(last).charAt(0)}`.toUpperCase();
}
