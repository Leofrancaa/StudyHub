import { newlyUnlocked, type AchievementContext, type AchievementDef } from "@/lib/gamification/achievements";
import { toDayKey } from "@/lib/gamification/dates";
import { levelFromXp } from "@/lib/gamification/levels";
import { cardFromMistake, reviewCard } from "@/lib/gamification/review";
import { registerStudyDay } from "@/lib/gamification/streak";
import { computeAttemptXp, XP, type AttemptXpBreakdown } from "@/lib/gamification/xp";
import { isPassing } from "@/lib/quiz/engine";
import { getModuleProgress, type ModuleProgress, type ProgressState } from "./types";

/**
 * Funções puras que transformam o estado de progresso.
 * A store (Zustand) só delega para cá, o que mantém tudo testável sem React.
 */

export type ProgressEvent =
  | { kind: "xp"; amount: number }
  | { kind: "level-up"; level: number; name: string }
  | { kind: "achievement"; achievement: Pick<AchievementDef, "id" | "title" | "description" | "icon"> };

export type ReducerResult<T = undefined> = { state: ProgressState; events: ProgressEvent[]; detail: T };

function setModule(state: ProgressState, courseSlug: string, moduleSlug: string, next: ModuleProgress): ProgressState {
  return {
    ...state,
    courses: { ...state.courses, [courseSlug]: { ...state.courses[courseSlug], [moduleSlug]: next } },
  };
}

/** Aplica XP, streak e conquistas, gerando os eventos de celebração correspondentes. */
function finalize(
  before: ProgressState,
  after: ProgressState,
  xpGained: number,
  now: Date,
  ctx: AchievementContext,
  touchStreak: boolean,
): { state: ProgressState; events: ProgressEvent[] } {
  let state: ProgressState = { ...after, xp: after.xp + xpGained };
  if (touchStreak) state = { ...state, streak: registerStudyDay(state.streak, toDayKey(now)) };

  const events: ProgressEvent[] = [];
  if (xpGained > 0) events.push({ kind: "xp", amount: xpGained });

  const unlocked = newlyUnlocked(state, ctx);
  if (unlocked.length > 0) {
    const stamp = now.toISOString();
    state = { ...state, achievements: { ...state.achievements, ...Object.fromEntries(unlocked.map((a) => [a.id, stamp])) } };
    for (const a of unlocked) {
      events.push({ kind: "achievement", achievement: { id: a.id, title: a.title, description: a.description, icon: a.icon } });
    }
  }

  const prevLevel = levelFromXp(before.xp).level;
  const nextLevel = levelFromXp(state.xp);
  if (nextLevel.level > prevLevel) events.push({ kind: "level-up", level: nextLevel.level, name: nextLevel.name });

  return { state, events };
}

export function applySlideSeen(
  state: ProgressState,
  courseSlug: string,
  moduleSlug: string,
  slideId: string,
  now: Date,
): ReducerResult {
  const current = getModuleProgress(state, courseSlug, moduleSlug);
  if (current.slidesSeen.includes(slideId)) return { state, events: [], detail: undefined };
  const after = setModule(state, courseSlug, moduleSlug, { ...current, slidesSeen: [...current.slidesSeen, slideId] });
  const { state: next, events } = finalize(state, after, XP.slideSeen, now, {}, true);
  return { state: next, events, detail: undefined };
}

export type QuizResultInput = {
  courseSlug: string;
  moduleSlug: string;
  /** Na ordem em que foram respondidas. */
  answers: readonly { questionId: string; correct: boolean }[];
  /** Todos os módulos do curso (em ordem) e quantos estão planejados, para checar "curso completo". */
  courseModuleSlugs: readonly string[];
  upcomingCount: number;
};

export type QuizResultDetail = {
  correct: number;
  total: number;
  score: number;
  passed: boolean;
  firstPass: boolean;
  xp: AttemptXpBreakdown;
};

export function applyQuizResult(state: ProgressState, input: QuizResultInput, now: Date): ReducerResult<QuizResultDetail> {
  const { courseSlug, moduleSlug, answers } = input;
  const total = answers.length;
  if (total === 0) throw new Error("tentativa sem respostas");
  const correct = answers.filter((a) => a.correct).length;
  const passed = isPassing(correct, total);
  const score = correct / total;
  const current = getModuleProgress(state, courseSlug, moduleSlug);

  const xp = computeAttemptXp({
    results: answers.map((a) => a.correct),
    passed,
    alreadyPassed: current.passed,
    previousAttempts: current.attempts,
  });

  const nextModule: ModuleProgress = {
    ...current,
    attempts: current.attempts + 1,
    bestScore: Math.max(current.bestScore, score),
    lastScore: score,
    passed: current.passed || passed,
    passedAt: current.passedAt ?? (passed ? now.toISOString() : null),
    lastAttemptQuestionIds: answers.map((a) => a.questionId),
  };

  let after = setModule(state, courseSlug, moduleSlug, nextModule);

  // Cada erro vira (ou volta a ser) flashcard de revisão para hoje.
  const today = toDayKey(now);
  const review = { ...after.review };
  for (const a of answers) {
    if (a.correct) continue;
    review[a.questionId] = cardFromMistake(review[a.questionId], { questionId: a.questionId, courseSlug, moduleSlug }, today);
  }
  after = { ...after, review };

  const courseDone =
    input.upcomingCount === 0 &&
    input.courseModuleSlugs.length > 0 &&
    input.courseModuleSlugs.every((m) => getModuleProgress(after, courseSlug, m).passed);

  const ctx: AchievementContext = {
    quiz: { score, passed, previousAttempts: current.attempts, maxCombo: xp.maxCombo },
    completedCourses: courseDone ? [courseSlug] : [],
  };
  const { state: next, events } = finalize(state, after, xp.total, now, ctx, true);
  return {
    state: next,
    events,
    detail: { correct, total, score, passed, firstPass: passed && !current.passed, xp },
  };
}

export function applyReviewAnswer(state: ProgressState, questionId: string, remembered: boolean, now: Date): ReducerResult {
  const card = state.review[questionId];
  if (!card) return { state, events: [], detail: undefined };
  const updated = reviewCard(card, remembered, toDayKey(now));
  const review = { ...state.review };
  if (updated) review[questionId] = updated;
  else delete review[questionId];
  const after = { ...state, review, reviewsDone: state.reviewsDone + 1 };
  const { state: next, events } = finalize(state, after, remembered ? XP.slideSeen : 0, now, {}, true);
  return { state: next, events, detail: undefined };
}

export function applyStudyTime(state: ProgressState, seconds: number, now: Date): ReducerResult {
  if (!(seconds > 0)) return { state, events: [], detail: undefined };
  const after = { ...state, studySeconds: state.studySeconds + Math.round(seconds) };
  const { state: next, events } = finalize(state, after, 0, now, {}, false);
  return { state: next, events, detail: undefined };
}
