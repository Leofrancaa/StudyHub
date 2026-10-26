"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Award, Clock, Flame, Lock, Repeat, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { levelFromXp } from "@/lib/gamification/levels";
import { isDue } from "@/lib/gamification/review";
import { activeStreak } from "@/lib/gamification/streak";
import type { CourseSummary } from "@/lib/content/summary";
import { courseThemeStyle } from "@/lib/content/theme";
import { useHydratedProgress, useToday } from "@/lib/progress/hooks";
import { useProgress } from "@/lib/progress/store";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";
import { ContinueButton, CourseProgress } from "@/components/course/course-progress";
import { AchievementIcon } from "./achievement-icon";

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${min % 60} min`;
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Dashboard({ courses }: { courses: CourseSummary[] }) {
  const { hydrated, progress } = useHydratedProgress();
  const reset = useProgress((s) => s.reset);
  const today = useToday();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!hydrated || !today) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Carregando dashboard">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-sunken" />
        ))}
      </div>
    );
  }

  const level = levelFromXp(progress.xp);
  const streak = activeStreak(progress.streak, today);
  const due = Object.values(progress.review).filter((c) => isDue(c, today)).length;
  const unlockedCount = ACHIEVEMENTS.filter((a) => progress.achievements[a.id]).length;

  return (
    <div className="space-y-10">
      <section className="glass relative overflow-hidden rounded-4xl p-6 sm:p-8">
        <div className="gradient-accent absolute -right-16 -top-16 size-64 rounded-full opacity-25 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="gradient-accent grid size-24 shrink-0 place-items-center rounded-full font-display text-4xl font-bold text-on-accent shadow-lift"
            aria-hidden="true"
          >
            {level.level}
          </motion.div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Nível {level.level}</p>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{level.name}</h1>
            <ProgressBar value={level.progress} label="Progresso até o próximo nível" className="mt-4" />
            <p className="mt-2 text-sm text-muted">
              {level.current} / {level.needed} XP para o nível {level.level + 1}
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Estatísticas" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Sparkles className="size-4" aria-hidden="true" />} label="XP total" value={String(progress.xp)} />
        <StatCard
          icon={<Flame className={cn("size-4", streak > 0 && "fill-flame text-flame")} aria-hidden="true" />}
          label="Streak"
          value={`${streak} ${streak === 1 ? "dia" : "dias"}`}
          hint={`Recorde: ${progress.streak.best}`}
        />
        <StatCard icon={<Clock className="size-4" aria-hidden="true" />} label="Tempo estudado" value={formatDuration(progress.studySeconds)} />
        <StatCard
          icon={<Repeat className="size-4" aria-hidden="true" />}
          label="Revisões pendentes"
          value={String(due)}
          hint={`${progress.reviewsDone} revisões feitas`}
        />
      </section>

      {due > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-warning-soft p-5">
          <p className="font-medium">
            Você tem <strong>{due}</strong> {due === 1 ? "flashcard" : "flashcards"} para revisar hoje.
          </p>
          <ButtonLink href="/review">Revisar agora</ButtonLink>
        </div>
      )}

      <section aria-labelledby="cursos">
        <h2 id="cursos" className="font-display text-2xl font-bold">
          Seus cursos
        </h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {courses.map((c) => (
            <li key={c.slug} style={courseThemeStyle(c)} className="glass space-y-4 rounded-3xl p-6">
              <Link href={`/courses/${c.slug}`} className="font-display text-lg font-bold hover:underline">
                {c.title}
              </Link>
              <CourseProgress course={c} />
              <ContinueButton course={c} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="conquistas">
        <div className="flex items-end justify-between">
          <h2 id="conquistas" className="flex items-center gap-2 font-display text-2xl font-bold">
            <Award className="size-6 text-accent-text" aria-hidden="true" /> Conquistas
          </h2>
          <p className="text-sm text-muted">
            {unlockedCount}/{ACHIEVEMENTS.length}
          </p>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a, i) => {
            const at = progress.achievements[a.id];
            return (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn("glass rounded-3xl p-4 text-center", !at && "opacity-60")}
              >
                <span
                  className={cn(
                    "mx-auto grid size-14 place-items-center rounded-2xl",
                    at ? "gradient-accent text-on-accent shadow-soft" : "bg-sunken text-muted",
                  )}
                >
                  {at ? <AchievementIcon name={a.icon} className="size-7" /> : <Lock className="size-6" aria-hidden="true" />}
                </span>
                <p className="mt-3 font-display font-semibold">{a.title}</p>
                <p className="mt-1 text-xs text-muted">{a.description}</p>
                <p className="sr-only">{at ? "Desbloqueada" : "Bloqueada"}</p>
                {at && <p className="mt-2 text-xs font-medium text-accent-text">{new Date(at).toLocaleDateString("pt-BR")}</p>}
              </motion.li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <ThemeToggle />
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-danger">Apagar todo o progresso deste navegador? Não dá para desfazer.</p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
            >
              Sim, apagar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
              Cancelar
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
            <Trash2 className="size-4" aria-hidden="true" /> Zerar progresso
          </Button>
        )}
      </section>
    </div>
  );
}
