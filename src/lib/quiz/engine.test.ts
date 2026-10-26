import { describe, expect, it } from "vitest";
import type { Question } from "@/lib/content/schema";
import {
  allocateByDifficulty,
  gradeQuestion,
  isPassing,
  normalizeAnswer,
  pickQuestions,
  prepareQuestion,
  requiredCorrect,
  shuffleAvoidingIdentity,
} from "./engine";
import { seededRng, shuffle } from "./random";

const mix = { easy: 0.3, medium: 0.5, hard: 0.2 };

function makeBank(easy: number, medium: number, hard: number) {
  const bank: { id: string; difficulty: "easy" | "medium" | "hard" }[] = [];
  for (let i = 0; i < easy; i++) bank.push({ id: `e${i}`, difficulty: "easy" });
  for (let i = 0; i < medium; i++) bank.push({ id: `m${i}`, difficulty: "medium" });
  for (let i = 0; i < hard; i++) bank.push({ id: `h${i}`, difficulty: "hard" });
  return bank;
}

describe("shuffle (Fisher–Yates)", () => {
  it("devolve uma permutação sem perder nem duplicar itens", () => {
    const input = Array.from({ length: 50 }, (_, i) => i);
    for (let seed = 1; seed <= 20; seed++) {
      const out = shuffle(input, seededRng(seed));
      expect(out).toHaveLength(input.length);
      expect(new Set(out).size).toBe(input.length);
      expect([...out].sort((a, b) => a - b)).toEqual(input);
    }
  });

  it("não altera o array original", () => {
    const input = [1, 2, 3, 4];
    shuffle(input, seededRng(7));
    expect(input).toEqual([1, 2, 3, 4]);
  });

  it("é aproximadamente uniforme", () => {
    const counts = new Map<string, number>();
    const rng = seededRng(42);
    const trials = 60_000;
    for (let i = 0; i < trials; i++) {
      const key = shuffle(["a", "b", "c"], rng).join("");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    expect(counts.size).toBe(6);
    for (const n of counts.values()) expect(Math.abs(n / trials - 1 / 6)).toBeLessThan(0.01);
  });

  it("shuffleAvoidingIdentity nunca devolve a ordem original", () => {
    for (let seed = 1; seed <= 200; seed++) {
      expect(shuffleAvoidingIdentity(["a", "b", "c"], seededRng(seed))).not.toEqual(["a", "b", "c"]);
    }
  });
});

describe("aprovação", () => {
  it("exige ceil(0,9·n) acertos", () => {
    expect(requiredCorrect(10)).toBe(9);
    expect(requiredCorrect(8)).toBe(8);
    expect(requiredCorrect(12)).toBe(11);
    expect(requiredCorrect(15)).toBe(14);
    expect(requiredCorrect(20)).toBe(18);
  });

  it("isPassing respeita o limite exato", () => {
    expect(isPassing(9, 10)).toBe(true);
    expect(isPassing(8, 10)).toBe(false);
    expect(isPassing(14, 15)).toBe(true);
    expect(isPassing(13, 15)).toBe(false);
  });

  it("rejeita total inválido", () => {
    expect(() => requiredCorrect(0)).toThrow();
  });
});

describe("allocateByDifficulty", () => {
  it("soma o total pedido", () => {
    for (let n = 8; n <= 15; n++) {
      const c = allocateByDifficulty(n, mix);
      expect(c.easy + c.medium + c.hard).toBe(n);
    }
  });

  it("segue 30/50/20 para 10 questões", () => {
    expect(allocateByDifficulty(10, mix)).toEqual({ easy: 3, medium: 5, hard: 2 });
  });
});

describe("pickQuestions", () => {
  const bank = makeBank(15, 25, 10);

  it("sorteia sem duplicatas e com a distribuição de dificuldade", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const picked = pickQuestions(bank, 10, mix, [], seededRng(seed));
      expect(picked).toHaveLength(10);
      expect(new Set(picked.map((q) => q.id)).size).toBe(10);
      expect(picked.filter((q) => q.difficulty === "easy")).toHaveLength(3);
      expect(picked.filter((q) => q.difficulty === "medium")).toHaveLength(5);
      expect(picked.filter((q) => q.difficulty === "hard")).toHaveLength(2);
    }
  });

  it("evita repetir a tentativa anterior quando o banco permite", () => {
    const first = pickQuestions(bank, 10, mix, [], seededRng(1));
    const prev = first.map((q) => q.id);
    for (let seed = 2; seed <= 30; seed++) {
      const next = pickQuestions(bank, 10, mix, prev, seededRng(seed));
      expect(next.some((q) => prev.includes(q.id))).toBe(false);
    }
  });

  it("reaproveita a tentativa anterior só quando falta questão inédita", () => {
    const tiny = makeBank(3, 5, 2);
    const prev = tiny.map((q) => q.id);
    const picked = pickQuestions(tiny, 10, mix, prev, seededRng(3));
    expect(new Set(picked.map((q) => q.id)).size).toBe(10);
  });

  it("completa com outras faixas quando uma faixa não tem questões suficientes", () => {
    const lopsided = makeBank(20, 20, 1);
    const picked = pickQuestions(lopsided, 10, mix, [], seededRng(9));
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((q) => q.id)).size).toBe(10);
  });

  it("falha se o banco é menor que o pedido", () => {
    expect(() => pickQuestions(makeBank(1, 1, 1), 10, mix)).toThrow();
  });
});

describe("prepareQuestion e gradeQuestion", () => {
  const mc: Question = {
    id: "q-mc",
    type: "multiple-choice",
    prompt: "?",
    explanation: "x",
    difficulty: "easy",
    tags: ["t"],
    options: [
      { id: "a", text: "A" },
      { id: "b", text: "B" },
      { id: "c", text: "C" },
    ],
    answer: "b",
  };

  it("embaralha alternativas mantendo os mesmos ids", () => {
    const p = prepareQuestion(mc, seededRng(5));
    expect([...p.order].sort()).toEqual(["a", "b", "c"]);
  });

  it("corrige múltipla escolha", () => {
    expect(gradeQuestion(mc, { type: "multiple-choice", optionId: "b" })).toBe(true);
    expect(gradeQuestion(mc, { type: "multiple-choice", optionId: "a" })).toBe(false);
  });

  it("corrige múltipla seleção exigindo o conjunto exato", () => {
    const q: Question = {
      id: "q-ms",
      type: "multi-select",
      prompt: "?",
      explanation: "x",
      difficulty: "medium",
      tags: ["t"],
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
      ],
      answers: ["a", "c"],
    };
    expect(gradeQuestion(q, { type: "multi-select", optionIds: ["c", "a"] })).toBe(true);
    expect(gradeQuestion(q, { type: "multi-select", optionIds: ["a"] })).toBe(false);
    expect(gradeQuestion(q, { type: "multi-select", optionIds: ["a", "b", "c"] })).toBe(false);
  });

  it("corrige ordenação, lacuna, associação e V/F", () => {
    const ord: Question = {
      id: "q-ord",
      type: "ordering",
      prompt: "?",
      explanation: "x",
      difficulty: "hard",
      tags: ["t"],
      items: [
        { id: "x", text: "1" },
        { id: "y", text: "2" },
        { id: "z", text: "3" },
      ],
    };
    expect(gradeQuestion(ord, { type: "ordering", itemIds: ["x", "y", "z"] })).toBe(true);
    expect(gradeQuestion(ord, { type: "ordering", itemIds: ["y", "x", "z"] })).toBe(false);

    const fb: Question = {
      id: "q-fb",
      type: "fill-blank",
      prompt: "IA ⊃ ___ ⊃ DL",
      explanation: "x",
      difficulty: "easy",
      tags: ["t"],
      accepted: ["Machine Learning", "ML", "aprendizado de máquina"],
    };
    expect(gradeQuestion(fb, { type: "fill-blank", text: "  machine   learning. " })).toBe(true);
    expect(gradeQuestion(fb, { type: "fill-blank", text: "Aprendizado de Maquina" })).toBe(true);
    expect(gradeQuestion(fb, { type: "fill-blank", text: "" })).toBe(false);

    const match: Question = {
      id: "q-match",
      type: "matching",
      prompt: "?",
      explanation: "x",
      difficulty: "medium",
      tags: ["t"],
      pairs: [
        { id: "p1", left: "L1", right: "R1" },
        { id: "p2", left: "L2", right: "R2" },
        { id: "p3", left: "L3", right: "R3" },
      ],
    };
    expect(gradeQuestion(match, { type: "matching", matches: { p1: "p1", p2: "p2", p3: "p3" } })).toBe(true);
    expect(gradeQuestion(match, { type: "matching", matches: { p1: "p2", p2: "p1", p3: "p3" } })).toBe(false);

    const tf: Question = {
      id: "q-tf",
      type: "true-false",
      prompt: "?",
      explanation: "x",
      difficulty: "easy",
      tags: ["t"],
      answer: false,
    };
    expect(gradeQuestion(tf, { type: "true-false", value: false })).toBe(true);
    expect(gradeQuestion(tf, { type: "true-false", value: true })).toBe(false);
  });

  it("normalizeAnswer remove acento, caixa e pontuação nas pontas", () => {
    expect(normalizeAnswer("  Parâmetros!! ")).toBe("parametros");
  });
});
