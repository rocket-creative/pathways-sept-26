/**
 * Care router quiz: questions, answers, and routing logic.
 *
 * OWNER: quiz agent (Agent F).
 *
 * This module is deliberately pure. No React, no DOM, no `node:fs`, no imports
 * from `lib/content` (that module reads the filesystem and must never reach the
 * client bundle). Everything here is data plus functions over that data, so the
 * routing table can be audited and unit tested without rendering anything.
 *
 * COPY SOURCE OF TRUTH: `content/pages/how-it-works.md`, the `[QUIZ]` block.
 * Every question legend and every answer label below is copied verbatim from
 * that file, including punctuation. The `(a)`/`(b)` markers from the source are
 * carried as option ids rather than as label text. Do not reword any of it; if
 * the copy is wrong, it changes in `content/`, not here.
 *
 * ROUTING SOURCE OF TRUTH: the "Routing rules for Cursor" line of the same
 * block. Each rule is annotated on the branch that implements it.
 */

/* ------------------------------------------------------------------ */
/* Question model                                                      */
/* ------------------------------------------------------------------ */

export type QuestionId = "q1" | "q2" | "q3" | "q4" | "q5";
export type OptionId = "a" | "b" | "c" | "d";

export interface QuizOption {
  /** The (a)/(b)/(c)/(d) marker from how-it-works.md. */
  readonly id: OptionId;
  /** Answer text, verbatim from how-it-works.md. */
  readonly label: string;
}

export interface QuizQuestion {
  readonly id: QuestionId;
  /** 1 based, matches the Q1..Q5 numbering in the source copy. */
  readonly number: number;
  /** Question text, verbatim from how-it-works.md, used as the <legend>. */
  readonly legend: string;
  readonly options: readonly QuizOption[];
}

/** The five questions, in source order. */
export const QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "q1",
    number: 1,
    legend: "What brings you here today?",
    options: [
      { id: "a", label: "Something on my mind, my mood, or my relationships." },
      { id: "b", label: "Something in my body: pain, tension, or recovery." },
      { id: "c", label: "I think I may need medication or want to review the medication I take." },
      { id: "d", label: "I am not sure. Something feels off." },
    ],
  },
  {
    id: "q2",
    number: 2,
    legend: "Who is this for?",
    options: [
      { id: "a", label: "Me, an adult." },
      { id: "b", label: "My child or teen." },
      { id: "c", label: "Me and my partner or my family." },
      { id: "d", label: "Someone I care about." },
    ],
  },
  {
    id: "q3",
    number: 3,
    legend: "Have you done therapy or treatment before?",
    options: [
      { id: "a", label: "Never." },
      { id: "b", label: "Yes, and it helped." },
      { id: "c", label: "Yes, and it did not help enough." },
      { id: "d", label: "I am in care now and want to add something." },
    ],
  },
  {
    id: "q4",
    number: 4,
    legend: "How do you want to meet?",
    options: [
      { id: "a", label: "In person on Long Island." },
      { id: "b", label: "By video." },
      { id: "c", label: "Either." },
    ],
  },
  {
    id: "q5",
    number: 5,
    legend: "Is any of this urgent?",
    options: [
      { id: "a", label: "No, I want to get started." },
      { id: "b", label: "I am struggling more than usual." },
      { id: "c", label: "I am in crisis right now." },
    ],
  },
] as const;

export const QUESTION_COUNT = QUESTIONS.length;

/** A partial answer set: an unanswered question is simply absent. */
export type AnswerSet = Partial<Record<QuestionId, OptionId>>;

/* ------------------------------------------------------------------ */
/* Result model                                                        */
/* ------------------------------------------------------------------ */

/**
 * A run of result text. `href` turns the run into a link, so a sentence from
 * the source copy can carry links without the component splitting strings.
 */
export interface TextSegment {
  readonly text: string;
  readonly href?: string;
}

export interface ResultLink {
  /** Short page name, taken from the target page's own h1. */
  readonly label: string;
  /** Root relative URL. Must exist in getUrlSet(); see auditResultUrls(). */
  readonly href: string;
}

export interface QuizResult {
  /** Result heading, verbatim from the routing rules in how-it-works.md. */
  readonly title: string;
  /** Pages this answer set points at. May be empty (the /contact result). */
  readonly links: readonly ResultLink[];
  /** The Q3(c) follow up line, or null. */
  readonly followUp: readonly TextSegment[] | null;
  /** Q5(c): the crisis panel renders above everything else in the result. */
  readonly crisis: readonly TextSegment[] | null;
}

/**
 * The single call to action every result ends at. Required by the master
 * prompt: "Every result ends at the same CTA: Start your 360 intake."
 */
export const CTA: ResultLink = { label: "Start your 360 intake", href: "/contact" };

/**
 * Q5(c) crisis panel. Source: "Q5(c) shows the crisis panel first (call or
 * text 988, Veterans press 1, or call 911) and then the CTA." Sentence cased
 * and given a full stop; the 988 and 911 numbers become tel:/sms: links, which
 * are dial actions rather than external site links.
 */
const CRISIS_PANEL: readonly TextSegment[] = [
  { text: "Call or text " },
  { text: "988", href: "tel:988" },
  { text: ", Veterans press 1, or call " },
  { text: "911", href: "tel:911" },
  { text: "." },
];

/**
 * Every page the router can link to. Labels are short forms of each target
 * page's h1, so nothing here is new copy. Keeping them in one table means
 * auditResultUrls() can prove the quiz never emits a dead link.
 */
const LINKS = {
  therapy: { label: "Therapy", href: "/therapy" },
  childTherapy: { label: "Therapy for children", href: "/therapy/child-therapy" },
  teenTherapy: { label: "Therapy for teens", href: "/therapy/teen-therapy" },
  couplesTherapy: { label: "Couples therapy", href: "/therapy/couples-therapy" },
  familyTherapy: { label: "Family therapy", href: "/therapy/family-therapy" },
  wellness: { label: "Wellness services", href: "/wellness" },
  massage: { label: "Massage therapy", href: "/wellness/massage" },
  acupuncture: { label: "Acupuncture", href: "/wellness/acupuncture" },
  medicationManagement: { label: "Medication management", href: "/medication-management" },
  emdr: { label: "EMDR therapy", href: "/therapy/emdr" },
  telehealth: { label: "Telehealth", href: "/telehealth" },
} as const satisfies Record<string, ResultLink>;

/**
 * Q3(c) follow up. Source: 'Q3(c) adds the line "Ask the Welcome Team about
 * EMDR, IFS, or a medication consult" with links to /therapy/emdr and
 * /medication-management.' The sentence is verbatim; only the two named links
 * are applied, exactly as the source specifies.
 */
const Q3C_FOLLOW_UP: readonly TextSegment[] = [
  { text: "Ask the Welcome Team about " },
  { text: "EMDR", href: LINKS.emdr.href },
  { text: ", IFS, or a " },
  { text: "medication consult", href: LINKS.medicationManagement.href },
];

/* ------------------------------------------------------------------ */
/* Routing                                                             */
/* ------------------------------------------------------------------ */

/** Q1 decides the pillar; Q2 refines the therapy branch. */
function baseResult(answers: AnswerSet): { title: string; links: ResultLink[] } {
  switch (answers.q1) {
    // Q1(a) -> result "Therapy" with a link to /therapy.
    case "a": {
      const links: ResultLink[] = [LINKS.therapy];
      // ...and, if Q2(b), /therapy/child-therapy or /therapy/teen-therapy.
      if (answers.q2 === "b") links.push(LINKS.childTherapy, LINKS.teenTherapy);
      // ...if Q2(c), /therapy/couples-therapy and /therapy/family-therapy.
      if (answers.q2 === "c") links.push(LINKS.couplesTherapy, LINKS.familyTherapy);
      return { title: "Therapy", links };
    }
    // Q1(b) -> result "Wellness" with /wellness/massage and /wellness/acupuncture.
    // The pillar hub is included first so the result leads with the pillar.
    case "b":
      return { title: "Wellness", links: [LINKS.wellness, LINKS.massage, LINKS.acupuncture] };
    // Q1(c) -> result "Medication Management" with /medication-management.
    case "c":
      return { title: "Medication Management", links: [LINKS.medicationManagement] };
    // Q1(d) -> result "The 360 intake is built for this" with /contact.
    // /contact is the shared CTA, so the result carries no extra page links.
    case "d":
    default:
      return { title: "The 360 intake is built for this", links: [] };
  }
}

/**
 * Maps an answer set to a result. Pure and total: a partial answer set is
 * valid input and falls back to the 360 intake result, which is the correct
 * destination for "I am not sure".
 */
export function routeAnswers(answers: AnswerSet): QuizResult {
  const { title, links } = baseResult(answers);

  // Q4(b) adds /telehealth. Q4(a) and Q4(c) add nothing, per the source rules.
  if (answers.q4 === "b") links.push(LINKS.telehealth);

  return {
    title,
    links,
    followUp: answers.q3 === "c" ? Q3C_FOLLOW_UP : null,
    // Q5(c) shows the crisis panel first, then the CTA.
    crisis: answers.q5 === "c" ? CRISIS_PANEL : null,
  };
}

/* ------------------------------------------------------------------ */
/* Audits (pure; run at build time by QuizSection.tsx)                 */
/* ------------------------------------------------------------------ */

/** Every answer set the quiz can produce, unanswered questions included. */
export function allAnswerSets(): AnswerSet[] {
  const sets: AnswerSet[] = [];
  const choices = QUESTIONS.map((question) => [
    undefined,
    ...question.options.map((option) => option.id),
  ]) as (OptionId | undefined)[][];

  const walk = (depth: number, partial: AnswerSet) => {
    if (depth === QUESTIONS.length) {
      sets.push(partial);
      return;
    }
    for (const choice of choices[depth]) {
      walk(depth + 1, choice ? { ...partial, [QUESTIONS[depth].id]: choice } : { ...partial });
    }
  };

  walk(0, {});
  return sets;
}

/** Root relative hrefs only: tel:, sms:, mailto:, and http(s) are not pages. */
function isInternal(href: string): boolean {
  return href.startsWith("/");
}

function resultUrls(result: QuizResult): string[] {
  return [
    ...result.links.map((link) => link.href),
    ...(result.followUp ?? []).map((segment) => segment.href),
    ...(result.crisis ?? []).map((segment) => segment.href),
    CTA.href,
  ].filter((href): href is string => typeof href === "string" && isInternal(href));
}

/**
 * Walks every reachable result and returns the internal URLs that are not in
 * the supplied URL set. Callers pass `getUrlSet()` from `lib/content`, so a
 * link that does not exist fails the build instead of shipping a 404.
 */
export function auditResultUrls(urlSet: ReadonlySet<string>): string[] {
  const missing = new Set<string>();
  for (const answers of allAnswerSets()) {
    for (const url of resultUrls(routeAnswers(answers))) {
      if (!urlSet.has(url)) missing.add(url);
    }
  }
  return [...missing];
}

/**
 * Services the practice cut, plus the words the spec forbids everywhere
 * (SPEC.md section 1). No result, question, or answer may name any of them.
 */
const BANNED_TERMS: readonly string[] = [
  "body sculpting",
  "body treatment",
  "skincare",
  "facial",
  "hair removal",
  "hair restoration",
  "prp",
  "laser",
  "accufit",
  "lutronic",
  "payment plan",
  "med spa",
  "medspa",
  "aesthetician",
  "pathways to beauty",
  "membership",
  "simplepractice",
  "ivypay",
  "vagaro",
  "cryotherapy",
  "iv therapy",
  "iv vitamin",
];

/** Every string the quiz can render, for the banned term audit. */
function allQuizText(): string[] {
  const text: string[] = [CTA.label];
  for (const question of QUESTIONS) {
    text.push(question.legend, ...question.options.map((option) => option.label));
  }
  for (const answers of allAnswerSets()) {
    const result = routeAnswers(answers);
    text.push(result.title);
    text.push(...result.links.map((link) => `${link.label} ${link.href}`));
    text.push(...(result.followUp ?? []).map((segment) => segment.text));
    text.push(...(result.crisis ?? []).map((segment) => segment.text));
  }
  return text;
}

/**
 * Returns any banned term that appears in quiz copy. Empty array means the
 * quiz names no cut service anywhere.
 */
export function auditBannedTerms(): string[] {
  const found = new Set<string>();
  const haystack = allQuizText().join(" \n ").toLowerCase();
  for (const term of BANNED_TERMS) {
    if (haystack.includes(term)) found.add(term);
  }
  return [...found];
}
