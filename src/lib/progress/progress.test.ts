import { describe, expect, it } from "vitest";
import { XP } from "@/lib/gamification/xp";
import { applyQuizResult, applyReviewAnswer, applySlideSeen, applyStudyTime } from "./reducers";
import { migrateProgress, MemoryProgressRepository } from "./repository";
import { createEmptyProgress, getModuleProgress } from "./types";
import { courseCompletion, isModuleUnlocked, moduleStatus } from "./unlock";

const now = new Date(2026, 9, 26, 10, 0, 0);
const modules = ["m1", "m2", "m3"];

function answers(correct: number, total: number) {
  return Array.from({ length: total }, (_, i) => ({ questionId: `q${i}`, correct: i < correct }));
}

describe("desbloqueio de módulos", () => {
  it("só o primeiro começa liberado", () => {
    const s = createEmptyProgress();
    expect(isModuleUnlocked(s, "c", modules, 0)).toBe(true);
    expect(isModuleUnlocked(s, "c", modules, 1)).toBe(false);
    expect(moduleStatus(s, "c", modules, 2)).toBe("locked");
  });

  it("libera o próximo só depois da aprovação (≥ 90%)", () => {
    let s = createEmptyProgress();
    s = applyQuizResult(s, { courseSlug: "c", moduleSlug: "m1", answers: answers(8, 10), courseModuleSlugs: modules, upcomingCount: 0 }, now).state;
    expect(isModuleUnlocked(s, "c", modules, 1)).toBe(false);
    s = applyQuizResult(s, { courseSlug: "c", moduleSlug: "m1", answers: answers(9, 10), courseModuleSlugs: modules, upcomingCount: 0 }, now).state;
    expect(isModuleUnlocked(s, "c", modules, 1)).toBe(true);
    expect(moduleStatus(s, "c", modules, 0)).toBe("completed");
    expect(moduleStatus(s, "c", modules, 1)).toBe("available");
  });

  it("aprovação não se perde com uma tentativa ruim depois", () => {
    let s = createEmptyProgress();
    s = applyQuizResult(s, { courseSlug: "c", moduleSlug: "m1", answers: answers(10, 10), courseModuleSlugs: modules, upcomingCount: 0 }, now).state;
    s = applyQuizResult(s, { courseSlug: "c", moduleSlug: "m1", answers: answers(2, 10), courseModuleSlugs: modules, upcomingCount: 0 }, now).state;
    const p = getModuleProgress(s, "c", "m1");
    expect(p.passed).toBe(true);
    expect(p.bestScore).toBe(1);
    expect(p.lastScore).toBe(0.2);
  });

  it("courseCompletion conta módulos planejados no total", () => {
    let s = createEmptyProgress();
    s = applyQuizResult(s, { courseSlug: "c", moduleSlug: "m1", answers: answers(10, 10), courseModuleSlugs: ["m1"], upcomingCount: 3 }, now).state;
    expect(courseCompletion(s, "c", ["m1"], 3)).toBe(0.25);
  });
});

describe("reducers de progresso", () => {
  it("slide conta XP uma única vez e liga o streak", () => {
    let r = applySlideSeen(createEmptyProgress(), "c", "m1", "s1", now);
    expect(r.state.xp).toBe(XP.slideSeen);
    expect(r.state.streak.count).toBe(1);
    expect(r.events.some((e) => e.kind === "achievement")).toBe(true);
    r = applySlideSeen(r.state, "c", "m1", "s1", now);
    expect(r.state.xp).toBe(XP.slideSeen);
  });

  it("quiz registra tentativa, guarda ids sorteados e cria flashcards dos erros", () => {
    const r = applyQuizResult(createEmptyProgress(), { courseSlug: "c", moduleSlug: "m1", answers: answers(7, 10), courseModuleSlugs: modules, upcomingCount: 0 }, now);
    const p = getModuleProgress(r.state, "c", "m1");
    expect(p.attempts).toBe(1);
    expect(p.lastAttemptQuestionIds).toHaveLength(10);
    expect(Object.keys(r.state.review)).toEqual(["q7", "q8", "q9"]);
    expect(r.detail.passed).toBe(false);
  });

  it("aprovação de primeira com 100% gera conquistas e level-up", () => {
    const r = applyQuizResult(createEmptyProgress(), { courseSlug: "c", moduleSlug: "m1", answers: answers(10, 10), courseModuleSlugs: ["m1"], upcomingCount: 0 }, now);
    const ids = r.events.flatMap((e) => (e.kind === "achievement" ? [e.achievement.id] : []));
    expect(ids).toEqual(expect.arrayContaining(["primeiro-modulo", "de-primeira", "nota-maxima", "combo-5", "curso-completo"]));
    expect(r.events.some((e) => e.kind === "level-up")).toBe(true);
  });

  it("não marca curso completo enquanto houver módulos planejados", () => {
    const r = applyQuizResult(createEmptyProgress(), { courseSlug: "c", moduleSlug: "m1", answers: answers(10, 10), courseModuleSlugs: ["m1"], upcomingCount: 2 }, now);
    expect(r.state.achievements["curso-completo"]).toBeUndefined();
  });

  it("revisão atualiza o card e conta revisões", () => {
    let s = applyQuizResult(createEmptyProgress(), { courseSlug: "c", moduleSlug: "m1", answers: answers(9, 10), courseModuleSlugs: modules, upcomingCount: 0 }, now).state;
    s = applyReviewAnswer(s, "q9", true, now).state;
    expect(s.review.q9?.box).toBe(2);
    expect(s.reviewsDone).toBe(1);
  });

  it("tempo de estudo acumula", () => {
    const s = applyStudyTime(createEmptyProgress(), 90, now).state;
    expect(s.studySeconds).toBe(90);
  });
});

describe("persistência", () => {
  it("migra estado parcial preenchendo campos ausentes", () => {
    const s = migrateProgress({ xp: 50 }, 1);
    expect(s.xp).toBe(50);
    expect(s.courses).toEqual({});
    expect(s.schemaVersion).toBe(1);
  });

  it("descarta estado de versão futura", () => {
    expect(migrateProgress({ xp: 999 }, 99).xp).toBe(0);
  });

  it("repositório em memória faz round-trip", () => {
    const repo = new MemoryProgressRepository();
    const s = { ...createEmptyProgress(), xp: 10 };
    repo.save(s);
    expect(repo.load()).toEqual(s);
    repo.clear();
    expect(repo.load()).toBeNull();
  });
});
