import { addDays, daysBetween, type DayKey } from "./dates";

/** Repetição espaçada simples (caixas de Leitner). */
export const LEITNER_INTERVALS = [0, 1, 3, 7, 14] as const;
export const MAX_BOX = LEITNER_INTERVALS.length;

export type ReviewCard = {
  questionId: string;
  courseSlug: string;
  moduleSlug: string;
  /** 1 a MAX_BOX */
  box: number;
  due: DayKey;
  lapses: number;
};

export function intervalForBox(box: number): number {
  return LEITNER_INTERVALS[Math.min(Math.max(box, 1), MAX_BOX) - 1] ?? 0;
}

/** Erro no quiz: cria o card (ou rebaixa para a caixa 1) com revisão para hoje. */
export function cardFromMistake(
  existing: ReviewCard | undefined,
  ref: Pick<ReviewCard, "questionId" | "courseSlug" | "moduleSlug">,
  today: DayKey,
): ReviewCard {
  return { ...ref, box: 1, due: today, lapses: (existing?.lapses ?? 0) + (existing ? 1 : 0) };
}

/** Resultado de uma revisão. Acertar sobe de caixa; errar volta para a 1. Devolve null se dominado. */
export function reviewCard(card: ReviewCard, remembered: boolean, today: DayKey): ReviewCard | null {
  if (!remembered) return { ...card, box: 1, due: addDays(today, intervalForBox(1)), lapses: card.lapses + 1 };
  const box = card.box + 1;
  if (box > MAX_BOX) return null;
  return { ...card, box, due: addDays(today, intervalForBox(box)) };
}

export function isDue(card: ReviewCard, today: DayKey): boolean {
  return daysBetween(card.due, today) >= 0;
}
