import type { Course } from "./schema";

/** Versão enxuta do curso, segura para mandar a componentes de cliente (sem slides nem questões). */
export type CourseSummary = {
  slug: string;
  title: string;
  tagline: string;
  icon: Course["icon"];
  theme: Course["theme"];
  level: Course["level"];
  estimatedHours: number;
  modules: { slug: string; title: string; description: string; estimatedMinutes: number; slideIds: string[]; questionsPerAttempt: number }[];
  upcoming: Course["upcoming"];
};

export function summarizeCourse(course: Course): CourseSummary {
  return {
    slug: course.slug,
    title: course.title,
    tagline: course.tagline,
    icon: course.icon,
    theme: course.theme,
    level: course.level,
    estimatedHours: course.estimatedHours,
    modules: course.modules.map((m) => ({
      slug: m.slug,
      title: m.title,
      description: m.description,
      estimatedMinutes: m.estimatedMinutes,
      slideIds: m.slides.map((s) => s.id),
      questionsPerAttempt: m.questionsPerAttempt,
    })),
    upcoming: course.upcoming,
  };
}
