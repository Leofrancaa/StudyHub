import { allocateByDifficulty, DIFFICULTIES } from "@/lib/quiz/engine";
import { courseSchema, type Course } from "./schema";

export const MIN_BANK_MULTIPLIER = 5;
/** Fração máxima de questões de resposta única em que a correta é a alternativa mais longa (acaso com 4 opções = 25%). */
export const MAX_LONGEST_CORRECT_SHARE = 0.35;
/** A correta não pode passar deste múltiplo da maior alternativa errada. */
export const MAX_CORRECT_LENGTH_RATIO = 1.4;

type SingleAnswer = { id: string; options: { id: string; text: string }[]; answer: string };

/** Detecta o padrão "a resposta certa é sempre a mais longa" nas questões de resposta única. */
export function answerLengthIssues(questions: readonly SingleAnswer[]): { tooLong: string[]; longestShare: number } {
  const tooLong: string[] = [];
  let longest = 0;
  for (const q of questions) {
    const correct = q.options.find((o) => o.id === q.answer)?.text.length ?? 0;
    const maxWrong = Math.max(...q.options.filter((o) => o.id !== q.answer).map((o) => o.text.length));
    if (correct > maxWrong) longest++;
    if (correct > MAX_CORRECT_LENGTH_RATIO * maxWrong) tooLong.push(q.id);
  }
  return { tooLong, longestShare: questions.length === 0 ? 0 : longest / questions.length };
}

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

      const single = mod.quiz.filter((q) => q.type === "multiple-choice");
      const { tooLong, longestShare } = answerLengthIssues(single);
      if (tooLong.length > 0) {
        errors.push(`${at}: resposta certa bem mais longa que as erradas (> ${MAX_CORRECT_LENGTH_RATIO}×): ${tooLong.join(", ")}`);
      }
      if (longestShare > MAX_LONGEST_CORRECT_SHARE) {
        errors.push(
          `${at}: a resposta certa é a mais longa em ${Math.round(longestShare * 100)}% das questões de resposta única; máximo ${MAX_LONGEST_CORRECT_SHARE * 100}%`,
        );
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
