"use client";

import { AnimatePresence, motion } from "motion/react";
import { Brain, CircleCheck, Eye, PartyPopper, RotateCcw } from "lucide-react";
import { useState } from "react";
import { isDue, MAX_BOX } from "@/lib/gamification/review";
import { useHydratedProgress, useToday } from "@/lib/progress/hooks";
import { useProgress } from "@/lib/progress/store";
import { Button, ButtonLink } from "@/components/ui/button";
import { CodeView } from "@/components/ui/code-view";
import { Markdown } from "@/components/ui/markdown";

export type ReviewItem = {
  prompt: string;
  code?: string;
  language?: string;
  answer: string;
  explanation: string;
  moduleTitle: string;
};

export function ReviewDeck({ items }: { items: Record<string, ReviewItem> }) {
  const { hydrated, progress } = useHydratedProgress();
  const answerReview = useProgress((s) => s.answerReview);
  const today = useToday();
  const [revealed, setRevealed] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  if (!hydrated || !today) {
    return <div className="mx-auto h-96 max-w-2xl animate-pulse rounded-4xl bg-sunken" aria-label="Carregando revisão" />;
  }

  const cards = Object.values(progress.review).filter((c) => items[c.questionId]);
  const due = cards.filter((c) => isDue(c, today)).sort((a, b) => a.box - b.box || a.due.localeCompare(b.due));
  const card = due[0];
  const item = card ? items[card.questionId] : undefined;

  const answer = (remembered: boolean) => {
    if (!card) return;
    answerReview(card.questionId, remembered);
    setRevealed(false);
    setDoneCount((n) => n + 1);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          <Brain className="size-8 text-accent-text" aria-hidden="true" /> Revisão
        </h1>
        <p className="mt-2 text-muted">
          Cada erro dos quizzes vira um flashcard. Acertou na revisão, ele volta mais tarde; errou, volta amanhã. Depois de {MAX_BOX}{" "}
          acertos seguidos ele sai da fila.
        </p>
        <p className="mt-3 text-sm font-medium">
          {due.length} para hoje · {cards.length} no total{doneCount > 0 && ` · ${doneCount} revisados agora`}
        </p>
      </header>

      {!card || !item ? (
        <div className="glass rounded-4xl p-10 text-center">
          <PartyPopper className="mx-auto size-10 text-accent-text" aria-hidden="true" />
          <h2 className="mt-4 font-display text-2xl font-bold">{cards.length === 0 ? "Nada para revisar ainda" : "Tudo em dia!"}</h2>
          <p className="mt-2 text-muted">
            {cards.length === 0
              ? "Quando você errar uma questão de quiz, ela aparece aqui."
              : "Os próximos flashcards voltam nos próximos dias."}
          </p>
          <ButtonLink href="/" variant="secondary" className="mt-6">
            Ir para os cursos
          </ButtonLink>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.article
            key={card.questionId}
            initial={{ opacity: 0, rotateX: -8, y: 20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-4xl p-6 sm:p-8"
            aria-labelledby="flashcard-prompt"
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-text">{item.moduleTitle}</span>
              <span className="text-muted">
                Caixa {card.box}/{MAX_BOX}
              </span>
            </div>
            <h2 id="flashcard-prompt" className="mt-4 font-display text-2xl font-bold leading-snug">
              {item.prompt}
            </h2>
            {item.code && (
              <div className="mt-4 overflow-hidden rounded-2xl bg-[#0f1020]">
                <CodeView code={item.code} language={item.language ?? "text"} className="p-4 text-sm" />
              </div>
            )}

            <div aria-live="polite">
              {revealed ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-3xl bg-success-soft p-5">
                  <p className="flex items-center gap-2 font-semibold text-success">
                    <CircleCheck className="size-5" aria-hidden="true" /> {item.answer}
                  </p>
                  <Markdown md={item.explanation} className="mt-2 text-sm text-fg/90" />
                </motion.div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {revealed ? (
                <>
                  <Button variant="secondary" onClick={() => answer(false)}>
                    <RotateCcw className="size-4" aria-hidden="true" /> Errei
                  </Button>
                  <Button variant="success" onClick={() => answer(true)} autoFocus>
                    <CircleCheck className="size-4" aria-hidden="true" /> Lembrei
                  </Button>
                </>
              ) : (
                <Button onClick={() => setRevealed(true)} autoFocus>
                  <Eye className="size-4" aria-hidden="true" /> Mostrar resposta
                </Button>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      )}
    </div>
  );
}
