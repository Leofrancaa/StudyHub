import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourses, getModule } from "@/lib/content/registry";
import { courseThemeStyle } from "@/lib/content/theme";
import { SlidePlayer } from "@/components/slides/slide-player";

export function generateStaticParams() {
  return getCourses().flatMap((c) => c.modules.map((m) => ({ course: c.slug, module: m.slug })));
}

export async function generateMetadata({ params }: PageProps<"/courses/[course]/[module]">): Promise<Metadata> {
  const { course, module } = await params;
  const found = getModule(course, module);
  return found
    ? { title: `${found.module.title} · ${found.course.title}`, description: found.module.description }
    : { title: "Módulo não encontrado" };
}

export default async function ModulePage({ params }: PageProps<"/courses/[course]/[module]">) {
  const { course: courseSlug, module: moduleSlug } = await params;
  const found = getModule(courseSlug, moduleSlug);
  if (!found) notFound();
  const { course, module, index } = found;

  return (
    <div style={courseThemeStyle(course)} className="app-backdrop">
      <SlidePlayer
        courseSlug={course.slug}
        courseTitle={course.title}
        moduleSlug={module.slug}
        moduleTitle={module.title}
        moduleIndex={index}
        moduleSlugs={course.modules.map((m) => m.slug)}
        estimatedMinutes={module.estimatedMinutes}
        slides={module.slides}
      />
    </div>
  );
}
