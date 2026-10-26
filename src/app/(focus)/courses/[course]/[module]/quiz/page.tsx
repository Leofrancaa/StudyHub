import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourses, getModule } from "@/lib/content/registry";
import { courseThemeStyle } from "@/lib/content/theme";
import { QuizRunner } from "@/components/quiz/quiz-runner";

export function generateStaticParams() {
  return getCourses().flatMap((c) => c.modules.map((m) => ({ course: c.slug, module: m.slug })));
}

export async function generateMetadata({ params }: PageProps<"/courses/[course]/[module]/quiz">): Promise<Metadata> {
  const { course, module } = await params;
  const found = getModule(course, module);
  return found ? { title: `Desafio: ${found.module.title}`, description: `Quiz do módulo ${found.module.title}.` } : { title: "Quiz não encontrado" };
}

export default async function QuizPage({ params }: PageProps<"/courses/[course]/[module]/quiz">) {
  const { course: courseSlug, module: moduleSlug } = await params;
  const found = getModule(courseSlug, moduleSlug);
  if (!found) notFound();
  const { course, module, index } = found;
  const next = course.modules[index + 1];

  const slideByTag: Record<string, { id: string; index: number }> = {};
  module.slides.forEach((s, i) => {
    for (const tag of s.tags) slideByTag[tag] ??= { id: s.id, index: i };
  });

  return (
    <div style={courseThemeStyle(course)} className="app-backdrop min-h-dvh">
      <QuizRunner
        courseSlug={course.slug}
        moduleSlug={module.slug}
        moduleTitle={module.title}
        moduleIndex={index}
        moduleSlugs={course.modules.map((m) => m.slug)}
        upcomingCount={course.upcoming.length}
        nextModule={next ? { slug: next.slug, title: next.title } : null}
        questionsPerAttempt={module.questionsPerAttempt}
        difficultyMix={module.difficultyMix}
        bank={module.quiz}
        slideByTag={slideByTag}
      />
    </div>
  );
}
