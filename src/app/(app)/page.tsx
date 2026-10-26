import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Flame, Repeat, Trophy } from "lucide-react";
import { getCourses } from "@/lib/content/registry";
import { summarizeCourse } from "@/lib/content/summary";
import { courseThemeStyle } from "@/lib/content/theme";
import { ContentIcon } from "@/components/ui/content-icon";
import { ContinueButton, CourseProgress } from "@/components/course/course-progress";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Catálogo de cursos do StudyHub: slides interativos, quizzes e gamificação.",
};

const FEATURES = [
  { Icon: BookOpen, title: "Slides curtos", text: "Uma ideia por slide, com analogias e exemplos reais." },
  { Icon: Brain, title: "Quiz que ensina", text: "Questões sorteadas, feedback na hora e 90% para avançar." },
  { Icon: Flame, title: "Streak e XP", text: "Estude um pouco todo dia e veja seu nível subir." },
  { Icon: Repeat, title: "Revisão espaçada", text: "O que você errou volta em flashcards no momento certo." },
];

export default function HomePage() {
  const courses = getCourses().map(summarizeCourse);
  const featured = courses[0];

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-text">
            <Trophy className="size-4" aria-hidden="true" /> Aprender pode ser viciante
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Domine qualquer assunto, <span className="text-gradient">um módulo por vez.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Slides interativos, quizzes que explicam cada resposta e uma trilha que só avança quando você realmente aprendeu.
          </p>
          {featured && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ContinueButton course={featured} size="lg" />
              <Link href="/dashboard" className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-sm font-semibold text-muted hover:text-fg">
                Ver meu progresso <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <li key={title} className="glass rounded-3xl p-5">
              <span className="gradient-accent grid size-10 place-items-center rounded-2xl text-on-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="catalogo">
        <div className="flex items-end justify-between gap-4">
          <h2 id="catalogo" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Catálogo
          </h2>
          <p className="text-sm text-muted">
            {courses.length} {courses.length === 1 ? "curso" : "cursos"}
          </p>
        </div>
        <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <li key={course.slug} style={courseThemeStyle(course)}>
              <article className="glass group relative flex h-full flex-col overflow-hidden rounded-4xl transition-shadow hover:shadow-lift">
                <div className="gradient-accent relative h-32">
                  <div className="absolute -right-6 -top-6 size-40 rounded-full bg-white/15 blur-sm" aria-hidden="true" />
                  <div className="absolute bottom-0 left-6 translate-y-1/2">
                    <span className="grid size-16 place-items-center rounded-3xl border-4 border-[var(--bg-elev)] bg-elev text-accent-text shadow-soft">
                      <ContentIcon name={course.icon} className="size-8" />
                    </span>
                  </div>
                  <span className="absolute right-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {course.level}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6 pt-12">
                  <div>
                    <h3 className="font-display text-xl font-bold leading-tight">
                      <Link href={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:rounded-4xl">
                        {course.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-muted">{course.tagline}</p>
                  </div>
                  <p className="text-xs font-medium text-muted">
                    {course.modules.length + course.upcoming.length} módulos · ~{course.estimatedHours} h
                  </p>
                  <div className="mt-auto">
                    <CourseProgress course={course} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
