import { getProviders, type Provider, type ProviderCardFilter } from "@/lib/content";
import ProviderCard from "./ProviderCard";
import { toProviderCardData } from "./types";
import "./directory.css";

/**
 * [PROVIDER CARDS: slug, slug], [PROVIDER CARDS: specialty=anxiety], and
 * [PROVIDER CARDS: pillar=wellness] all land here. Inactive rows and the admin
 * team never appear: they have no profile page to link to.
 */
export default function ProviderCards({ filter }: { filter: ProviderCardFilter }) {
  const providers = selectProviders(filter);
  if (!providers.length) return null;

  return (
    <ul className="provider-cards">
      {providers.map((provider) => (
        <ProviderCard key={provider.slug} provider={toProviderCardData(provider)} />
      ))}
    </ul>
  );
}

export function selectProviders(filter: ProviderCardFilter): Provider[] {
  const active = getProviders().filter((provider) => provider.active && !provider.isAdmin);

  switch (filter.by) {
    case "slugs":
      return filter.slugs
        .map((slug) => active.find((provider) => provider.slug === slug))
        .filter((provider): provider is Provider => Boolean(provider));
    case "specialty":
      return active.filter((provider) =>
        provider.specialties.some((specialty) =>
          specialty.toLowerCase().includes(filter.value.toLowerCase()),
        ),
      );
    case "pillar":
      return active.filter((provider) =>
        provider.pillars.some((pillar) => pillar.toLowerCase() === filter.value.toLowerCase()),
      );
  }
}