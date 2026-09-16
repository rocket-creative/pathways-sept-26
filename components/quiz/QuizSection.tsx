/**
 * Server wrapper for the care router quiz. This is the mount point.
 *
 * OWNER: quiz agent (Agent F).
 *
 * Two jobs, both of which have to happen on the server:
 *
 * 1. Supply the practice facts (phone number) from `lib/content`, the single
 *    source of truth. `lib/content` reads the filesystem, so a client
 *    component can never import it; it is read here and passed down as props.
 * 2. Audit the router before anything renders. Every internal URL the quiz can
 *    emit is checked against `getUrlSet()`, and every string it can render is
 *    checked against the cut service list. A failure throws during the static
 *    render, which fails the build instead of shipping a dead link or a
 *    service the practice no longer offers.
 *
 * Mount it with no props:  <QuizSection />
 */

import { SITE_PHONE, SITE_PHONE_HREF, getUrlSet } from "@/lib/content";
import Quiz from "./Quiz";
import { auditBannedTerms, auditResultUrls } from "./router";

export interface QuizSectionProps {
  /** Anchor id for the section. Leave as "quiz" on /how-it-works. */
  anchorId?: string;
}

export default function QuizSection({ anchorId = "quiz" }: QuizSectionProps) {
  const missingUrls = auditResultUrls(getUrlSet());
  if (missingUrls.length) {
    throw new Error(
      `Quiz router links to URLs that are not in url-map.csv: ${missingUrls.join(", ")}`,
    );
  }

  const bannedTerms = auditBannedTerms();
  if (bannedTerms.length) {
    throw new Error(`Quiz copy names cut or banned services: ${bannedTerms.join(", ")}`);
  }

  return <Quiz phone={SITE_PHONE} phoneHref={SITE_PHONE_HREF} anchorId={anchorId} />;
}
