import type { Difficulty, DifficultyMix, Question } from "@/lib/content/schema";
import { defaultRng, shuffle, type Rng } from "./random";

export const PASS_RATIO = 0.9;
export const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"];

/** Acertos mínimos para aprovar: ceil(0,9 · n). */
export function requiredCorrect(total: number): number {
  if (!Number.isInteger(total) || total <= 0) throw new Error("total precisa ser inteiro positivo");
  // Arredonda antes do ceil para não sofrer com erro de ponto flutuante (0,9·10 = 9,000000000000002).
  return Math.ceil(Math.round(PASS_RATIO * total * 1e9) / 1e9);
}

export function isPassing(correct: number, total: number): boolean {
  return correct >= requiredCorrect(total);
}

/**
 * Converte a proporção de dificuldade em contagens inteiras que somam `total`
 * (método do maior resto, desempate na ordem easy → medium → hard).
 */
export function allocateByDifficulty(total: number, mix: DifficultyMix): Record<Difficulty, number> {
  const raw = DIFFICULTIES.map((d) => ({ d, exact: mix[d] * total }));
  const counts = Object.fromEntries(raw.map(({ d, exact }) => [d, Math.floor(exact)])) as Record<Difficulty, number>;
  let remaining = total - DIFFICULTIES.reduce((s, d) => s + counts[d], 0);
  const byRemainder = raw
    .map(({ d, exact }, idx) => ({ d, rem: exact - Math.floor(exact), idx }))
    .sort((a, b) => b.rem - a.rem || a.idx - b.idx);
  for (const { d } of byRemainder) {
    if (remaining <= 0) break;
    counts[d] += 1;
    remaining -= 1;
  }
  return counts;
}

/**
 * Sorteia `count` questões sem repetição, respeitando a distribuição de dificuldade
 * e evitando as questões da tentativa anterior sempre que o banco permitir.
 * Ordem de preferência por faixa: inéditas → repetidas da tentativa anterior → outras faixas.
 */
export function pickQuestions<Q extends Pick<Question, "id" | "difficulty">>(
  bank: readonly Q[],
  count: number,
  mix: DifficultyMix,
  previousIds: readonly string[] = [],
  rng: Rng = defaultRng,
): Q[] {
  if (count > bank.length) throw new Error(`banco com ${bank.length} questões não comporta ${count}`);
  const previous = new Set(previousIds);
  const targets = allocateByDifficulty(count, mix);
  const picked: Q[] = [];
  const used = new Set<string>();

  const take = (pool: readonly Q[], n: number) => {
    for (const q of shuffle(pool, rng)) {
      if (n <= 0) break;
      if (used.has(q.id)) continue;
      picked.push(q);
      used.add(q.id);
      n -= 1;
    }
    return n;
  };

  let deficit = 0;
  for (const d of DIFFICULTIES) {
    const inBand = bank.filter((q) => q.difficulty === d);
    let need = take(
      inBand.filter((q) => !previous.has(q.id)),
      targets[d],
    );
    need = take(
      inBand.filter((q) => previous.has(q.id)),
      need,
    );
    deficit += need;
  }

  if (deficit > 0) {
    // Faixa sem questões suficientes: completa com qualquer outra, ainda preferindo inéditas.
    deficit = take(
      bank.filter((q) => !previous.has(q.id)),
      deficit,
    );
    take(bank, deficit);
  }

  return shuffle(picked, rng);
}

/* ------------------------------------------------------------------ */
/* Preparação (embaralhar alternativas) e correção                     */
/* ------------------------------------------------------------------ */

export type PreparedQuestion =
  | (Extract<Question, { type: "multiple-choice" | "output" | "multi-select" }> & { order: string[] })
  | (Extract<Question, { type: "ordering" }> & { order: string[] })
  | (Extract<Question, { type: "matching" }> & { order: string[] })
  | (Extract<Question, { type: "true-false" | "fill-blank" }> & { order: [] });

/**
 * `order` guarda a ordem de apresentação dos ids:
 * opções (escolha/saída/multi), itens embaralhados (ordenação) ou lado direito (associação).
 */
export function prepareQuestion(q: Question, rng: Rng = defaultRng): PreparedQuestion {
  switch (q.type) {
    case "multiple-choice":
    case "output":
    case "multi-select":
      return { ...q, order: shuffle(q.options.map((o) => o.id), rng) };
    case "ordering":
      return { ...q, order: shuffleAvoidingIdentity(q.items.map((i) => i.id), rng) };
    case "matching":
      return { ...q, order: shuffleAvoidingIdentity(q.pairs.map((p) => p.id), rng) };
    case "true-false":
    case "fill-blank":
      return { ...q, order: [] };
  }
}

/** Embaralha garantindo que a ordem final difira da original (quando há 2+ itens). */
export function shuffleAvoidingIdentity(ids: readonly string[], rng: Rng = defaultRng): string[] {
  if (ids.length < 2) return ids.slice();
  for (let attempt = 0; attempt < 10; attempt++) {
    const s = shuffle(ids, rng);
    if (s.some((id, i) => id !== ids[i])) return s;
  }
  // Fallback determinístico: rotaciona uma posição.
  return [...ids.slice(1), ids[0] as string];
}

export type QuestionResponse =
  | { type: "multiple-choice" | "output"; optionId: string }
  | { type: "true-false"; value: boolean }
  | { type: "multi-select"; optionIds: string[] }
  | { type: "ordering"; itemIds: string[] }
  | { type: "fill-blank"; text: string }
  /** pairId → id do par cujo lado direito foi escolhido */
  | { type: "matching"; matches: Record<string, string> };

/** Normaliza texto livre: caixa, acentos, espaços e pontuação nas pontas. */
export function normalizeAnswer(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^[\s.,;:!?"'()]+|[\s.,;:!?"'()]+$/g, "")
    .trim();
}

export function gradeQuestion(q: Question, r: QuestionResponse): boolean {
  switch (q.type) {
    case "multiple-choice":
    case "output":
      return (r.type === "multiple-choice" || r.type === "output") && r.optionId === q.answer;
    case "true-false":
      return r.type === "true-false" && r.value === q.answer;
    case "multi-select": {
      if (r.type !== "multi-select") return false;
      const chosen = new Set(r.optionIds);
      return chosen.size === q.answers.length && q.answers.every((a) => chosen.has(a));
    }
    case "ordering":
      return (
        r.type === "ordering" &&
        r.itemIds.length === q.items.length &&
        q.items.every((item, i) => r.itemIds[i] === item.id)
      );
    case "fill-blank": {
      if (r.type !== "fill-blank") return false;
      const given = normalizeAnswer(r.text);
      return given.length > 0 && q.accepted.some((a) => normalizeAnswer(a) === given);
    }
    case "matching":
      return r.type === "matching" && q.pairs.every((p) => r.matches[p.id] === p.id);
  }
}

/** Resposta está completa o bastante para ser enviada? */
export function isResponseComplete(q: Question, r: QuestionResponse | undefined): boolean {
  if (!r) return false;
  switch (r.type) {
    case "multiple-choice":
    case "output":
      return r.optionId.length > 0;
    case "true-false":
      return true;
    case "multi-select":
      return r.optionIds.length > 0;
    case "ordering":
      return q.type === "ordering" && r.itemIds.length === q.items.length;
    case "fill-blank":
      return r.text.trim().length > 0;
    case "matching":
      return q.type === "matching" && q.pairs.every((p) => Boolean(r.matches[p.id]));
  }
}
