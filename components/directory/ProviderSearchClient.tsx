"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { matchesQuery, queryTokens, searchFromSelection } from "@/lib/provider-filter";
import ProviderCard from "./ProviderCard";
import type { ProviderCardData } from "./types";

const DEFAULT_LABEL = "Search By Keyword";

/**
 * The interactive half of ProviderSearch.
 *
 * Progressive: the form is a real GET to /providers, so with no JavaScript
 * the reader still reaches the directory with ?q= set. Hydrated, submit is
 * intercepted and sent to the same URL with window.location.assign, so Enter
 * always lands on the full directory, and typing filters `providers` in place
 * with the same matchesQuery the directory uses.
 *
 * Everything is in the DOM on load; only the results list starts empty. It
 * fills as the reader types, never above `limit` cards, with a link to the
 * directory carrying the rest.
 */
export default function ProviderSearchClient({
  providers,
  limit = 8,
  label = DEFAULT_LABEL,
}: {
  providers: ProviderCardData[];
  limit?: number;
  label?: string;
}) {
  const [query, setQuery] = useState("");
  const id = useId();
  const inputId = `${id}-q`;

  const active = queryTokens(query).length > 0;

  const matches = useMemo(
    () => (active ? providers.filter((provider) => matchesQuery(provider, query)) : []),
    [providers, query, active],
  );
  const shown = matches.slice(0, Math.max(0, limit));
  const directoryHref = `/providers${searchFromSelection({ q: query })}`;

  return (
    <div className="provider-search" data-provider-search-active={active ? "true" : "false"}>
      <form
        className="provider-search__form"
        role="search"
        action="/providers"
        method="get"
        aria-label="Search providers"
        onSubmit={(event) => {
          event.preventDefault();
          window.location.assign(directoryHref);
        }}
      >
        <label className="provider-search__label" htmlFor={inputId}>
          {label}
        </label>
        <div className="provider-search__row">
          <input
            id={inputId}
            className="provider-search__input"
            type="search"
            name="q"
            placeholder={label}
            value={query}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="button provider-search__submit">
            Search
          </button>
        </div>
      </form>

      <p className="provider-search__status" role="status" aria-live="polite">
        <Status
          active={active}
          total={providers.length}
          matched={matches.length}
          shown={shown.length}
          directoryHref={directoryHref}
        />
      </p>

      <ul className="provider-cards provider-cards--search" aria-label="Matching providers">
        {shown.map((provider) => (
          <ProviderCard key={provider.slug} provider={provider} layout="finder" />
        ))}
      </ul>
    </div>
  );
}

/**
 * One line under the field, read aloud when it changes. Empty query: a way
 * into the whole directory. Matches: a count, plus the "see all" link when
 * the list is capped. Nothing: say so.
 */
function Status({
  active,
  total,
  matched,
  shown,
  directoryHref,
}: {
  active: boolean;
  total: number;
  matched: number;
  shown: number;
  directoryHref: string;
}) {
  if (!active) {
    return (
      <Link href="/providers" className="button button--quiet provider-search__all">
        Browse all {total} providers
      </Link>
    );
  }
  if (matched === 0) {
    return <>No providers match that search.</>;
  }
  if (matched > shown) {
    return (
      <>
        Showing {shown} of {matched} matches.{" "}
        <Link href={directoryHref} className="button button--quiet provider-search__all">
          See all {matched} matches in the directory
        </Link>
      </>
    );
  }
  return (
    <>
      {matched === 1 ? "1 provider matches" : `${matched} providers match`}.{" "}
      <Link href={directoryHref} className="button button--quiet provider-search__all">
        Open in the directory
      </Link>
    </>
  );
}
