import { daysBetween, type DayKey } from "./dates";

export type StreakState = {
  count: number;
  best: number;
  lastStudyDay: DayKey | null;
};

export const EMPTY_STREAK: StreakState = { count: 0, best: 0, lastStudyDay: null };

/** Registra estudo em `today`. Mesmo dia: mantém. Dia seguinte: +1. Pulou dia: recomeça em 1. */
export function registerStudyDay(state: StreakState, today: DayKey): StreakState {
  if (state.lastStudyDay === null) return { count: 1, best: Math.max(1, state.best), lastStudyDay: today };
  const gap = daysBetween(state.lastStudyDay, today);
  if (gap <= 0) return state;
  const count = gap === 1 ? state.count + 1 : 1;
  return { count, best: Math.max(state.best, count), lastStudyDay: today };
}

/** Streak exibido hoje: zera se o último estudo foi antes de ontem. */
export function activeStreak(state: StreakState, today: DayKey): number {
  if (state.lastStudyDay === null) return 0;
  return daysBetween(state.lastStudyDay, today) <= 1 ? state.count : 0;
}
