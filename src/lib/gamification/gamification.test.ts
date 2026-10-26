import { describe, expect, it } from "vitest";
import { addDays, daysBetween } from "./dates";
import { levelFromXp, xpToReachLevel } from "./levels";
import { cardFromMistake, MAX_BOX, reviewCard } from "./review";
import { activeStreak, EMPTY_STREAK, registerStudyDay } from "./streak";
import { comboSequence, computeAttemptXp, XP } from "./xp";

describe("XP", () => {
  it("combo conta acertos seguidos e zera no erro", () => {
    expect(comboSequence([true, true, false, true, true, true])).toEqual([1, 2, 0, 1, 2, 3]);
  });

  it("soma acertos, combo e bônus de aprovação de primeira", () => {
    const results = [true, true, true, true, true, true, true, true, true, false];
    const xp = computeAttemptXp({ results, passed: true, alreadyPassed: false, previousAttempts: 0 });
    expect(xp.answers).toBe(9 * XP.correctAnswer);
    expect(xp.combo).toBe(3 * XP.comboBonus); // combos 3, 6 e 9
    expect(xp.pass).toBe(XP.pass);
    expect(xp.firstTry).toBe(XP.firstTryPass);
    expect(xp.perfect).toBe(0);
    expect(xp.total).toBe(xp.answers + xp.combo + xp.pass + xp.firstTry);
    expect(xp.maxCombo).toBe(9);
  });

  it("não dá bônus de primeira na segunda tentativa", () => {
    const xp = computeAttemptXp({ results: Array(10).fill(true), passed: true, alreadyPassed: false, previousAttempts: 1 });
    expect(xp.firstTry).toBe(0);
    expect(xp.perfect).toBe(XP.perfectScore);
  });

  it("reduz XP depois que o módulo já foi aprovado", () => {
    const xp = computeAttemptXp({ results: Array(10).fill(true), passed: true, alreadyPassed: true, previousAttempts: 3 });
    expect(xp.total).toBe(10 * XP.correctAnswerAfterPass);
  });
});

describe("níveis", () => {
  it("nível 1 começa em 0 e a curva é crescente", () => {
    expect(xpToReachLevel(1)).toBe(0);
    for (let l = 2; l < 20; l++) {
      const gapPrev = xpToReachLevel(l) - xpToReachLevel(l - 1);
      const gapNext = xpToReachLevel(l + 1) - xpToReachLevel(l);
      expect(gapNext).toBeGreaterThanOrEqual(gapPrev);
    }
  });

  it("levelFromXp acerta as fronteiras", () => {
    expect(levelFromXp(0).level).toBe(1);
    expect(levelFromXp(xpToReachLevel(2) - 1).level).toBe(1);
    expect(levelFromXp(xpToReachLevel(2)).level).toBe(2);
    const info = levelFromXp(xpToReachLevel(3) + 10);
    expect(info.level).toBe(3);
    expect(info.current).toBe(10);
    expect(info.progress).toBeGreaterThan(0);
    expect(info.progress).toBeLessThan(1);
  });
});

describe("datas", () => {
  it("calcula diferença de dias atravessando meses e anos", () => {
    expect(daysBetween("2026-01-31", "2026-02-01")).toBe(1);
    expect(daysBetween("2025-12-31", "2026-01-01")).toBe(1);
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
  });
});

describe("streak", () => {
  it("começa em 1, soma em dias seguidos e não muda no mesmo dia", () => {
    let s = registerStudyDay(EMPTY_STREAK, "2026-10-01");
    expect(s.count).toBe(1);
    s = registerStudyDay(s, "2026-10-01");
    expect(s.count).toBe(1);
    s = registerStudyDay(s, "2026-10-02");
    s = registerStudyDay(s, "2026-10-03");
    expect(s.count).toBe(3);
    expect(s.best).toBe(3);
  });

  it("zera quando pula um dia, preservando o recorde", () => {
    let s = registerStudyDay(EMPTY_STREAK, "2026-10-01");
    s = registerStudyDay(s, "2026-10-02");
    s = registerStudyDay(s, "2026-10-05");
    expect(s.count).toBe(1);
    expect(s.best).toBe(2);
  });

  it("activeStreak mostra 0 se o último estudo foi antes de ontem", () => {
    const s = registerStudyDay(EMPTY_STREAK, "2026-10-01");
    expect(activeStreak(s, "2026-10-02")).toBe(1);
    expect(activeStreak(s, "2026-10-03")).toBe(0);
  });
});

describe("revisão espaçada (Leitner)", () => {
  const ref = { questionId: "q1", courseSlug: "c", moduleSlug: "m" };

  it("erro cria card na caixa 1 para hoje", () => {
    const card = cardFromMistake(undefined, ref, "2026-10-01");
    expect(card).toMatchObject({ box: 1, due: "2026-10-01", lapses: 0 });
  });

  it("acerto sobe de caixa e erro volta para a 1", () => {
    let card = cardFromMistake(undefined, ref, "2026-10-01");
    card = reviewCard(card, true, "2026-10-01")!;
    expect(card.box).toBe(2);
    expect(card.due).toBe("2026-10-02");
    card = reviewCard(card, false, "2026-10-02")!;
    expect(card.box).toBe(1);
    expect(card.lapses).toBe(1);
  });

  it("card sai da revisão depois da última caixa", () => {
    let card: ReturnType<typeof reviewCard> = { ...ref, box: MAX_BOX, due: "2026-10-01", lapses: 0 };
    card = reviewCard(card, true, "2026-10-01");
    expect(card).toBeNull();
  });
});
