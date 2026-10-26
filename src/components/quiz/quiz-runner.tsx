"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleCheck, CircleX, Flame, Lightbulb, Lock, Swords, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DifficultyMix, Question } from "@/lib/content/schema";
import { celebrate } from "@/lib/confetti";
import { comboSequence, xpForAnswer } from "@/lib/gamification/xp";
import { useHydratedProgress, useStudyTimer } from "@/lib/progress/hooks";
import type { QuizResultDetail } from "@/lib/progress/reducers";
import { useProgress } from "@/lib/progress/store";
import { getModuleProgress } from "@/lib/progress/types";
import { isModuleUnlocked } from "@/lib/progress/unlock";
import {
  gradeQuestion,
  isResponseComplete,
  pickQuestions,
  prepareQuestion,
  requiredCorrect,
  type PreparedQuestion,
  type QuestionResponse,
} from "@/lib/quiz/engine";
import { QUESTION_TYPE_LABEL } from "@/lib/quiz/describe";
import { Button, ButtonLink } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import { initialResponse, QuestionView } from "./question-view";
import { QuizResults } from "./quiz-results";

export type QuizRunnerProps = {
  courseSlug: string;
  moduleSlug: string;
  moduleTitle: string;
  moduleIndex: number;
  moduleSlugs: string[];
  upcomingCount: number;
  nextModule: { slug: string; title: string } | null;
  questionsPerAttempt: number;
  difficultyMix: DifficultyMix;
  bank: Question[];
  /** tag → slide que ensina aquele subtópico (para revisar erros). */
  slideByTag: Record<string, { id: string; index: number }>;
};

const DIFFICULTY_LABEL = { easy: "Fácil", medium: "Média", hard: "Difícil" } as const;

type Phase = "intro" | "playing" | "results";

export function QuizRunner(props: QuizRunnerProps) {
  const { courseSlug, moduleSlug, moduleTitle, moduleIndex, moduleSlugs, questionsPerAttempt, bank } = props;
  const { hydrated, progress } = useHydratedProgress();
  const recordQuiz = useProgress((s) => s.recordQuiz);
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState<Record<string, QuestionResponse | undefined>>({});
  const [results, setResults] = useState<boolean[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [detail, setDetail] = useState<QuizResultDetail | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const unlocked = isModuleUnlocked(progress, courseSlug, moduleSlugs, moduleIndex);
  const modProgress = getModuleProgress(progress, courseSlug, moduleSlug);
  useStudyTimer(phase === "playing");

  const question = questions[current];
  const submitted = results.length > current;
  const lastCorrect = submitted ? (results[current] ?? null) : null;
  const combo = comboSequence(results).at(-1) ?? 0;
  const xpSoFar = results.reduce((sum, ok, i) => sum + xpForAnswer(ok, comboSequence(results)[i] ?? 0, modProgress.passed), 0);

  const start = () => {
    const picked = pickQuestions(bank, questionsPerAttempt, props.difficultyMix, modProgress.lastAttemptQuestionIds);
    const prepared = picked.map((q) => prepareQuestion(q));
    setQuestions(prepared);
    setResponses(Object.fromEntries(prepared.map((q) => [q.id, initialResponse(q)])));
    setResults([]);
    setCurrent(0);
    setShowHint(false);
    setDetail(null);
    setPhase("playing");
  };

  const submit = () => {
    if (!question || submitted) return;
    const response = responses[question.id];
    if (!isResponseComplete(question, response)) return;
    const ok = gradeQuestion(question, response!);
    setResults((r) => [...r, ok]);
    if (ok) void celebrate("tiny");
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setShowHint(false);
      return;
    }
    const d = recordQuiz({
      courseSlug,
      moduleSlug,
      answers: questions.map((q, i) => ({ questionId: q.id, correct: results[i] ?? false })),
      courseModuleSlugs: moduleSlugs,
      upcomingCount: props.upcomingCount,
    });
    setDetail(d);
    setPhase("results");
    if (d.passed) void celebrate("big");
  };

  // Foco: botão "próxima" após responder; título ao trocar de questão.
  useEffect(() => {
    if (submitted) nextRef.current?.focus();
  }, [submitted]);
  useEffect(() => {
    if (phase === "playing") headingRef.current?.focus();
  }, [current, phase]);

  if (!hydrated) {
    return <div className="mx-auto mt-24 h-80 max-w-2xl animate-pulse rounded-4xl bg-sunken" aria-label="Carregando quiz" />;
  }

  if (!unlocked) {
    return (
      <div className="grid min-h-[70dvh] place-items-center p-6">
        <div className="glass max-w-md rounded-4xl p-8 text-center">
          <Lock className="mx-auto size-8 text-muted" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold">Quiz bloqueado</h1>
          <p className="mt-2 text-muted">Seja aprovado no módulo anterior para liberar este desafio.</p>
          <ButtonLink href={`/courses/${courseSlug}`} className="mt-6">
            Voltar para a trilha
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (phase === "results" && detail) {
    return (
      <QuizResults
        {...props}
        detail={detail}
        questions={questions}
        results={results}
        onRetry={start}
      />
    );
  }

  if (phase === "intro" || !question) {
    const need = requiredCorrect(questionsPerAttempt);
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
        <div className="glass rounded-4xl p-8 sm:p-10">
          <span className="gradient-accent grid size-14 place-items-center rounded-2xl text-on-accent shadow-soft">
            <Swords className="size-7" aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent-text">Desafio do módulo {moduleIndex + 1}</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{moduleTitle}</h1>
          <ul className="mt-6 space-y-2 text-muted">
            <li>• {questionsPerAttempt} questões sorteadas de um banco de {bank.length}.</li>
            <li>
              • Para passar: <strong className="text-fg">{need} acertos</strong> (90%).
            </li>
            <li>• Feedback com explicação depois de cada resposta.</li>
            <li>• Tentativas ilimitadas; cada tentativa sorteia questões diferentes.</li>
          </ul>
          {modProgress.attempts > 0 && (
            <p className="mt-6 rounded-2xl bg-sunken px-4 py-3 text-sm">
              {modProgress.attempts} {modProgress.attempts === 1 ? "tentativa" : "tentativas"} · melhor nota{" "}
              <strong>{Math.round(modProgress.bestScore * 100)}%</strong>
              {modProgress.passed && <span className="ml-2 font-semibold text-success">Aprovado ✓</span>}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={start} autoFocus>
              Começar
            </Button>
            <ButtonLink href={`/courses/${courseSlug}/${moduleSlug}`} variant="secondary" size="lg">
              Rever os slides
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const response = responses[question.id];
  const canSubmit = isResponseComplete(question, response);
  const gained = submitted && lastCorrect ? xpForAnswer(true, combo, modProgress.passed) : 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_oklab,var(--bg)_80%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href={`/courses/${courseSlug}`}
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-accent-soft hover:text-fg"
            aria-label="Abandonar o quiz e voltar para a trilha"
          >
            <X className="size-5" aria-hidden="true" />
          </Link>
          <ProgressBar value={(current + (submitted ? 1 : 0)) / questions.length} label="Progresso no quiz" />
          <span
            className={cn("inline-flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums", combo >= 2 ? "text-flame" : "text-muted")}
            aria-label={`Combo de ${combo} acertos seguidos`}
          >
            <Flame className={cn("size-4", combo >= 2 && "fill-current")} aria-hidden="true" /> {combo}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums text-accent-text" aria-label={`${xpSoFar} XP nesta tentativa`}>
            <Zap className="size-4" aria-hidden="true" /> {xpSoFar}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={submitted && lastCorrect === false && !reduceMotion ? { opacity: 1, y: 0, x: [0, -10, 10, -6, 6, 0] } : { opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-text">
                Questão {current + 1} de {questions.length}
              </span>
              <span className="rounded-full bg-sunken px-2.5 py-1 text-muted">{QUESTION_TYPE_LABEL[question.type]}</span>
              <span className="rounded-full bg-sunken px-2.5 py-1 text-muted">{DIFFICULTY_LABEL[question.difficulty]}</span>
            </div>
            <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-2xl font-bold leading-snug outline-none sm:text-3xl">
              {question.type === "fill-blank" ? "Complete a frase" : question.prompt}
            </h1>

            {question.hint && !submitted && (
              <div className="mt-3">
                {showHint ? (
                  <p className="flex gap-2 rounded-2xl bg-warning-soft p-3 text-sm">
                    <Lightbulb className="size-4 shrink-0 text-warning" aria-hidden="true" /> {question.hint}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text underline-offset-4 hover:underline"
                  >
                    <Lightbulb className="size-4" aria-hidden="true" /> Ver dica
                  </button>
                )}
              </div>
            )}

            <div className="mt-6">
              <QuestionView
                question={question}
                response={response}
                onChange={(r) => setResponses((all) => ({ ...all, [question.id]: r }))}
                onSubmit={submit}
                locked={submitted}
                correct={lastCorrect}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div aria-live="polite" className="mt-6">
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("rounded-3xl border-2 p-5", lastCorrect ? "border-success bg-success-soft" : "border-danger bg-danger-soft")}
            >
              <div className="flex items-center justify-between gap-3">
                <p className={cn("flex items-center gap-2 font-display text-xl font-bold", lastCorrect ? "text-success" : "text-danger")}>
                  {lastCorrect ? <CircleCheck className="size-6" aria-hidden="true" /> : <CircleX className="size-6" aria-hidden="true" />}
                  {lastCorrect ? (combo >= 3 ? `Combo x${combo}!` : "Mandou bem!") : "Não foi dessa vez"}
                </p>
                {gained > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="gradient-accent rounded-full px-3 py-1 text-sm font-bold text-on-accent"
                  >
                    +{gained} XP
                  </motion.span>
                )}
              </div>
              <Markdown md={question.explanation} className="mt-2 text-fg/90" />
            </motion.div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-line bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl justify-end px-4 py-3 sm:px-6">
          {submitted ? (
            <Button ref={nextRef} size="lg" onClick={next}>
              {current + 1 < questions.length ? "Próxima" : "Ver resultado"}
            </Button>
          ) : (
            <Button size="lg" onClick={submit} disabled={!canSubmit}>
              Confirmar
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
