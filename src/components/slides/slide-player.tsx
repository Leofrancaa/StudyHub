"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Clock, Lock, Swords, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Slide } from "@/lib/content/schema";
import { useHydratedProgress, useStudyTimer } from "@/lib/progress/hooks";
import { useProgress } from "@/lib/progress/store";
import { getModuleProgress } from "@/lib/progress/types";
import { isModuleUnlocked } from "@/lib/progress/unlock";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SlideBlocks } from "./block-renderer";

export type SlidePlayerProps = {
  courseSlug: string;
  courseTitle: string;
  moduleSlug: string;
  moduleTitle: string;
  moduleIndex: number;
  moduleSlugs: string[];
  estimatedMinutes: number;
  slides: Slide[];
};

/** Tempo mínimo na tela para o slide contar como concluído. */
const SEEN_AFTER_MS = 1500;

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

export function SlidePlayer(props: SlidePlayerProps) {
  const { courseSlug, moduleSlug, moduleTitle, moduleIndex, moduleSlugs, slides, estimatedMinutes } = props;
  const { hydrated, progress } = useHydratedProgress();
  const markSlideSeen = useProgress((s) => s.markSlideSeen);
  const reduceMotion = useReducedMotion();
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const [resumed, setResumed] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const unlocked = isModuleUnlocked(progress, courseSlug, moduleSlugs, moduleIndex);
  useStudyTimer(hydrated && unlocked);

  // Retoma do primeiro slide ainda não visto (uma vez, depois de hidratar).
  useEffect(() => {
    if (!hydrated || resumed) return;
    const seen = getModuleProgress(progress, courseSlug, moduleSlug).slidesSeen;
    // Link direto para um slide (ex.: revisão de erro do quiz) tem prioridade.
    const fromHash = slides.findIndex((s) => `#${s.id}` === window.location.hash);
    const firstUnseen = slides.findIndex((s) => !seen.includes(s.id));
    const target = fromHash >= 0 ? fromHash : firstUnseen > 0 ? firstUnseen : 0;
    // Adiar para o próximo frame evita setState síncrono dentro do efeito.
    const id = requestAnimationFrame(() => {
      setPage([target, 0]);
      setResumed(true);
    });
    return () => cancelAnimationFrame(id);
  }, [hydrated, resumed, progress, courseSlug, moduleSlug, slides]);

  const slide = slides[index]!;
  const isLast = index === slides.length - 1;

  useEffect(() => {
    if (!hydrated || !unlocked) return;
    const id = window.setTimeout(() => markSlideSeen(courseSlug, moduleSlug, slide.id), SEEN_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [hydrated, unlocked, slide.id, courseSlug, moduleSlug, markSlideSeen]);

  const go = useCallback(
    (delta: number) => {
      setPage(([i]) => {
        const next = Math.min(slides.length - 1, Math.max(0, i + delta));
        return next === i ? [i, 0] : [next, delta];
      });
    },
    [slides.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Leva o foco ao novo slide para leitores de tela (sem rolar a página).
  useEffect(() => {
    if (direction !== 0) regionRef.current?.focus({ preventScroll: true });
  }, [index, direction]);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "touch") swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const remainingMin = Math.max(1, Math.ceil((estimatedMinutes * (slides.length - index - 1)) / slides.length));
  const offset = reduceMotion ? 0 : 60;

  if (hydrated && !unlocked) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <div className="glass max-w-md rounded-4xl p-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-sunken text-muted">
            <Lock className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold">Módulo bloqueado</h1>
          <p className="mt-2 text-muted">Seja aprovado no quiz do módulo anterior (90% de acerto) para liberar este.</p>
          <ButtonLink href={`/courses/${courseSlug}`} className="mt-6">
            Voltar para a trilha
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_oklab,var(--bg)_80%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href={`/courses/${courseSlug}`}
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-accent-soft hover:text-fg"
            aria-label="Sair do módulo e voltar para a trilha"
          >
            <X className="size-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <h1 className="truncate font-display font-semibold">
                <span className="text-muted">Módulo {moduleIndex + 1} · </span>
                {moduleTitle}
              </h1>
              <span className="shrink-0 tabular-nums text-muted">
                {index + 1}/{slides.length}
              </span>
            </div>
            <ProgressBar value={(index + 1) / slides.length} label="Progresso no módulo" size="sm" className="mt-2" />
          </div>
          <span className="hidden shrink-0 items-center gap-1 text-xs text-muted sm:inline-flex" title="Tempo estimado restante">
            <Clock className="size-3.5" aria-hidden="true" /> ~{isLast ? 0 : remainingMin} min
          </span>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <p className="sr-only" aria-live="polite">
          Slide {index + 1} de {slides.length}
        </p>
        <div ref={regionRef} tabIndex={-1} className="flex-1 outline-none" aria-roledescription="slide" aria-label={`Slide ${index + 1} de ${slides.length}`}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.section
              key={slide.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * offset }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -offset }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={!resumed && hydrated ? "opacity-0" : undefined}
            >
              <SlideBlocks blocks={slide.blocks} />
              {isLast && (
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <ButtonLink href={`/courses/${courseSlug}/${moduleSlug}/quiz`} size="lg">
                    <Swords className="size-5" aria-hidden="true" /> Fazer o desafio
                  </ButtonLink>
                  <p className="text-sm text-muted">Acerte 90% para liberar o próximo módulo.</p>
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        </div>
      </main>

      <nav
        aria-label="Navegação entre slides"
        className="sticky bottom-0 border-t border-line bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Button variant="secondary" onClick={() => go(-1)} disabled={index === 0} aria-label="Slide anterior">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          <ol className="hidden items-center gap-1.5 md:flex" aria-label="Ir para slide">
            {slides.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setPage([i, i > index ? 1 : -1])}
                  aria-label={`Ir para o slide ${i + 1}`}
                  aria-current={i === index ? "step" : undefined}
                  className={
                    i === index
                      ? "gradient-accent block h-2.5 w-6 rounded-full"
                      : "block size-2.5 rounded-full bg-line-strong hover:bg-[var(--accent)]"
                  }
                />
              </li>
            ))}
          </ol>
          {isLast ? (
            <ButtonLink href={`/courses/${courseSlug}/${moduleSlug}/quiz`}>
              Desafio <Swords className="size-4" aria-hidden="true" />
            </ButtonLink>
          ) : (
            <Button onClick={() => go(1)} aria-label="Próximo slide">
              <span className="hidden sm:inline">Próximo</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
        <p className="pb-2 text-center text-xs text-muted max-sm:hidden">Use ← → no teclado ou deslize no celular</p>
      </nav>
    </div>
  );
}
