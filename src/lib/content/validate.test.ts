import { describe, expect, it } from "vitest";
import { courseSources } from "@content/courses";
import { courseSchema } from "./schema";
import { crossValidateCourses, parseCourses } from "./validate";

/**
 * Este arquivo roda no `prebuild`: conteúdo inválido derruba o build.
 */
describe("conteúdo dos cursos", () => {
  it("todos os cursos passam no schema e nas regras cruzadas", () => {
    expect(() => parseCourses(courseSources)).not.toThrow();
  });

  for (const src of courseSources) {
    const parsed = courseSchema.safeParse(src);
    const label = parsed.success ? parsed.data.slug : "curso inválido";

    it(`${label}: schema Zod`, () => {
      expect(parsed.error?.issues ?? []).toEqual([]);
    });

    if (!parsed.success) continue;

    it(`${label}: regras cruzadas (banco ≥ 5×, tags, analogia, mini-check, resumo)`, () => {
      expect(crossValidateCourses([parsed.data])).toEqual([]);
    });

    for (const mod of parsed.data.modules) {
      it(`${label}/${mod.slug}: todas as questões têm explicação e distratores distintos`, () => {
        for (const q of mod.quiz) {
          expect(q.explanation.length).toBeGreaterThan(20);
          if ("options" in q) {
            const texts = q.options.map((o) => o.text.trim().toLowerCase());
            expect(new Set(texts).size).toBe(texts.length);
          }
        }
      });
    }
  }
});

describe("validador detecta conteúdo quebrado", () => {
  it("acusa banco pequeno e tag órfã", () => {
    const [first] = courseSources;
    const broken = structuredClone(first) as { modules: { quiz: { tags: string[] }[] }[] };
    const mod = broken.modules[0]!;
    mod.quiz = mod.quiz.slice(0, 5);
    mod.quiz[0]!.tags = ["tag-que-nao-existe"];
    expect(() => parseCourses([broken])).toThrow(/mínimo|tags sem slide/);
  });
});
