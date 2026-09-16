import Link from "next/link";
import { getProviders, type Provider, type ProviderCardFilter } from "@/lib/content";

/** OWNER: providers and locations agent. Circular headshots, filters, WebP. */
export default function ProviderCards({ filter }: { filter: ProviderCardFilter }) {
  const providers = selectProviders(filter);
  if (!providers.length) return null;

  return (
    <ul className="provider-cards">
      {providers.map((provider) => (
        <li key={provider.slug} className="provider-card">
          <Link href={`/providers/${provider.slug}`}>
            <span className="provider-card__name">{provider.displayName}</span>
          </Link>
          <p className="provider-card__title">{provider.title_line}</p>
          {provider.bullets[0] ? <p>{provider.bullets[0]}</p> : null}
        </li>
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
