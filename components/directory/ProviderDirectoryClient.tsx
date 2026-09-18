"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  isEmptySelection,
  matchesSelection,
  searchFromSelection,
  selectionFromSearch,
  type FacetKey,
  type Selection,
} from "@/lib/provider-filter";
import GridFill, { type FillPhoto } from "./GridFill";
import ProviderCard from "./ProviderCard";
import type { ProviderCardData } from "./types";

/** Labels come from the filter list in content/pages/providers.md. */
const FACETS: { key: FacetKey; label: string; needs?: string }[] = [
  { key: "pillars", label: "Pillar" },
  { key: "specialties", label: "Concern" },
  { key: "modalities", label: "Modality" },
  { key: "ageGroups", label: "Age group" },
  { key: "locations", label: "Location", needs: "assign providers to offices in the sheet" },
  { key: "formats", label: "Format" },
];

/**
 * Client side filters over a server rendered list.
 *
 * Every card is in the HTML at load and stays in the DOM while filtering:
 * cards that do not match are marked `hidden`, never removed, so each
 * /providers/{slug} link exists for crawlers whatever the query string says.
 *
 * Filter state lives in the query string (?q=emdr&pillar=wellness&specialty=anxiety)
 * and is restored on load. The page's canonical stays /providers with no
 * query, so filter combinations are not indexable duplicates.
 *
 * The free text field ANDs with the six selects (lib/provider-filter.ts,
 * matchesQuery); the homepage ProviderSearch hands off here as /providers?q=.
 */
const SEARCH_LABEL = "Search by name, specialty, or approach";
export default function ProviderDirectoryClient({
  providers,
  admin,
  fill,
}: {
  providers: ProviderCardData[];
  admin: ProviderCardData[];
  /** Photograph for the tile that fills the grid's last row; chosen on the server. */
  fill?: FillPhoto;
}) {
  const [selection, setSelection] = useState<Selection>({});
  const [ready, setReady] = useState(false);
  const fieldId = useId();

  // Restore from the URL once, after hydration, so server and client agree
  // on the first render (everything visible).
  useEffect(() => {
    setSelection(selectionFromSearch(window.location.search));
    setReady(true);

    const onPopState = () => setSelection(selectionFromSearch(window.location.search));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const update = (facet: FacetKey, value: string) => {
    setSelection((current) => {
      const next: Selection = { ...current };
      if (value) next[facet] = value.split(",").map((part) => part.trim()).filter(Boolean);
      else delete next[facet];
      const url = `${window.location.pathname}${searchFromSelection(next)}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", url);
      return next;
    });
  };

  const updateQuery = (value: string) => {
    setSelection((current) => {
      const next: Selection = { ...current };
      // Keep what the reader typed (spaces included) so the caret behaves;
      // matching and the URL trim it.
      if (value.trim()) next.q = value;
      else delete next.q;
      const url = `${window.location.pathname}${searchFromSelection(next)}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", url);
      return next;
    });
  };

  const clear = () => {
    setSelection({});
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.hash}`,
    );
  };

  const options = useMemo(() => {
    const collected = {} as Record<FacetKey, string[]>;
    for (const facet of FACETS) {
      const values = new Set<string>();
      for (const provider of providers) {
        for (const value of provider[facet.key]) values.add(value);
      }
      collected[facet.key] = [...values].sort((a, b) =>
        a.localeCompare(b, "en", { sensitivity: "base" }),
      );
    }
    return collected;
  }, [providers]);

  const visible = useMemo(
    () => new Set(providers.filter((provider) => matchesSelection(provider, selection)).map((p) => p.slug)),
    [providers, selection],
  );

  const filtered = !isEmptySelection(selection);

  // A facet with nothing to choose from is disabled; its [NEEDS] note goes
  // under the whole row rather than inside the field, so the six fields stay
  // the same height and line up.
  const notes = FACETS.filter((facet) => options[facet.key].length === 0 && facet.needs);

  return (
    <section className="provider-directory" data-directory-ready={ready ? "true" : "false"}>
      <form
        className={`provider-directory__filters${filtered ? " provider-directory__filters--active" : ""}`}
        aria-label="Filter providers"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="provider-directory__field provider-directory__field--search">
          <label htmlFor={`${fieldId}-q`}>{SEARCH_LABEL}</label>
          <input
            id={`${fieldId}-q`}
            className="provider-directory__search"
            type="search"
            name="q"
            value={selection.q ?? ""}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            onChange={(event) => updateQuery(event.target.value)}
            // Results are already live; Enter has nothing to submit. The form
            // swallows submit too, this keeps the key from doing anything else.
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
          />
        </div>

        {FACETS.map((facet) => {
          const id = `${fieldId}-${facet.key}`;
          const values = options[facet.key];
          const wanted = selection[facet.key] ?? [];
          const current = wanted.join(",");
          // A value that arrived by URL (or several ORed together) may not be
          // one of the sheet's exact values; keep the control honest about it.
          const custom =
            current && !values.some((value) => value.toLowerCase() === current.toLowerCase())
              ? current
              : null;
          const selectValue = custom
            ? custom
            : (values.find((value) => value.toLowerCase() === current.toLowerCase()) ?? "");

          return (
            <div className="provider-directory__field" key={facet.key}>
              <label htmlFor={id}>{facet.label}</label>
              <select
                id={id}
                name={facet.key}
                value={selectValue}
                disabled={values.length === 0}
                onChange={(event) => update(facet.key, event.target.value)}
              >
                <option value="">All</option>
                {custom ? <option value={custom}>{wanted.join(", ")}</option> : null}
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        {filtered ? (
          <button type="button" className="provider-directory__clear" onClick={clear}>
            Clear filters
          </button>
        ) : null}

        {notes.length ? (
          <p className="provider-directory__notes">
            {notes.map((facet) => (
              <Needs key={facet.key} value={facet.needs!} />
            ))}
          </p>
        ) : null}
      </form>

      <p className="provider-directory__status" role="status" aria-live="polite">
        Showing {visible.size} of {providers.length} providers
      </p>

      <ul className="provider-cards">
        {providers.map((provider) => (
          <ProviderCard key={provider.slug} provider={provider} hidden={!visible.has(provider.slug)} />
        ))}
        {/* Hidden cards leave the grid, so the tile sizes itself to what is showing. */}
        <GridFill photo={fill} count={visible.size} />
      </ul>

      {admin.length ? (
        <div className="provider-directory__admin">
          <h3 id="welcome-and-admin-team">Welcome and admin team</h3>
          <ul>
            {admin.map((person) => (
              <li key={person.slug}>
                <span className="provider-directory__admin-name">{person.displayName}</span>
                {person.titleLine ? <span>, {person.titleLine}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

/** Same contract as the renderer's marker: visible in dev, inert in production. */
function Needs({ value }: { value: string }) {
  if (process.env.NODE_ENV === "production") {
    return <span data-needs={value} hidden />;
  }
  return <mark className="needs">[NEEDS: {value}]</mark>;
}
