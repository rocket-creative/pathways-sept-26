"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./site-chrome.css";

export type SearchEntry = { url: string; h1: string };

const MAX_RESULTS = 8;

export default function NotFoundSearch({ pages }: { pages: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (term.length < 2) return [];
    return pages
      .filter(
        (page) =>
          page.h1.toLowerCase().includes(term) || page.url.toLowerCase().includes(term),
      )
      .slice(0, MAX_RESULTS);
  }, [pages, term]);

  return (
    <div className="not-found__search">
      <h2>Search the site</h2>
      <p className="not-found__field">
        <label htmlFor="not-found-query">Page name or keyword</label>
        <input
          id="not-found-query"
          type="search"
          name="q"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </p>

      <p className="not-found__status" role="status">
        {term.length < 2
          ? `Type two letters or more to search ${pages.length} pages.`
          : matches.length === 0
            ? "No pages match that yet. Try a service or a town name."
            : `${matches.length} page${matches.length === 1 ? "" : "s"} match.`}
      </p>

      {matches.length > 0 && (
        <ul className="not-found__results">
          {matches.map((page) => (
            <li key={page.url}>
              <Link href={page.url}>
                {page.h1}
                <span>{page.url}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
