"use client";

import { ArrowRight, Play } from "lucide-react";
import type { CourseSummary } from "@/lib/content/summary";
import { useHydratedProgress } from "@/lib/progress/hooks";
import { getModuleProgress, type ProgressState } from "@/lib/progress/types";
import { courseCompletion, isModuleUnlocked } from "@/lib/progress/unlock";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

/** Próximo passo do aluno no curso: módulo liberado e ainda não aprovado. */
export function nextStep(state: ProgressState, course: CourseSummary): { href: string; label: string } | null {
  const slugs = course.modules.map((m) => m.slug);
  for (let i = 0; i < course.modules.length; i++) {
    const mod = course.modules[i]!;
    if (!isModuleUnlocked(state, course.slug, slugs, i)) return null;
    const p = getModuleProgress(state, course.slug, mod.slug);
    if (p.passed) continue;
    const allSlides = mod.slideIds.every((id) => p.slidesSeen.includes(id));
    if (allSlides) return { href: `/courses/${course.slug}/${mod.slug}/quiz`, label: `Fazer o desafio: ${mod.title}` };
    const started = p.slidesSeen.length > 0;
    return { href: `/courses/${course.slug}/${mod.slug}`, label: `${started ? "Continuar" : "Começar"}: ${mod.title}` };
  }
  return null;
}

export function CourseProgress({ course }: { course: CourseSummary }) {
  const { hydrated, progress } = useHydratedProgress();
  const slugs = course.modules.map((m) => m.slug);
  const completion = courseCompletion(progress, course.slug, slugs, course.upcoming.length);
  const total = course.modules.length + course.upcoming.length;
  const passed = slugs.filter((m) => getModuleProgress(progress, course.slug, m).passed).length;

  return (
    <div className="space-y-2" aria-busy={!hydrated}>
      <div className="flex justify-between text-sm text-muted">
        <span>
          {hydrated ? passed : "–"} de {total} módulos
        </span>
        <span className="tabular-nums">{hydrated ? Math.round(completion * 100) : 0}%</span>
      </div>
      <ProgressBar value={hydrated ? completion : 0} label={`Progresso em ${course.title}`} />
    </div>
  );
}

export function ContinueButton({ course, size = "md" }: { course: CourseSummary; size?: "md" | "lg" }) {
  const { hydrated, progress } = useHydratedProgress();
  const step = hydrated ? nextStep(progress, course) : null;
  if (!hydrated) return <div className="h-11 w-48 animate-pulse rounded-2xl bg-sunken" aria-hidden="true" />;
  if (!step) {
    return (
      <ButtonLink href={`/courses/${course.slug}`} variant="secondary" size={size}>
        Ver trilha <ArrowRight className="size-4" aria-hidden="true" />
      </ButtonLink>
    );
  }
  return (
    <ButtonLink href={step.href} size={size} className="max-w-full">
      <Play className="size-4 shrink-0 fill-current" aria-hidden="true" />
      <span className="truncate">{step.label}</span>
    </ButtonLink>
  );
}
