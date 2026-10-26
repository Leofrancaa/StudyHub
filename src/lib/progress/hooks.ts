"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { toDayKey, type DayKey } from "@/lib/gamification/dates";
import { useProgress } from "./store";

const noopSubscribe = () => () => {};

/** Data de hoje no fuso do usuário; null durante o render do servidor. */
export function useToday(): DayKey | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => toDayKey(new Date()),
    () => null,
  );
}

/** Progresso só depois de hidratado do localStorage (antes disso a UI mostra skeleton). */
export function useHydratedProgress() {
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);
  return { hydrated, progress };
}

/**
 * Conta tempo de estudo enquanto a aba está visível.
 * Acumula localmente e grava a cada 15 s e ao desmontar.
 */
export function useStudyTimer(active = true) {
  const addStudyTime = useProgress((s) => s.addStudyTime);
  const pending = useRef(0);

  useEffect(() => {
    if (!active) return;
    let last = Date.now();
    const tick = () => {
      const now = Date.now();
      if (document.visibilityState === "visible") pending.current += (now - last) / 1000;
      last = now;
      if (pending.current >= 15) {
        addStudyTime(pending.current);
        pending.current = 0;
      }
    };
    const id = window.setInterval(tick, 5000);
    const onVisibility = () => {
      tick();
      last = Date.now();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      tick();
      if (pending.current > 0) addStudyTime(pending.current);
      pending.current = 0;
    };
  }, [active, addStudyTime]);
}
