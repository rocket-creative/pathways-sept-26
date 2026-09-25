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
import ProviderCard from "./ProviderCard";
import type { ProviderCardData } from "./types";

/** Same controls as the LifeStance results finder, named for this practice. */
const PRIMARY: { key: FacetKey; label: string; needs?: string }[] = [
  { key: "locations", label: "Cities", needs: "assign providers to offices in the sheet" },
  { key: "pillars", label: "Types of Care" },
  { key: "specialties", label: "Areas of Focus" },
];

const ADDITIONAL: { key: FacetKey; label: string }[] = [
  { key: "modalities", label: "Service" },
  { key: "ageGroups", label: "Age" },
  { key: "formats", label: "Format" },
];

const FACETS: { key: FacetKey; label: string; needs?: string }[] = [...PRIMARY, ...ADDITIONAL];

const PILLAR_LABEL: Record<string, string> = {
  wisdom: "Therapy",
  wellness: "Wellness",
  medication: "Medication",
};

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
const SEARCH_LABEL = "Search By Keyword";
export default function ProviderDirectoryClient({
  providers,
  admin,
}: {
  providers: ProviderCardData[];
  admin: ProviderCardData[];
  /** Kept so the server can still pass a fill photo; the finder grid does not use it. */
  fill?: unknown;
}) {
  const [selection, setSelection] = useState<Selection>({});
  const [ready, setReady] = useState(false);
  const fieldId = useId();
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null);
  const [moreFilters, setMoreFilters] = useState(false);

  // Restore from the URL once, after hydration, so server and client agree
  // on the first render (everything visible).
  useEffect(() => {
    const restored = selectionFromSearch(window.location.search);
    setSelection(restored);
    if (ADDITIONAL.some((facet) => (restored[facet.key] ?? []).length > 0)) setMoreFilters(true);
    setReady(true);

    const onPopState = () => setSelection(selectionFromSearch(window.location.search));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const write = (next: Selection) => {
    const url = `${window.location.pathname}${searchFromSelection(next)}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", url);
    return next;
  };

  const toggleValue = (facet: FacetKey, value: string) => {
    setSelection((current) => {
      const next: Selection = { ...current };
      const have = new Set(next[facet] ?? []);
      if ([...have].some((item) => item.toLowerCase() === value.toLowerCase())) {
        for (const item of have) {
          if (item.toLowerCase() === value.toLowerCase()) have.delete(item);
        }
      } else {
        have.add(value);
      }
      if (have.size) next[facet] = [...have];
      else delete next[facet];
      return write(next);
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
        for (const value of provider[facet.key]) {
          if (!/needs/i.test(value)) values.add(value);
        }
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
        className="provider-directory__filters"
        aria-label="Filter providers"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="provider-directory__field provider-directory__field--search">
          <label className="provider-directory__search-label" htmlFor={`${fieldId}-q`}>
            {SEARCH_LABEL}
          </label>
          <input
            id={`${fieldId}-q`}
            className="provider-directory__search"
            type="search"
            name="q"
            placeholder={SEARCH_LABEL}
            value={selection.q ?? ""}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            onChange={(event) => updateQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
          />
        </div>

        <div className="provider-directory__chips">
          {PRIMARY.map((facet) => (
            <FilterChip
              key={facet.key}
              facet={facet.key}
              label={facet.label}
              values={options[facet.key]}
              selected={selection[facet.key] ?? []}
              open={openFacet === facet.key}
              onToggleOpen={() => setOpenFacet((current) => (current === facet.key ? null : facet.key))}
              onToggleValue={(value) => toggleValue(facet.key, value)}
            />
          ))}
        </div>

        <div className="provider-directory__tools">
          <button
            type="button"
            className="provider-directory__more"
            aria-expanded={moreFilters}
            onClick={() => setMoreFilters((open) => !open)}
          >
            Display Additional Filters
          </button>
          {filtered ? (
            <button type="button" className="provider-directory__clear" onClick={clear}>
              Clear All
            </button>
          ) : null}
        </div>

        {moreFilters ? (
          <div className="provider-directory__chips">
            {ADDITIONAL.map((facet) => (
              <FilterChip
                key={facet.key}
                facet={facet.key}
                label={facet.label}
                values={options[facet.key]}
                selected={selection[facet.key] ?? []}
                open={openFacet === facet.key}
                onToggleOpen={() => setOpenFacet((current) => (current === facet.key ? null : facet.key))}
                onToggleValue={(value) => toggleValue(facet.key, value)}
              />
            ))}
          </div>
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

      <ul className="provider-cards provider-cards--finder">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.slug}
            provider={provider}
            hidden={!visible.has(provider.slug)}
            layout="finder"
          />
        ))}
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

function optionLabel(facet: FacetKey, value: string): string {
  if (facet === "pillars") return PILLAR_LABEL[value.toLowerCase()] ?? value;
  return value.replace(/-/g, " ").replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function FilterChip({
  facet,
  label,
  values,
  selected,
  open,
  onToggleOpen,
  onToggleValue,
}: {
  facet: FacetKey;
  label: string;
  values: string[];
  selected: string[];
  open: boolean;
  onToggleOpen: () => void;
  onToggleValue: (value: string) => void;
}) {
  const picked = selected.length;

  return (
    <div className={`provider-directory__chip${open ? " provider-directory__chip--open" : ""}`}>
      <button
        type="button"
        className="provider-directory__chip-button"
        aria-expanded={open}
        disabled={values.length === 0}
        onClick={onToggleOpen}
      >
        <span>{picked ? `${label} (${picked})` : label}</span>
        <span aria-hidden="true">{open ? "–" : "+"}</span>
      </button>
      {open ? (
        <ul className="provider-directory__menu">
          {values.map((value) => {
            const checked = selected.some((item) => item.toLowerCase() === value.toLowerCase());
            return (
              <li key={value}>
                <label>
                  <input
                    type="checkbox"
                    name={facet}
                    value={value}
                    checked={checked}
                    onChange={() => onToggleValue(value)}
                  />
                  {optionLabel(facet, value)}
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/** Same contract as the renderer's marker: visible in dev, inert in production. */
function Needs({ value }: { value: string }) {
  if (process.env.NODE_ENV === "production") {
    return <span data-needs={value} hidden />;
  }
  return <mark className="needs">[NEEDS: {value}]</mark>;
}
