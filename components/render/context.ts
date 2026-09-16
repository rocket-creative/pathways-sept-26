import { getAllUrls, type Block } from "@/lib/content";

/**
 * Everything a block component needs to know about the page it belongs to.
 * Server components cannot use React context, so this is threaded as a prop.
 */
export interface RenderContext {
  /** Page url plus source file, used in error messages. */
  source: string;
  /** frontMatter.url of the page being rendered. */
  url: string;
  /** /contact puts a form above the fold, so it cannot be lazy loaded. */
  eagerForms: boolean;
  /** The one form that may load eagerly; every later embed stays lazy. */
  firstForm: Block | null;
}

let urlSet: Set<string> | undefined;

function knownUrls(): Set<string> {
  if (!urlSet) urlSet = new Set(getAllUrls());
  return urlSet;
}

function normalizePath(href: string): string {
  const path = href.split("#")[0].split("?")[0];
  if (!path) return "";
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function isNonHttpScheme(href: string): boolean {
  return /^(tel|mailto|sms):/i.test(href);
}

/**
 * A root relative link that points nowhere is a broken page, so it fails the
 * build rather than shipping. Same page fragments are left alone.
 */
export function assertInternalHref(href: string, ctx: RenderContext): string {
  if (href.startsWith("#")) return href;

  const path = normalizePath(href);
  if (path && !knownUrls().has(path)) {
    throw new Error(
      `Broken internal link in ${ctx.source}: "${href}" resolves to "${path}", which is not in getAllUrls().`,
    );
  }
  return href;
}
