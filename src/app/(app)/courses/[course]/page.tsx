import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Layers } from "lucide-react";
import { getCourse, getCourses } from "@/lib/content/registry";
import { summarizeCourse } from "@/lib/content/summary";
import { courseThemeStyle } from "@/lib/content/theme";
import { ContentIcon } from "@/components/ui/content-icon";
import { ContinueButton, CourseProgress } from "@/components/course/course-progress";
import { CourseTrail } from "@/components/course/course-trail";

export function generateStaticParams() {
  return getCourses().map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[course]">): Promise<Metadata> {
  const course = getCourse((await params).course);
  return course ? { title: course.title, description: course.tagline } : { title: "Curso não encontrado" };
}

export default async function CoursePage({ params }: PageProps<"/courses/[course]">) {
  const course = getCourse((await params).course);
  if (!course) notFound();
  const summary = summarizeCourse(course);

  return (
    <div style={courseThemeStyle(course)} className="space-y-12">
      <section className="glass relative overflow-hidden rounded-4xl p-6 sm:p-10">
        <div className="gradient-accent absolute -right-20 -top-20 size-72 rounded-full opacity-25 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="gradient-accent inline-grid size-14 place-items-center rounded-2xl text-on-accent shadow-soft">
              <ContentIcon name={course.icon} className="size-7" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-5xl">{course.title}</h1>
            <p className="mt-3 text-muted">{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Layers className="size-4" aria-hidden="true" /> {course.modules.length + course.upcoming.length} módulos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" /> ~{course.estimatedHours} h
              </span>
            </div>
          </div>
          <div className="w-full space-y-4 lg:max-w-xs">
            <CourseProgress course={summary} />
            <ContinueButton course={summary} />
          </div>
        </div>
      </section>

      <section aria-labelledby="trilha">
        <h2 id="trilha" className="mb-8 text-center font-display text-2xl font-bold">
          Sua trilha
        </h2>
        <CourseTrail course={summary} />
      </section>
    </div>
  );
}
