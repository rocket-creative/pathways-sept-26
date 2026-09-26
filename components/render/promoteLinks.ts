import { inlineToText, type InlineNode } from "@/lib/content";

/**
 * Decide when a prose paragraph's links should render as pill buttons.
 *
 * Appropriate: link-only rows (concerns strips, insurance menus), and a
 * trailing Explore/Browse/See action after a paragraph. Not appropriate:
 * mid-sentence service names, citations, phone/mailto, or nav chrome.
 */

export type PromotedLink = { label: string; href: string };

export type PromoteResult =
  | { kind: "unchanged" }
  | { kind: "link-row"; links: PromotedLink[] }
  | { kind: "split"; prose: InlineNode[]; link: PromotedLink };

const SEPARATOR_RE = /^[\s·•|,/&+\-–—]*$/;
const SEPARATOR_WORDS_RE = /^(and|or)$/i;

/** Labels that are already written as actions. */
const ACTION_LABEL_RE =
  /^(Explore|Browse|Meet|View|See every|See all|Learn more|Get started|Book with|Book |Start your|Start |Schedule|Contact the|Contact |Work with|How care works|How it works|Insurance and fees|All concerns|Open in|Browse all)/i;

/** Destination names only promoted when a "See …" lead-in precedes them. */
const DEST_LABEL_RE =
  /^(how it works|how care works|insurance and fees|therapy hub|provider directory|providers|wellness pillar|therapy services|cupping page|contact form|about)$/i;

const LEAD_IN_RE =
  /\s*(See|Read(?: the)?(?: full)?(?: process)?(?: more)?(?: about| at)?|Learn more(?: on our)?|or see(?: all of our| everything under our)?|or browse(?: the)?|or return to(?: the)?|Meet the team in(?: the)?)\s*$/i;

export function promoteParagraphLinks(nodes: InlineNode[]): PromoteResult {
  if (!nodes.length) return { kind: "unchanged" };

  const linkRow = asLinkRow(nodes);
  if (linkRow) return { kind: "link-row", links: linkRow };

  return asTrailingAction(nodes);
}

function asLinkRow(nodes: InlineNode[]): PromotedLink[] | null {
  const links: PromotedLink[] = [];

  for (const node of nodes) {
    if (node.kind === "link") {
      if (!isInternalPath(node.href)) return null;
      links.push({ label: inlineToText(node.children), href: node.href });
      continue;
    }
    if (node.kind === "text") {
      const value = node.value.trim();
      if (!value) continue;
      if (SEPARATOR_RE.test(value) || SEPARATOR_WORDS_RE.test(value)) continue;
      return null;
    }
    return null;
  }

  return links.length ? links : null;
}

function asTrailingAction(nodes: InlineNode[]): PromoteResult {
  let end = nodes.length - 1;
  while (end >= 0) {
    const node = nodes[end];
    if (node.kind === "text" && /^[\s.]*$/.test(node.value)) {
      end -= 1;
      continue;
    }
    break;
  }
  if (end < 0) return { kind: "unchanged" };

  const last = nodes[end];
  if (last.kind !== "link" || !isInternalPath(last.href)) return { kind: "unchanged" };

  const label = inlineToText(last.children).trim();
  if (!label) return { kind: "unchanged" };

  const before = nodes.slice(0, end);
  if (!before.length) {
    // Lone link paragraph → button.
    return { kind: "split", prose: [], link: { label, href: last.href } };
  }

  // Mid-paragraph links stay as text; only a true trailing action promotes.
  const earlierLinks = before.some((node) => node.kind === "link");
  if (earlierLinks && !ACTION_LABEL_RE.test(label)) {
    return { kind: "unchanged" };
  }

  const beforeText = inlineToText(before);
  const action = ACTION_LABEL_RE.test(label);
  const destWithLeadIn = DEST_LABEL_RE.test(label) && LEAD_IN_RE.test(beforeText);
  const actionWithLeadIn = action && LEAD_IN_RE.test(beforeText);

  if (!action && !destWithLeadIn) return { kind: "unchanged" };

  let prose = trimTrailingWhitespace(before);
  if (destWithLeadIn || actionWithLeadIn) {
    prose = stripLeadIn(prose);
  }

  // Drop a dangling "at"/"on"/"to" left after stripping a lead-in.
  prose = trimTrailingGlue(prose);

  if (!prose.length) {
    return { kind: "split", prose: [], link: { label, href: last.href } };
  }

  return { kind: "split", prose, link: { label, href: last.href } };
}

function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function trimTrailingWhitespace(nodes: InlineNode[]): InlineNode[] {
  const out = [...nodes];
  while (out.length) {
    const last = out[out.length - 1];
    if (last.kind !== "text") break;
    const trimmed = last.value.replace(/\s+$/, "");
    if (!trimmed) {
      out.pop();
      continue;
    }
    if (trimmed !== last.value) out[out.length - 1] = { kind: "text", value: trimmed };
    break;
  }
  return out;
}

function stripLeadIn(nodes: InlineNode[]): InlineNode[] {
  const text = inlineToText(nodes);
  const match = LEAD_IN_RE.exec(text);
  if (!match) return nodes;

  const cutAt = match.index;
  // Rebuild by consuming nodes until we reach cutAt characters of plain text.
  let seen = 0;
  const out: InlineNode[] = [];
  for (const node of nodes) {
    const piece = node.kind === "text" ? node.value : inlineToText([node]);
    if (seen + piece.length <= cutAt) {
      out.push(node);
      seen += piece.length;
      continue;
    }
    if (node.kind === "text" && seen < cutAt) {
      const keep = node.value.slice(0, cutAt - seen).replace(/\s+$/, "");
      if (keep) out.push({ kind: "text", value: keep });
    }
    break;
  }
  return trimTrailingWhitespace(out);
}

function trimTrailingGlue(nodes: InlineNode[]): InlineNode[] {
  const out = trimTrailingWhitespace(nodes);
  if (!out.length) return out;
  const last = out[out.length - 1];
  if (last.kind !== "text") return out;
  const trimmed = last.value.replace(/\s+(at|on|to|the)\s*$/i, "").replace(/[,\s]+$/g, "");
  if (!trimmed) {
    out.pop();
    return trimTrailingWhitespace(out);
  }
  out[out.length - 1] = { kind: "text", value: trimmed };
  return out;
}

/** List item that is only a link (no surrounding copy) → quiet button. */
export function promoteListItemLinks(nodes: InlineNode[]): PromotedLink | null {
  const row = asLinkRow(nodes);
  return row && row.length === 1 ? row[0] : null;
}
