"use client";

/**
 * Care router quiz, the interactive layer of /how-it-works#quiz.
 *
 * OWNER: quiz agent (Agent F).
 *
 * Copy comes from `./router`, which copies it verbatim out of
 * `content/pages/how-it-works.md`. Nothing in this file writes copy beyond the
 * control labels listed in CONTROLS below.
 *
 * How it is built, and why:
 *
 * - Progressive enhancement, not hydration gating. The server render (and the
 *   first client render, which must match it) shows all five questions, the
 *   list of where each answer leads, and the CTA. A visitor with JavaScript
 *   off reads the whole thing and can still reach /contact. `useEffect` then
 *   flips `enhanced`, which layers the one question at a time flow on top.
 * - Real form controls. Each question is a <fieldset> with a <legend> and real
 *   radio inputs with <label>s, so arrow keys, Tab, and screen reader forms
 *   mode all work natively. No div-with-onClick anywhere.
 * - One polite live region announces progress ("Question 2 of 5") and then the
 *   result. The result container also takes focus when it appears.
 * - The URL hash is never touched and nothing scrolls on mount: the master
 *   prompt forbids both. Focus moves only in response to a button press.
 * - Motion lives in quiz.css behind prefers-reduced-motion.
 * - No analytics, no third party scripts, no network calls of any kind.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  CTA,
  QUESTIONS,
  QUESTION_COUNT,
  routeAnswers,
  type AnswerSet,
  type OptionId,
  type QuestionId,
  type TextSegment,
} from "./router";
import "./quiz.css";

/**
 * The only strings this component authors. They are interface controls, not
 * page copy; they are listed here so a copy pass can find them in one place.
 * [NEEDS: confirm quiz control labels and progress wording]
 */
const CONTROLS = {
  back: "Back",
  next: "Next",
  finish: "See my result",
  restart: "Start over",
  progress: (current: number, total: number) => `Question ${current} of ${total}`,
  resultAnnouncement: (title: string) => `Your result: ${title}`,
} as const;

export interface QuizProps {
  /**
   * Display phone number, e.g. "(631) 371-3825". Passed in rather than read
   * from lib/content because that module touches the filesystem and must not
   * reach the client bundle. QuizSection.tsx supplies SITE_PHONE.
   */
  phone: string;
  /** tel: href for `phone`. QuizSection.tsx supplies SITE_PHONE_HREF. */
  phoneHref: string;
  /**
   * Anchor id. `/how-it-works#quiz` is a published URL, so this defaults to
   * "quiz" and should stay that way on that page.
   */
  anchorId?: string;
}

export default function Quiz({ phone, phoneHref, anchorId = "quiz" }: QuizProps) {
  const uid = useId();
  const [answers, setAnswers] = useState<AnswerSet>({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // False during SSR and on the first client render, so the two match. Flipped
  // in an effect, which only ever runs where JavaScript is available.
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);

  const questionRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const resultRef = useRef<HTMLDivElement | null>(null);
  // Guards against moving focus (and therefore scroll) on load.
  const movedByUser = useRef(false);

  const result = routeAnswers(answers);
  const isLastStep = step === QUESTION_COUNT - 1;

  const choose = useCallback((question: QuestionId, option: OptionId) => {
    setAnswers((previous) => ({ ...previous, [question]: option }));
  }, []);

  const goTo = useCallback((next: number) => {
    movedByUser.current = true;
    setStep(next);
  }, []);

  const finish = useCallback(() => {
    movedByUser.current = true;
    setShowResult(true);
  }, []);

  const restart = useCallback(() => {
    movedByUser.current = true;
    setAnswers({});
    setStep(0);
    setShowResult(false);
  }, []);

  // Focus follows the visible panel, but only after the visitor asked for it.
  useEffect(() => {
    if (!enhanced || !movedByUser.current) return;
    if (showResult) resultRef.current?.focus();
    else questionRefs.current[step]?.focus();
  }, [enhanced, showResult, step]);

  const liveMessage = showResult
    ? CONTROLS.resultAnnouncement(result.title)
    : CONTROLS.progress(step + 1, QUESTION_COUNT);

  return (
    <section id={anchorId} className="quiz" data-enhanced={enhanced ? "true" : "false"}>
      {/* Announces progress and then the result. Rendered only once enhanced:
          before that every question is on screen, so there is no progress. */}
      {enhanced ? (
        <p className="quiz__progress" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </p>
      ) : null}

      <form
        className="quiz__form"
        onSubmit={(event) => {
          // There is no server endpoint: results are computed locally.
          event.preventDefault();
          if (isLastStep) finish();
          else goTo(step + 1);
        }}
      >
        {QUESTIONS.map((question, index) => {
          const hidden = enhanced && (showResult || index !== step);
          return (
            <fieldset
              key={question.id}
              className="quiz__question"
              hidden={hidden}
              // Focusable only as a focus target, never in the Tab order.
              tabIndex={enhanced ? -1 : undefined}
              ref={(node) => {
                questionRefs.current[index] = node;
              }}
            >
              <legend className="quiz__legend">{question.legend}</legend>
              <div className="quiz__options">
                {question.options.map((option) => {
                  const inputId = `${uid}-${question.id}-${option.id}`;
                  return (
                    <div className="quiz__option" key={option.id}>
                      <input
                        className="quiz__radio"
                        type="radio"
                        id={inputId}
                        name={`${uid}-${question.id}`}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={() => choose(question.id, option.id)}
                      />
                      <label className="quiz__label" htmlFor={inputId}>
                        {option.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        {/* Controls exist only once enhanced: without JavaScript they would be
            dead buttons, and the static fallback below does their job. */}
        {enhanced && !showResult ? (
          <div className="quiz__controls">
            {step > 0 ? (
              <button type="button" className="quiz__nav" onClick={() => goTo(step - 1)}>
                {CONTROLS.back}
              </button>
            ) : null}
            <button type="submit" className="quiz__nav quiz__nav--primary">
              {isLastStep ? CONTROLS.finish : CONTROLS.next}
            </button>
          </div>
        ) : null}
      </form>

      {enhanced && showResult ? (
        <div
          className="quiz__result"
          ref={resultRef}
          tabIndex={-1}
          role="region"
          aria-labelledby={`${uid}-result-title`}
        >
          {/* Q5(c): the crisis panel comes first, then the result and the CTA. */}
          {result.crisis ? (
            <p className="quiz__crisis">
              <Segments segments={result.crisis} />
            </p>
          ) : null}

          <h3 className="quiz__result-title" id={`${uid}-result-title`}>
            {result.title}
          </h3>

          {result.links.length ? (
            <ul className="quiz__links">
              {result.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}

          {result.followUp ? (
            <p className="quiz__follow-up">
              <Segments segments={result.followUp} />
            </p>
          ) : null}

          <CallToAction phone={phone} phoneHref={phoneHref} />

          <p className="quiz__restart">
            <button type="button" className="quiz__nav" onClick={restart}>
              {CONTROLS.restart}
            </button>
          </p>
        </div>
      ) : null}

      {/* No JavaScript fallback, and the pre-enhancement render. Shows where
          each first answer leads, plus the same CTA, so the page is complete
          and actionable with scripting off. Labels are the Q1 answers and the
          result titles; no new sentences. */}
      {!enhanced ? (
        <div className="quiz__fallback">
          <ul className="quiz__paths">
            {QUESTIONS[0].options.map((option) => {
              const path = routeAnswers({ q1: option.id });
              return (
                <li key={option.id}>
                  {option.label} &mdash; {path.title}
                  {path.links.length ? (
                    <>
                      {": "}
                      {path.links.map((link, index) => (
                        <span key={link.href}>
                          {index > 0 ? ", " : null}
                          <Link href={link.href}>{link.label}</Link>
                        </span>
                      ))}
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <CallToAction phone={phone} phoneHref={phoneHref} />
        </div>
      ) : null}
    </section>
  );
}

/** The one shared ending: "Start your 360 intake" plus the phone number. */
function CallToAction({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  return (
    <>
      <p className="cta quiz__cta">
        <Link className="button" href={CTA.href}>
          {CTA.label}
        </Link>
      </p>
      <p className="quiz__phone">
        Call or text <a href={phoneHref}>{phone}</a>.
      </p>
    </>
  );
}

/** Renders a source sentence whose parts may carry links. */
function Segments({ segments }: { segments: readonly TextSegment[] }) {
  return (
    <>
      {segments.map((segment, index) => {
        if (!segment.href) return <span key={index}>{segment.text}</span>;
        return segment.href.startsWith("/") ? (
          <Link key={index} href={segment.href}>
            {segment.text}
          </Link>
        ) : (
          <a key={index} href={segment.href}>
            {segment.text}
          </a>
        );
      })}
    </>
  );
}
