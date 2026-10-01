import { getProviders, type Block, type Provider } from "@/lib/content";
import type { SectionPhoto } from "@/lib/images";

/**
 * A section that introduces one person gets that person's headshot when the
 * page has not already assigned a photograph. The heading has to name them
 * (first and last), or be "Meet {first}" when that first name is unique.
 */
export function providerNamedIn(text: string): Provider | undefined {
  const haystack = normalize(text);
  const providers = getProviders().filter((provider) => provider.active);
  const named = providers.filter(
    (provider) => mentions(haystack, provider.first_name) && mentions(haystack, provider.last_name),
  );
  if (named.length === 1) return named[0];

  const meet = /^meet ([a-z]+)\b/.exec(haystack);
  if (!meet) return undefined;
  const byFirst = providers.filter((provider) => normalize(provider.first_name) === meet[1]);
  return byFirst.length === 1 ? byFirst[0] : undefined;
}

export function personSectionPhoto(
  heading: string,
  blocks: Block[],
  position: number,
): SectionPhoto | undefined {
  const provider = providerNamedIn(heading) ?? providerInSubheads(blocks);
  if (!provider) return undefined;

  return {
    asset: `headshot:${provider.slug}`,
    alt: `Portrait of ${provider.displayName}`,
    shape: "circle",
    side: position % 2 === 0 ? "end" : "start",
    layout: "split",
    focal: "center",
  };
}

function providerInSubheads(blocks: Block[]): Provider | undefined {
  const subheads = blocks.filter((block) => block.kind === "heading" && block.level === 3);
  if (subheads.length === 0) return undefined;

  const named = subheads.map((block) => (block.kind === "heading" ? providerNamedIn(block.text) : undefined));
  if (subheads.length === 1) return named[0];

  const hits = named.filter((provider): provider is Provider => Boolean(provider));
  if (hits.length !== subheads.length) return undefined;
  return hits.every((provider) => provider.slug === hits[0].slug) ? hits[0] : undefined;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function mentions(haystack: string, name: string): boolean {
  const token = normalize(name);
  if (!token) return false;
  return new RegExp(`(?:^| )${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?: |$)`).test(haystack);
}
