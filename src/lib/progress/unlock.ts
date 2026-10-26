import { getModuleProgress, type ProgressState } from "./types";

export type ModuleStatus = "locked" | "available" | "in-progress" | "completed";

/** O primeiro módulo está sempre liberado; os demais exigem aprovação no anterior. */
export function isModuleUnlocked(
  state: ProgressState,
  courseSlug: string,
  orderedModuleSlugs: readonly string[],
  index: number,
): boolean {
  if (index <= 0) return true;
  const previous = orderedModuleSlugs[index - 1];
  return previous !== undefined && getModuleProgress(state, courseSlug, previous).passed;
}

export function moduleStatus(
  state: ProgressState,
  courseSlug: string,
  orderedModuleSlugs: readonly string[],
  index: number,
): ModuleStatus {
  const slug = orderedModuleSlugs[index];
  if (slug === undefined || !isModuleUnlocked(state, courseSlug, orderedModuleSlugs, index)) return "locked";
  const p = getModuleProgress(state, courseSlug, slug);
  if (p.passed) return "completed";
  return p.slidesSeen.length > 0 || p.attempts > 0 ? "in-progress" : "available";
}

/** Fração de módulos aprovados (0–1), considerando também os módulos planejados. */
export function courseCompletion(
  state: ProgressState,
  courseSlug: string,
  orderedModuleSlugs: readonly string[],
  upcomingCount = 0,
): number {
  const total = orderedModuleSlugs.length + upcomingCount;
  if (total === 0) return 0;
  const passed = orderedModuleSlugs.filter((m) => getModuleProgress(state, courseSlug, m).passed).length;
  return passed / total;
}
