import { getProviders } from "@/lib/content";
import ProviderCard from "./ProviderCard";
import { toProviderCardData } from "./types";
import "./directory.css";

/**
 * Every other provider, on a provider's own page, so the profiles link to
 * each other and not only back to the directory. Names and photos come from
 * the sheet; nothing here is written copy.
 */
export default function ProviderPeers({ slug }: { slug: string }) {
  const others = getProviders()
    .filter(
      (provider) =>
        provider.active &&
        !provider.isAdmin &&
        !provider.isFounder &&
        !provider.isSpecialist &&
        provider.slug !== slug,
    )
    .map(toProviderCardData);

  if (!others.length) return null;

  return (
    <section className="page-section provider-peers" aria-labelledby="the-team" data-section="the-team">
      <h2 id="the-team" className="heading heading--h2">
        The team
      </h2>
      <ul className="provider-cards provider-cards--search">
        {others.map((provider) => (
          <ProviderCard key={provider.slug} provider={provider} />
        ))}
      </ul>
    </section>
  );
}
