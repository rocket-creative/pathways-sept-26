/**
 * Public surface of the quiz.
 *
 * OWNER: quiz agent (Agent F).
 *
 *   import Quiz from "@/components/quiz";
 *   <Quiz />
 *
 * The default export is the server wrapper: it reads the phone number from
 * lib/content and audits every URL the router can emit before rendering.
 * Import `./Quiz` directly only if you need to pass the phone number yourself.
 */

export { default } from "./QuizSection";
export { default as QuizSection } from "./QuizSection";
export { default as Quiz } from "./Quiz";
export type { QuizProps } from "./Quiz";
export type { QuizSectionProps } from "./QuizSection";
export {
  CTA,
  QUESTIONS,
  QUESTION_COUNT,
  allAnswerSets,
  auditBannedTerms,
  auditResultUrls,
  routeAnswers,
} from "./router";
export type {
  AnswerSet,
  OptionId,
  QuestionId,
  QuizOption,
  QuizQuestion,
  QuizResult,
  ResultLink,
  TextSegment,
} from "./router";
