"use client";

import { useId, useMemo, useState } from "react";
import ProviderCard from "./ProviderCard";
import type { ProviderCardData } from "./types";

type FacetKey = "pillars" | "specialties" | "modalities" | "ageGroups" | "locations" | "formats";

/** Labels come from the filter list in content/pages/providers.md. */
const FACETS: { key: FacetKey; label: string; needs?: string }[] = [
  { key: "pillars", label: "Pillar" },
  { key: "specialties", label: "Concern" },
  { key: "modalities", label: "Modality" },
  { key: "ageGroups", label: "Age group" },
  { key: "locations", label: "Location", needs: "assign providers to offices in the sheet" },
  { key: "formats", label: "Format" },
];

type Selection = Record<FacetKey, string>;

const EMPTY: Selection = {
  pillars: "",
  specialties: "",
  modalities: "",
  ageGroups: "",
  locations: "",
  formats: "",
};

export default function ProviderDirectoryClient({
  providers,
  admin,
}: {
  providers: ProviderCardData[];
  admin: ProviderCardData[];
}) {
  const [selection, setSelection] = useState<Selection>(EMPTY);
  const fieldId = useId();

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
    () =>
      providers.filter((provider) =>
        FACETS.every(({ key }) => {
          const wanted = selection[key];
          if (!wanted) return true;
          return provider[key].some((value) => value.toLowerCase() === wanted.toLowerCase());
        }),
      ),
    [providers, selection],
  );

  const filtered = FACETS.some(({ key }) => selection[key]);

  return (
    <section className="provider-directory">
      <form
        className="provider-directory__filters"
        aria-label="Filter providers"
        onSubmit={(event) => event.preventDefault()}
      >
        {FACETS.map((facet) => {
          const id = `${fieldId}-${facet.key}`;
          const values = options[facet.key];
          return (
            <div className="provider-directory__field" key={facet.key}>
              <label htmlFor={id}>{facet.label}</label>
              <select
                id={id}
                name={facet.key}
                value={selection[facet.key]}
                disabled={values.length === 0}
                onChange={(event) =>
                  setSelection((current) => ({ ...current, [facet.key]: event.target.value }))
                }
              >
                <option value="">All</option>
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {values.length === 0 && facet.needs ? <Needs value={facet.needs} /> : null}
            </div>
          );
        })}

        {filtered ? (
          <button
            type="button"
            className="provider-directory__clear"
            onClick={() => setSelection(EMPTY)}
          >
            Clear filters
          </button>
        ) : null}
      </form>

      <p className="provider-directory__status" role="status" aria-live="polite">
        Showing {visible.length} of {providers.length} providers
      </p>

      <ul className="provider-cards">
        {visible.map((provider) => (
          <ProviderCard key={provider.slug} provider={provider} />
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

/** Same contract as the renderer's marker: visible in dev, inert in production. */
function Needs({ value }: { value: string }) {
  if (process.env.NODE_ENV === "production") {
    return <span data-needs={value} hidden />;
  }
  return <mark className="needs">[NEEDS: {value}]</mark>;
}
