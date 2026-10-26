import { createEmptyProgress, PROGRESS_SCHEMA_VERSION, type ProgressState } from "./types";

/**
 * Camada de persistência do progresso.
 * Hoje: localStorage. Para usar backend, implemente esta interface e troque em `store.ts`.
 */
export interface ProgressRepository {
  load(): ProgressState | null;
  save(state: ProgressState): void;
  clear(): void;
}

export const STORAGE_KEY = "studyhub:progress";

type Envelope = { version: number; state: unknown };

/** Migra estados antigos até a versão atual. Adicione um passo por versão nova. */
export function migrateProgress(raw: unknown, fromVersion: number): ProgressState {
  if (fromVersion > PROGRESS_SCHEMA_VERSION) {
    // Dado gravado por uma versão mais nova do app: não arriscar interpretar errado.
    return createEmptyProgress();
  }
  // v1 é a primeira versão; mescla com o estado vazio para tolerar campos ausentes.
  const base = createEmptyProgress();
  if (typeof raw !== "object" || raw === null) return base;
  const r = raw as Partial<ProgressState>;
  return {
    ...base,
    xp: typeof r.xp === "number" && r.xp >= 0 ? r.xp : 0,
    streak: r.streak && typeof r.streak.count === "number" ? r.streak : base.streak,
    studySeconds: typeof r.studySeconds === "number" ? r.studySeconds : 0,
    reviewsDone: typeof r.reviewsDone === "number" ? r.reviewsDone : 0,
    courses: r.courses && typeof r.courses === "object" ? r.courses : {},
    achievements: r.achievements && typeof r.achievements === "object" ? r.achievements : {},
    review: r.review && typeof r.review === "object" ? r.review : {},
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  };
}

/** Lê e grava com try/catch: localStorage pode estar bloqueado (modo privado, cota cheia). */
export class LocalStorageProgressRepository implements ProgressRepository {
  constructor(private readonly key: string = STORAGE_KEY) {}

  private get storage(): Storage | null {
    try {
      return typeof window === "undefined" ? null : window.localStorage;
    } catch {
      return null;
    }
  }

  load(): ProgressState | null {
    try {
      const text = this.storage?.getItem(this.key);
      if (!text) return null;
      const env = JSON.parse(text) as Envelope;
      return migrateProgress(env.state, typeof env.version === "number" ? env.version : 0);
    } catch {
      return null;
    }
  }

  save(state: ProgressState): void {
    try {
      const env: Envelope = { version: PROGRESS_SCHEMA_VERSION, state };
      this.storage?.setItem(this.key, JSON.stringify(env));
    } catch {
      // Sem persistência disponível: o app segue funcionando só em memória.
    }
  }

  clear(): void {
    try {
      this.storage?.removeItem(this.key);
    } catch {
      /* ignora */
    }
  }
}

/** Repositório em memória: útil em testes e quando não há window. */
export class MemoryProgressRepository implements ProgressRepository {
  private value: ProgressState | null = null;
  load() {
    return this.value;
  }
  save(state: ProgressState) {
    this.value = state;
  }
  clear() {
    this.value = null;
  }
}
