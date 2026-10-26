"use client";

import { Flame, Sparkles } from "lucide-react";
import { levelFromXp } from "@/lib/gamification/levels";
import { activeStreak } from "@/lib/gamification/streak";
import { useHydratedProgress, useToday } from "@/lib/progress/hooks";
import { cn } from "@/lib/cn";

export function StreakChip({ className }: { className?: string }) {
  const { hydrated, progress } = useHydratedProgress();
  const today = useToday();
  const count = hydrated && today ? activeStreak(progress.streak, today) : 0;
  const lit = count > 0;
  return (
    <div
      className={cn("glass inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold", className)}
      aria-label={`Sequência de ${count} ${count === 1 ? "dia" : "dias"} estudando`}
      title="Dias seguidos estudando"
    >
      <Flame
        className={cn("size-4.5 transition-colors", lit ? "fill-flame text-flame motion-safe:animate-pulse" : "text-muted")}
        aria-hidden="true"
      />
      <span className={cn("tabular-nums", !hydrated && "opacity-0")}>{count}</span>
    </div>
  );
}

export function XpChip({ className }: { className?: string }) {
  const { hydrated, progress } = useHydratedProgress();
  const info = levelFromXp(progress.xp);
  const pct = Math.round(info.progress * 100);
  return (
    <div
      className={cn("glass inline-flex h-10 items-center gap-2 rounded-full pl-1.5 pr-3 text-sm font-semibold", className)}
      aria-label={`Nível ${info.level}, ${progress.xp} XP no total, ${pct}% até o próximo nível`}
      title={`${info.name} · ${info.current}/${info.needed} XP para o próximo nível`}
    >
      <span
        className="grid size-7 place-items-center rounded-full text-xs font-bold text-on-accent"
        style={{ background: `conic-gradient(var(--accent) ${pct * 3.6}deg, color-mix(in oklab, var(--accent) 30%, transparent) 0deg)` }}
        aria-hidden="true"
      >
        <span className="grid size-5.5 place-items-center rounded-full bg-elev text-[0.7rem] text-fg">{hydrated ? info.level : ""}</span>
      </span>
      <Sparkles className="size-4 text-accent-text" aria-hidden="true" />
      <span className={cn("tabular-nums", !hydrated && "opacity-0")}>{progress.xp} XP</span>
    </div>
  );
}
