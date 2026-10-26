import { courseSources } from "@content/courses";
import type { Course, Module, Question } from "./schema";
import { parseCourses } from "./validate";

/**
 * Carrega e valida todos os cursos uma única vez por processo.
 * Conteúdo inválido lança erro, o que derruba o build (os testes também validam).
 */
const courses: readonly Course[] = parseCourses(courseSources);

export function getCourses(): readonly Course[] {
  return courses;
}

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getModule(courseSlug: string, moduleSlug: string): { course: Course; module: Module; index: number } | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const index = course.modules.findIndex((m) => m.slug === moduleSlug);
  const mod = course.modules[index];
  return mod ? { course, module: mod, index } : undefined;
}

export type QuestionRef = { courseSlug: string; moduleSlug: string; question: Question };

/** Índice global de questões por id (ids são únicos entre todos os cursos). */
export function getQuestionIndex(): Record<string, QuestionRef> {
  const index: Record<string, QuestionRef> = {};
  for (const course of courses) {
    for (const mod of course.modules) {
      for (const question of mod.quiz) {
        index[question.id] = { courseSlug: course.slug, moduleSlug: mod.slug, question };
      }
    }
  }
  return index;
}
