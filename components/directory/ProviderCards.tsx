import { getProviders, type Provider, type ProviderCardFilter } from "@/lib/content";
import { matchesFacet, type FacetKey } from "@/lib/provider-filter";
import { pickFillPhotos } from "./fillPhoto";
import GridFill from "./GridFill";
import ProviderCard from "./ProviderCard";
import { toProviderCardData } from "./types";
import "./directory.css";

/**
 * [PROVIDER CARDS: slug, slug], [PROVIDER CARDS: specialty=anxiety],
 * [PROVIDER CARDS: pillar=wellness], and [PROVIDER CARDS: location=smithtown]
 * all land here. Inactive rows and the admin team never appear: they have no
 * profile page to link to.
 *
 * Keyed filters run through lib/provider-filter.ts, the same function the
 * /providers directory uses in the browser, so a concern page and the
 * directory always agree.
 *
 * A marker that matches nobody renders a [NEEDS] note in development and
 * nothing in production, never an empty list under a heading.
 *
 * `fill` is off when the renderer lays a lone card out beside its copy
 * (PageBody, .page-section--cards-one): the copy fills the row, not a tile.
 */
export default function ProviderCards({ filter, fill = true }: { filter: ProviderCardFilter; fill?: boolean }) {
  const providers = selectProviders(filter);

  if (!providers.length) {
    return <Needs value={`no active provider matches [PROVIDER CARDS: ${describe(filter)}]`} />;
  }

  // The grid runs three across on desktop and two on a tablet; a photograph
  // takes whatever the last row leaves empty. Seeded by the marker so each
  // page keeps its own picture across renders.
  const photos = fill ? pickFillPhotos("providers", describe(filter)) : undefined;

  return (
    <ul className="provider-cards">
      {providers.map((provider) => (
        <ProviderCard key={provider.slug} provider={toProviderCardData(provider)} />
      ))}
      <GridFill photos={photos} count={providers.length} />
    </ul>
  );
}

const FACET_FOR: Record<Exclude<ProviderCardFilter["by"], "slugs">, FacetKey> = {
  specialty: "specialties",
  pillar: "pillars",
  location: "locations",
};

export function selectProviders(filter: ProviderCardFilter): Provider[] {
  const active = getProviders().filter(
    (provider) =>
      provider.active &&
      !provider.isAdmin &&
      (filter.by === "slugs" || (!provider.isFounder && !provider.isSpecialist)),
  );

  if (filter.by === "slugs") {
    return filter.slugs
      .map((slug) => active.find((provider) => provider.slug === slug))
      .filter((provider): provider is Provider => Boolean(provider));
  }

  const facet = FACET_FOR[filter.by];
  return active.filter((provider) => matchesFacet(toProviderCardData(provider), facet, [filter.value]));
}

function describe(filter: ProviderCardFilter): string {
  return filter.by === "slugs" ? filter.slugs.join(", ") : `${filter.by}=${filter.value}`;
}

/** The gap stays in content/data/needs-list.md. Nothing is rendered. */
function Needs({ value }: { value: string }) {
  void value;
  return null;
}
