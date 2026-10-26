"use client";

import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";
import {
  applyQuizResult,
  applyReviewAnswer,
  applySlideSeen,
  applyStudyTime,
  type ProgressEvent,
  type QuizResultDetail,
  type QuizResultInput,
} from "./reducers";
import { LocalStorageProgressRepository, type ProgressRepository } from "./repository";
import { createEmptyProgress, PROGRESS_SCHEMA_VERSION, type ProgressState } from "./types";

/* ------------------------------------------------------------------ */
/* Eventos de celebração (não persistidos)                             */
/* ------------------------------------------------------------------ */

export type QueuedEvent = ProgressEvent & { key: number };

type EventsStore = {
  queue: QueuedEvent[];
  push: (events: ProgressEvent[]) => void;
  shift: (key: number) => void;
};

let eventKey = 0;
export const useProgressEvents = create<EventsStore>((set) => ({
  queue: [],
  push: (events) =>
    set((s) => ({ queue: [...s.queue, ...events.filter((e) => e.kind !== "xp").map((e) => ({ ...e, key: ++eventKey }))] })),
  shift: (key) => set((s) => ({ queue: s.queue.filter((e) => e.key !== key) })),
}));

/* ------------------------------------------------------------------ */
/* Store de progresso                                                  */
/* ------------------------------------------------------------------ */

type PersistedSlice = { progress: ProgressState };

/** Adapta um ProgressRepository à interface de storage do `persist` do Zustand. */
export function repositoryStorage(repo: ProgressRepository): PersistStorage<PersistedSlice> {
  return {
    getItem: () => {
      const state = repo.load();
      return state ? { state: { progress: state }, version: PROGRESS_SCHEMA_VERSION } : null;
    },
    setItem: (_name, value) => repo.save(value.state.progress),
    removeItem: () => repo.clear(),
  };
}

export type ProgressStore = PersistedSlice & {
  hydrated: boolean;
  markSlideSeen: (courseSlug: string, moduleSlug: string, slideId: string) => void;
  recordQuiz: (input: QuizResultInput) => QuizResultDetail;
  answerReview: (questionId: string, remembered: boolean) => void;
  addStudyTime: (seconds: number) => void;
  reset: () => void;
};

const repository: ProgressRepository = new LocalStorageProgressRepository();

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => {
      const run = <T,>(fn: (s: ProgressState) => { state: ProgressState; events: ProgressEvent[]; detail: T }): T => {
        const result = fn(get().progress);
        set({ progress: result.state });
        if (result.events.length > 0) useProgressEvents.getState().push(result.events);
        return result.detail;
      };
      return {
        progress: createEmptyProgress(),
        hydrated: false,
        markSlideSeen: (c, m, s) => run((p) => applySlideSeen(p, c, m, s, new Date())),
        recordQuiz: (input) => run((p) => applyQuizResult(p, input, new Date())),
        answerReview: (id, ok) => run((p) => applyReviewAnswer(p, id, ok, new Date())),
        addStudyTime: (sec) => run((p) => applyStudyTime(p, sec, new Date())),
        reset: () => set({ progress: createEmptyProgress() }),
      };
    },
    {
      name: "studyhub:progress",
      version: PROGRESS_SCHEMA_VERSION,
      storage: repositoryStorage(repository),
      partialize: (s) => ({ progress: s.progress }),
      // Hidrata só no cliente, depois da primeira renderização (evita mismatch com o HTML estático).
      skipHydration: true,
      onRehydrateStorage: () => () => useProgress.setState({ hydrated: true }),
    },
  ),
);
