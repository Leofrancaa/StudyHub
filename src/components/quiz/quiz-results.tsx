"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, CircleX, RotateCcw, Trophy } from "lucide-react";
import type { QuizResultDetail } from "@/lib/progress/reducers";
import { describeCorrectAnswer } from "@/lib/quiz/describe";
import { requiredCorrect, type PreparedQuestion } from "@/lib/quiz/engine";
import { Button, ButtonLink } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/cn";
import type { QuizRunnerProps } from "./quiz-runner";

type Props = QuizRunnerProps & {
  detail: QuizResultDetail;
  questions: PreparedQuestion[];
  results: boolean[];
  onRetry: () => void;
};

function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-40">
      <svg viewBox="0 0 120 120" className="size-40 -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth="12" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={passed ? "var(--success)" : "var(--danger)"}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-4xl font-bold tabular-nums">{Math.round(score * 100)}%</span>
    </div>
  );
}

export function QuizResults({ courseSlug, moduleSlug, nextModule, detail, questions, results, onRetry, slideByTag }: Props) {
  const wrong = questions.filter((_, i) => !results[i]);
  const need = requiredCorrect(detail.total);
  const xpRows = [
    { label: "Acertos", value: detail.xp.answers },
    { label: "Combos", value: detail.xp.combo },
    { label: "Aprovação", value: detail.xp.pass },
    { label: "De primeira", value: detail.xp.firstTry },
    { label: "Gabarito", value: detail.xp.perfect },
  ].filter((r) => r.value > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <section className="glass rounded-4xl p-8 text-center sm:p-10" aria-labelledby="resultado">
        <div className="flex justify-center">
          <ScoreRing score={detail.score} passed={detail.passed} />
        </div>
        <h1 id="resultado" className="mt-6 font-display text-3xl font-bold tracking-tight">
          {detail.passed ? (detail.score === 1 ? "Gabaritou!" : "Aprovado!") : "Quase lá"}
        </h1>
        <p className="mt-2 text-muted">
          {detail.correct} de {detail.total} acertos · precisava de {need}.{" "}
          {detail.passed
            ? detail.firstPass
              ? "Próximo módulo liberado."
              : "Você já tinha passado; ótimo para fixar."
            : `Faltaram ${need - detail.correct}. Revise os pontos abaixo e tente de novo: as questões mudam.`}
        </p>

        {detail.xp.total > 0 && (
          <div className="mx-auto mt-6 max-w-sm rounded-3xl bg-accent-soft p-4 text-left">
            <p className="flex items-center justify-between font-display text-lg font-bold">
              <span className="inline-flex items-center gap-2">
                <Trophy className="size-5 text-accent-text" aria-hidden="true" /> XP ganho
              </span>
              <span className="text-accent-text">+{detail.xp.total}</span>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {xpRows.map((r) => (
                <li key={r.label} className="flex justify-between">
                  <span>{r.label}</span>
                  <span className="tabular-nums">+{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {detail.passed && nextModule ? (
            <ButtonLink href={`/courses/${courseSlug}/${nextModule.slug}`} size="lg">
              Próximo: {nextModule.title} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          ) : detail.passed ? (
            <ButtonLink href={`/courses/${courseSlug}`} size="lg">
              Voltar para a trilha <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          ) : (
            <Button size="lg" onClick={onRetry}>
              <RotateCcw className="size-4" aria-hidden="true" /> Tentar de novo
            </Button>
          )}
          {detail.passed ? (
            <Button variant="secondary" size="lg" onClick={onRetry}>
              <RotateCcw className="size-4" aria-hidden="true" /> Refazer
            </Button>
          ) : (
            <ButtonLink href={`/courses/${courseSlug}/${moduleSlug}`} variant="secondary" size="lg">
              <BookOpen className="size-4" aria-hidden="true" /> Rever os slides
            </ButtonLink>
          )}
        </div>
      </section>

      {wrong.length > 0 && (
        <section className="mt-10" aria-labelledby="revisar">
          <h2 id="revisar" className="font-display text-2xl font-bold">
            Revise o que errou
          </h2>
          <p className="mt-1 text-sm text-muted">Essas questões também viraram flashcards na página Revisão.</p>
          <ul className="mt-5 space-y-4">
            {wrong.map((q) => {
              const slide = q.tags.map((t) => slideByTag[t]).find(Boolean);
              return (
                <li key={q.id} className="glass rounded-3xl p-5">
                  <p className="flex gap-2 font-semibold">
                    <CircleX className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
                    {q.prompt}
                  </p>
                  <p className="mt-3 text-sm">
                    <span className="font-semibold text-success">Resposta certa: </span>
                    {describeCorrectAnswer(q)}
                  </p>
                  <Markdown md={q.explanation} className="mt-2 text-sm text-muted" />
                  {slide && (
                    <Link
                      href={`/courses/${courseSlug}/${moduleSlug}#${slide.id}`}
                      className={cn("mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text underline-offset-4 hover:underline")}
                    >
                      <BookOpen className="size-4" aria-hidden="true" /> Rever no slide {slide.index + 1}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
