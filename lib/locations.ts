/**
 * Sheet driven office data: cards, the accessibility line, the hours block,
 * and the MedicalClinic graph each location page carries.
 *
 * The sheet is the source of truth. Sentences come out of it verbatim, and a
 * cell that still reads [NEEDS] surfaces as a marker rather than a guess.
 *
 * OWNER: providers and locations agent.
 */
import { SITE_ORIGIN, getLocation, getLocations, isNeeds, type Location } from "@/lib/content";

/** Placed under every hours block, per MASTER-PROMPT section 5. */
export const APPOINTMENT_HOURS_SENTENCE =
  "Clinician and provider appointment times vary and may fall outside front desk hours, including evenings.";

/** The marker the location pages already use for missing hours. */
export const HOURS_NEEDS = "front desk hours per location";

/**
 * Three states, because the sheet has true, false, and [NEEDS]. Unknown never
 * renders as accessible.
 */
export type AccessibilityState = "accessible" | "not-accessible" | "unknown";

export interface LocationCardData {
  slug: string;
  name: string;
  url: string;
  addressLine: string;
  accessibility: AccessibilityState;
  /** Short label for the card. Empty while the sheet is undecided. */
  accessibilityLabel: string;
  /** The sheet's own sentence, or null while it reads [NEEDS]. */
  accessibilityNote: string | null;
  /** What to ask the client for when the sheet cannot answer yet. */
  accessibilityNeeds: string | null;
}

export interface HoursBlock {
  /** Verbatim front desk hours, or null while the sheet reads [NEEDS]. */
  frontDeskHours: string | null;
  /** Marker text to render in place of the hours. */
  needs: string | null;
  /** Always shown under the hours, whether or not the hours are known. */
  sentence: string;
}

export function locationUrl(slug: string): string {
  return `/locations/${slug}`;
}

export function allLocationUrls(): string[] {
  return getLocations().map((location) => locationUrl(location.slug));
}

export function accessibilityState(location: Location): AccessibilityState {
  if (location.wheelchair_accessible === true) return "accessible";
  if (location.wheelchair_accessible === false) return "not-accessible";
  return "unknown";
}

/** Card sized label. Unknown offices get no label and no icon. */
export function accessibilityLabel(state: AccessibilityState): string {
  if (state === "accessible") return "Wheelchair accessible";
  if (state === "not-accessible") return "Not wheelchair accessible";
  return "";
}

/**
 * The accessibility sentence exactly as the sheet writes it. It can carry its
 * own inline [NEEDS] marker, so pass it through parseInline before rendering.
 */
export function accessibilitySentence(location: Location): string | null {
  return isNeeds(location.accessibility_note) ? null : location.accessibility_note;
}

export function hoursBlock(location: Location): HoursBlock {
  const known = !isNeeds(location.front_desk_hours);
  return {
    frontDeskHours: known ? location.front_desk_hours : null,
    needs: known ? null : HOURS_NEEDS,
    sentence: APPOINTMENT_HOURS_SENTENCE,
  };
}

/** Street plus suite, with the suite dropped while the sheet reads [NEEDS]. */
export function streetAddress(location: Location): string {
  return [location.street, location.suite].filter(Boolean).join(", ");
}

export function toLocationCard(location: Location): LocationCardData {
  const state = accessibilityState(location);
  const note = accessibilitySentence(location);

  return {
    slug: location.slug,
    name: location.name,
    url: locationUrl(location.slug),
    addressLine: location.addressLine,
    accessibility: state,
    accessibilityLabel: accessibilityLabel(state),
    accessibilityNote: note,
    accessibilityNeeds: state === "unknown" && !note ? `accessibility for ${location.name}` : null,
  };
}

/** Cards for the slugs a page asks for, in that order; all offices if none. */
export function getLocationCards(slugs: string[]): LocationCardData[] {
  if (!slugs.length) return getLocations().map(toLocationCard);

  return slugs
    .map((slug) => getLocation(slug))
    .filter((location): location is Location => Boolean(location))
    .map(toLocationCard);
}

/* ------------------------------------------------------------------ */
/* JSON LD                                                             */
/* ------------------------------------------------------------------ */

export interface OpeningHours {
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

/** "(631) 371-3825" becomes "+1-631-371-3825" for schema. */
export function schemaTelephone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (national.length !== 10) return phone;
  return `+1-${national.slice(0, 3)}-${national.slice(3, 6)}-${national.slice(6)}`;
}

/**
 * MedicalClinic per SPEC section 6. Properties the sheet cannot answer yet are
 * omitted rather than filled with placeholder text: geo, hasMap, the opening
 * hours, and the wheelchair amenity where the office is undecided. Pass hours
 * in once the client supplies them and the specification appears.
 */
export function buildLocationPlace(
  location: Location,
  options: { openingHours?: OpeningHours[] } = {},
): Record<string, unknown> {
  const url = `${SITE_ORIGIN}${locationUrl(location.slug)}`;

  const place: Record<string, unknown> = {
    "@type": "MedicalClinic",
    "@id": `${url}#place`,
    name: location.name,
    parentOrganization: { "@id": `${SITE_ORIGIN}/#org` },
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress(location),
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: "US",
    },
    telephone: schemaTelephone(location.phone),
    url,
  };

  const state = accessibilityState(location);
  if (state !== "unknown") {
    place.amenityFeature = [
      {
        "@type": "LocationFeatureSpecification",
        name: "Wheelchair accessible",
        value: state === "accessible",
      },
    ];
  }

  const hours = options.openingHours ?? parseOpeningHours(location);
  if (hours.length) {
    place.openingHoursSpecification = hours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.dayOfWeek,
      opens: entry.opens,
      closes: entry.closes,
    }));
  }

  if (location.latitude && location.longitude) {
    place.geo = {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }

  if (location.google_maps_url) place.hasMap = location.google_maps_url;

  return place;
}

/**
 * Every front_desk_hours cell still reads [NEEDS], so this returns nothing and
 * openingHoursSpecification stays out of the graph. Once the sheet carries
 * real hours, pass them through the options argument in the shape above.
 */
function parseOpeningHours(location: Location): OpeningHours[] {
  return isNeeds(location.front_desk_hours) ? [] : [];
}

export function buildLocationGraph(location: Location): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [buildLocationPlace(location)],
  };
}

/** Every [NEEDS] the offices still carry, for BUILD-NOTES.md. */
export function locationNeeds(): { slug: string; needs: string[] }[] {
  return getLocations().map((location) => {
    const needs: string[] = [];
    if (isNeeds(location.suite)) needs.push("suite number");
    if (accessibilityState(location) === "unknown") needs.push("wheelchair access");
    if (isNeeds(location.front_desk_hours)) needs.push(HOURS_NEEDS);
    if (isNeeds(location.parking)) needs.push("parking");
    if (!location.latitude || !location.longitude) needs.push("lat and long to 5 decimals");
    if (!location.google_maps_url) needs.push("Google Maps URL and embed");
    if (!location.providers.length) needs.push("providers assigned to this office");
    return { slug: location.slug, needs };
  });
}
