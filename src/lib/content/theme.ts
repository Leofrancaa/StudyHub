import type { CSSProperties } from "react";
import type { Course } from "./schema";

/** Variáveis CSS que tingem a interface com a cor-tema do curso. */
export function courseThemeStyle(course: Pick<Course, "theme">): CSSProperties {
  return { "--accent": course.theme.from, "--accent-2": course.theme.to } as CSSProperties;
}
