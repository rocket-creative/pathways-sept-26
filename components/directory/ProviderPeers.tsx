import Link from "next/link";

/**
 * A provider page ends with a way to the directory. The full roster lives on
 * Find a Provider, not repeated under every profile.
 */
export default function ProviderPeers() {
  return (
    <section className="page-section provider-peers" aria-labelledby="find-a-provider">
      <h2 id="find-a-provider" className="heading heading--h2">
        Find a provider
      </h2>
      <div className="cta">
        <Link className="button" href="/providers">
          Find a Provider
        </Link>
      </div>
    </section>
  );
}
