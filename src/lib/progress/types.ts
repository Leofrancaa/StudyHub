import type { ReviewCard } from "@/lib/gamification/review";
import { EMPTY_STREAK, type StreakState } from "@/lib/gamification/streak";

export const PROGRESS_SCHEMA_VERSION = 1;

export type ModuleProgress = {
  slidesSeen: string[];
  attempts: number;
  /** Melhor nota (0–1). */
  bestScore: number;
  lastScore: number | null;
  passed: boolean;
  passedAt: string | null;
  /** Ids sorteados na última tentativa, para evitar repetição na próxima. */
  lastAttemptQuestionIds: string[];
};

export type ProgressState = {
  schemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  xp: number;
  streak: StreakState;
  studySeconds: number;
  reviewsDone: number;
  /** courseSlug → moduleSlug → progresso */
  courses: Record<string, Record<string, ModuleProgress>>;
  /** id da conquista → data ISO do desbloqueio */
  achievements: Record<string, string>;
  /** questionId → card de revisão */
  review: Record<string, ReviewCard>;
};

export const EMPTY_MODULE_PROGRESS: ModuleProgress = {
  slidesSeen: [],
  attempts: 0,
  bestScore: 0,
  lastScore: null,
  passed: false,
  passedAt: null,
  lastAttemptQuestionIds: [],
};

export function createEmptyProgress(): ProgressState {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    xp: 0,
    streak: { ...EMPTY_STREAK },
    studySeconds: 0,
    reviewsDone: 0,
    courses: {},
    achievements: {},
    review: {},
  };
}

export function getModuleProgress(state: ProgressState, courseSlug: string, moduleSlug: string): ModuleProgress {
  return state.courses[courseSlug]?.[moduleSlug] ?? EMPTY_MODULE_PROGRESS;
}
