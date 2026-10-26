/** Nomes temáticos por nível; acima do último, o nome se repete com numeral. */
export const LEVEL_NAMES = [
  "Curioso",
  "Aprendiz",
  "Explorador",
  "Analista",
  "Engenheiro de Dados",
  "Cientista",
  "Especialista",
  "Mestre dos Modelos",
  "Lenda do Gradiente",
] as const;

/** XP total necessário para ALCANÇAR o nível `level` (nível 1 = 0 XP). Curva ~ n^1,5. */
export function xpToReachLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.5));
}

export type LevelInfo = {
  level: number;
  name: string;
  /** XP acumulado no nível atual. */
  current: number;
  /** XP necessário para subir do nível atual para o próximo. */
  needed: number;
  /** 0–1 */
  progress: number;
};

export function levelName(level: number): string {
  const idx = Math.min(level, LEVEL_NAMES.length) - 1;
  const base = LEVEL_NAMES[Math.max(0, idx)] as string;
  const extra = level - LEVEL_NAMES.length;
  return extra > 0 ? `${base} ${extra + 1}` : base;
}

export function levelFromXp(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp));
  let level = 1;
  while (xpToReachLevel(level + 1) <= safe) level += 1;
  const floor = xpToReachLevel(level);
  const ceil = xpToReachLevel(level + 1);
  const needed = ceil - floor;
  const current = safe - floor;
  return { level, name: levelName(level), current, needed, progress: needed > 0 ? current / needed : 0 };
}
