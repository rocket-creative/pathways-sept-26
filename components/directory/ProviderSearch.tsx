import { getProviders } from "@/lib/content";
import ProviderSearchClient from "./ProviderSearchClient";
import { toProviderCardData } from "./types";
import "./directory.css";

/**
 * Free text search over every active provider, mountable anywhere a
 * [PROVIDER SEARCH] marker appears (the homepage "Find a provider" section).
 *
 * Server component, no required props. It reads the sheet once, keeps the
 * active non admin rows, and hands plain card data to the client half, which
 * owns the input and the live results.
 *
 * DOM shape (see ProviderSearchClient):
 *
 *   <div class="provider-search">
 *     <form class="provider-search__form" role="search" action="/providers" method="get">
 *       <label class="provider-search__label" for=…>Search by name, specialty, or approach</label>
 *       <div class="provider-search__row">
 *         <input class="provider-search__input" id=… type="search" name="q">
 *         <button class="button provider-search__submit" type="submit">Search</button>
 *       </div>
 *     </form>
 *     <p class="provider-search__status" role="status" aria-live="polite">…</p>
 *     <ul class="provider-cards provider-cards--search">…<li class="provider-card">…</ul>
 *   </div>
 *
 * Without JavaScript the form submits GET /providers?q=… and the directory
 * page carries the query. With JavaScript, Enter lands on the same URL and
 * typing shows up to `limit` matching cards underneath.
 */
export default function ProviderSearch({
  limit = 8,
  label,
}: {
  /** How many live results to show before the "See all" link takes over. */
  limit?: number;
  /** The visible label on the search field. UI text, not marketing copy. */
  label?: string;
}) {
  const providers = getProviders()
    .filter((provider) => provider.active && !provider.isAdmin && !provider.isFounder && !provider.isSpecialist)
    .map(toProviderCardData);

  return <ProviderSearchClient providers={providers} limit={limit} label={label} />;
}

export { ProviderSearch };
