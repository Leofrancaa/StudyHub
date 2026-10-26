"use client";

import { motion } from "motion/react";
import { CircleCheck, CircleX, HelpCircle } from "lucide-react";
import { useId, useState } from "react";
import type { MiniCheckBlock as MiniCheckBlockData } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

/** Pergunta rápida, não avaliativa (não conta XP nem nota). */
export function MiniCheckBlock({ block }: { block: MiniCheckBlockData }) {
  const [choice, setChoice] = useState<number | null>(null);
  const id = useId();
  const answered = choice !== null;
  const correct = choice === block.answerIndex;

  return (
    <section className="rounded-3xl border border-dashed border-line-strong p-5 sm:p-6" aria-labelledby={`${id}-q`}>
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-text">
        <HelpCircle className="size-4" aria-hidden="true" /> Checagem rápida · não vale nota
      </p>
      <p id={`${id}-q`} className="mt-2 font-display text-lg font-semibold">
        {block.question}
      </p>
      <div role="radiogroup" aria-labelledby={`${id}-q`} className="mt-4 grid gap-2 sm:grid-cols-2">
        {block.options.map((opt, i) => {
          const isAnswer = i === block.answerIndex;
          const picked = choice === i;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={picked}
              disabled={answered}
              onClick={() => setChoice(i)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left font-medium transition-colors disabled:cursor-default",
                !answered && "border-line bg-elev hover:border-[var(--accent)]",
                answered && isAnswer && "border-success bg-success-soft",
                answered && picked && !isAnswer && "border-danger bg-danger-soft",
                answered && !picked && !isAnswer && "border-line opacity-60",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {answered && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("mt-4 flex gap-2 rounded-2xl p-3", correct ? "bg-success-soft" : "bg-danger-soft")}
          >
            {correct ? (
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <CircleX className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
            )}
            <span>
              <strong>{correct ? "Isso! " : "Quase. "}</strong>
              {block.explanation}
            </span>
          </motion.p>
        )}
      </div>
      {answered && !correct && (
        <button type="button" onClick={() => setChoice(null)} className="mt-3 text-sm font-semibold text-accent-text underline-offset-4 hover:underline">
          Tentar de novo
        </button>
      )}
    </section>
  );
}
