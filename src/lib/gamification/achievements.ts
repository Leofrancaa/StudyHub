import type { ProgressState } from "@/lib/progress/types";
import { levelFromXp } from "./levels";

export type AchievementContext = {
  /** Disponível quando o evento é um quiz finalizado. */
  quiz?: { score: number; passed: boolean; previousAttempts: number; maxCombo: number };
  /** Slugs dos cursos cujos módulos (incluindo planejados) estão todos aprovados. */
  completedCourses?: readonly string[];
};

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  /** Nome de ícone do Lucide, resolvido na UI. */
  icon: "Footprints" | "Flag" | "Target" | "Zap" | "Flame" | "Trophy" | "Repeat" | "Star" | "Timer" | "Crown";
  check: (state: ProgressState, ctx: AchievementContext) => boolean;
};

const anyPassed = (s: ProgressState) =>
  Object.values(s.courses).some((mods) => Object.values(mods).some((m) => m.passed));
const anySlide = (s: ProgressState) =>
  Object.values(s.courses).some((mods) => Object.values(mods).some((m) => m.slidesSeen.length > 0));

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { id: "primeiros-passos", title: "Primeiros passos", description: "Conclua o primeiro slide.", icon: "Footprints", check: anySlide },
  { id: "primeiro-modulo", title: "Módulo vencido", description: "Seja aprovado no primeiro módulo.", icon: "Flag", check: anyPassed },
  {
    id: "de-primeira",
    title: "De primeira",
    description: "Passe num quiz na primeira tentativa.",
    icon: "Target",
    check: (_s, c) => Boolean(c.quiz?.passed && c.quiz.previousAttempts === 0),
  },
  {
    id: "nota-maxima",
    title: "Gabaritou",
    description: "Tire 100% em um quiz.",
    icon: "Star",
    check: (_s, c) => c.quiz?.score === 1,
  },
  {
    id: "combo-5",
    title: "Combo x5",
    description: "Acerte 5 questões seguidas.",
    icon: "Zap",
    check: (_s, c) => (c.quiz?.maxCombo ?? 0) >= 5,
  },
  { id: "streak-3", title: "Aquecendo", description: "Estude 3 dias seguidos.", icon: "Flame", check: (s) => s.streak.best >= 3 },
  { id: "streak-7", title: "Semana em chamas", description: "Estude 7 dias seguidos.", icon: "Flame", check: (s) => s.streak.best >= 7 },
  { id: "revisor", title: "Revisor", description: "Faça 10 revisões de flashcards.", icon: "Repeat", check: (s) => s.reviewsDone >= 10 },
  { id: "maratonista", title: "Maratonista", description: "Acumule 1 hora de estudo.", icon: "Timer", check: (s) => s.studySeconds >= 3600 },
  { id: "nivel-5", title: "Nível 5", description: "Alcance o nível 5.", icon: "Crown", check: (s) => levelFromXp(s.xp).level >= 5 },
  {
    id: "curso-completo",
    title: "Curso completo",
    description: "Seja aprovado em todos os módulos de um curso.",
    icon: "Trophy",
    check: (_s, c) => (c.completedCourses?.length ?? 0) > 0,
  },
];

/** Devolve as conquistas recém-desbloqueadas (ainda não presentes no estado). */
export function newlyUnlocked(state: ProgressState, ctx: AchievementContext = {}): AchievementDef[] {
  return ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && a.check(state, ctx));
}
