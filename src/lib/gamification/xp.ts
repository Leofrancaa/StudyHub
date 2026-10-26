/** Tabela de XP. Centralizada para manter a interface e a store consistentes. */
export const XP = {
  slideSeen: 5,
  correctAnswer: 10,
  /** Depois de aprovado, acertos no mesmo módulo valem menos (evita farm de XP). */
  correctAnswerAfterPass: 2,
  /** Bônus a cada 3 acertos seguidos na mesma tentativa. */
  comboStep: 3,
  comboBonus: 5,
  pass: 25,
  firstTryPass: 50,
  perfectScore: 30,
} as const;

export type AttemptXpInput = {
  /** Resultado de cada questão, na ordem respondida. */
  results: readonly boolean[];
  passed: boolean;
  /** O módulo já estava aprovado antes desta tentativa? */
  alreadyPassed: boolean;
  /** Número de tentativas anteriores neste módulo. */
  previousAttempts: number;
};

export type AttemptXpBreakdown = {
  answers: number;
  combo: number;
  pass: number;
  firstTry: number;
  perfect: number;
  total: number;
  maxCombo: number;
};

/** Combo atual (acertos seguidos) depois de cada resposta. */
export function comboSequence(results: readonly boolean[]): number[] {
  let combo = 0;
  return results.map((ok) => (combo = ok ? combo + 1 : 0));
}

function baseXp(alreadyPassed: boolean): number {
  return alreadyPassed ? XP.correctAnswerAfterPass : XP.correctAnswer;
}

function comboXp(comboAfter: number, alreadyPassed: boolean): number {
  return !alreadyPassed && comboAfter > 0 && comboAfter % XP.comboStep === 0 ? XP.comboBonus : 0;
}

/** XP de uma resposta isolada (usado no feedback imediato do quiz). */
export function xpForAnswer(correct: boolean, comboAfter: number, alreadyPassed: boolean): number {
  return correct ? baseXp(alreadyPassed) + comboXp(comboAfter, alreadyPassed) : 0;
}

export function computeAttemptXp(input: AttemptXpInput): AttemptXpBreakdown {
  const combos = comboSequence(input.results);
  let answers = 0;
  let combo = 0;
  input.results.forEach((ok, i) => {
    if (!ok) return;
    answers += baseXp(input.alreadyPassed);
    combo += comboXp(combos[i] ?? 0, input.alreadyPassed);
  });
  const firstPassNow = input.passed && !input.alreadyPassed;
  const pass = firstPassNow ? XP.pass : 0;
  const firstTry = firstPassNow && input.previousAttempts === 0 ? XP.firstTryPass : 0;
  const perfect = firstPassNow && input.results.length > 0 && input.results.every(Boolean) ? XP.perfectScore : 0;
  return {
    answers,
    combo,
    pass,
    firstTry,
    perfect,
    total: answers + combo + pass + firstTry + perfect,
    maxCombo: Math.max(0, ...combos),
  };
}
