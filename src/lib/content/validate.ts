import { allocateByDifficulty, DIFFICULTIES } from "@/lib/quiz/engine";
import { courseSchema, type Course } from "./schema";

export const MIN_BANK_MULTIPLIER = 5;

/** Regras que dependem de mais de um campo (o schema Zod cobre a forma de cada item). */
export function crossValidateCourses(courses: readonly Course[]): string[] {
  const errors: string[] = [];
  const courseSlugs = new Set<string>();
  const questionIds = new Map<string, string>();

  for (const course of courses) {
    const where = `curso "${course.slug}"`;
    if (courseSlugs.has(course.slug)) errors.push(`${where}: slug de curso duplicado`);
    courseSlugs.add(course.slug);

    const moduleSlugs = new Set<string>();
    for (const mod of course.modules) {
      const at = `${where} › módulo "${mod.slug}"`;
      if (moduleSlugs.has(mod.slug)) errors.push(`${at}: slug de módulo duplicado`);
      moduleSlugs.add(mod.slug);

      const slideIds = mod.slides.map((s) => s.id);
      if (new Set(slideIds).size !== slideIds.length) errors.push(`${at}: ids de slide duplicados`);

      const blocks = mod.slides.flatMap((s) => s.blocks);
      if (!blocks.some((b) => b.type === "analogy")) errors.push(`${at}: precisa de pelo menos 1 bloco analogy`);
      if (!blocks.some((b) => b.type === "mini-check")) errors.push(`${at}: precisa de pelo menos 1 bloco mini-check`);
      const last = mod.slides[mod.slides.length - 1];
      if (!last?.blocks.some((b) => b.type === "summary")) errors.push(`${at}: o último slide precisa de um bloco summary`);

      const minBank = MIN_BANK_MULTIPLIER * mod.questionsPerAttempt;
      if (mod.quiz.length < minBank) {
        errors.push(`${at}: banco com ${mod.quiz.length} questões; mínimo ${minBank} (${MIN_BANK_MULTIPLIER} × ${mod.questionsPerAttempt})`);
      }

      const targets = allocateByDifficulty(mod.questionsPerAttempt, mod.difficultyMix);
      for (const d of DIFFICULTIES) {
        const available = mod.quiz.filter((q) => q.difficulty === d).length;
        // Precisa de pelo menos 2 tentativas inteiras por faixa para conseguir variar entre tentativas.
        if (available < targets[d] * 2) {
          errors.push(`${at}: só ${available} questões "${d}"; mínimo ${targets[d] * 2} para variar entre tentativas`);
        }
      }

      const slideTags = new Set(mod.slides.flatMap((s) => s.tags));
      for (const q of mod.quiz) {
        const other = questionIds.get(q.id);
        if (other) errors.push(`${at}: id de questão "${q.id}" já usado em ${other}`);
        questionIds.set(q.id, at);
        const orphan = q.tags.filter((t) => !slideTags.has(t));
        if (orphan.length > 0) {
          errors.push(`${at}: questão "${q.id}" usa tags sem slide correspondente: ${orphan.join(", ")}`);
        }
      }
    }
  }
  return errors;
}

export class ContentValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Conteúdo inválido:\n- ${issues.join("\n- ")}`);
    this.name = "ContentValidationError";
  }
}

/** Faz o parse com Zod e aplica as regras cruzadas. Lança erro com todas as falhas. */
export function parseCourses(sources: readonly unknown[]): Course[] {
  const issues: string[] = [];
  const parsed: Course[] = [];
  sources.forEach((src, i) => {
    const result = courseSchema.safeParse(src);
    if (result.success) {
      parsed.push(result.data);
    } else {
      for (const issue of result.error.issues) {
        issues.push(`curso[${i}] ${issue.path.join(".")}: ${issue.message}`);
      }
    }
  });
  issues.push(...crossValidateCourses(parsed));
  if (issues.length > 0) throw new ContentValidationError(issues);
  return parsed;
}
