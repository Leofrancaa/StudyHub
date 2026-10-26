"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { celebrate } from "@/lib/confetti";
import { useProgressEvents, type QueuedEvent } from "@/lib/progress/store";
import { Button } from "@/components/ui/button";
import { AchievementIcon } from "./achievement-icon";

/** Mostra conquistas (toast) e level-up (modal) gerados pela store de progresso. */
export function CelebrationLayer() {
  const queue = useProgressEvents((s) => s.queue);
  const shift = useProgressEvents((s) => s.shift);
  const levelUp = queue.find((e): e is Extract<QueuedEvent, { kind: "level-up" }> => e.kind === "level-up");
  const toasts = queue.filter((e): e is Extract<QueuedEvent, { kind: "achievement" }> => e.kind === "achievement");

  useEffect(() => {
    if (levelUp) void celebrate("big");
  }, [levelUp]);

  // Confetti uma vez por conquista nova; cada toast some sozinho em 5 s.
  const seen = useRef(new Set<number>());
  const timers = useRef(new Map<number, number>());
  useEffect(() => {
    let fresh = false;
    for (const t of toasts) {
      if (seen.current.has(t.key)) continue;
      seen.current.add(t.key);
      fresh = true;
      timers.current.set(t.key, window.setTimeout(() => shift(t.key), 5000));
    }
    if (fresh) void celebrate("small");
  }, [toasts, shift]);
  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((id) => clearTimeout(id));
  }, []);

  return (
    <>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.key}
              initial={{ opacity: 0, y: -24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              className="glass pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-3xl p-3 pr-2"
            >
              <span className="gradient-accent grid size-11 shrink-0 place-items-center rounded-2xl text-on-accent">
                <AchievementIcon name={t.achievement.icon} className="size-5.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-text">Conquista desbloqueada</p>
                <p className="font-display font-semibold">{t.achievement.title}</p>
                <p className="truncate text-sm text-muted">{t.achievement.description}</p>
              </div>
              <button
                type="button"
                onClick={() => shift(t.key)}
                className="grid size-8 place-items-center rounded-full text-muted hover:text-fg"
                aria-label="Fechar aviso"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {levelUp && (
          <motion.div
            key={levelUp.key}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-up-title"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -4, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-full max-w-sm rounded-4xl border border-line bg-elev p-8 text-center shadow-lift"
            >
              <motion.div
                className="gradient-accent mx-auto grid size-24 place-items-center rounded-full font-display text-4xl font-bold text-on-accent shadow-lift"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                {levelUp.level}
              </motion.div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent-text">Subiu de nível!</p>
              <h2 id="level-up-title" className="mt-1 font-display text-3xl font-bold">
                {levelUp.name}
              </h2>
              <p className="mt-2 text-muted">Continue assim: cada slide e cada acerto contam.</p>
              <Button className="mt-6 w-full" onClick={() => shift(levelUp.key)} autoFocus>
                Bora!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
