"use client";

import { ArrowRight, Check, X } from "lucide-react";
import type { PreparedQuestion, QuestionResponse } from "@/lib/quiz/engine";
import { cn } from "@/lib/cn";

type MQ = Extract<PreparedQuestion, { type: "matching" }>;
type MR = Extract<QuestionResponse, { type: "matching" }>;

export function MatchingQuestion({
  question,
  response,
  onChange,
  locked,
  name,
}: {
  question: MQ;
  response: MR | undefined;
  onChange: (r: MR) => void;
  locked: boolean;
  name: string;
}) {
  const matches = response?.matches ?? {};
  const rightById = new Map(question.pairs.map((p) => [p.id, p.right]));
  return (
    <ul className="space-y-3">
      {question.pairs.map((pair) => {
        const chosen = matches[pair.id] ?? "";
        const ok = chosen === pair.id;
        const selectId = `${name}-${pair.id}`;
        return (
          <li
            key={pair.id}
            className={cn(
              "grid items-center gap-2 rounded-2xl border-2 p-3 sm:grid-cols-[1fr_auto_1.2fr] sm:gap-3",
              !locked && "border-line bg-elev",
              locked && ok && "border-success bg-success-soft",
              locked && !ok && "border-danger bg-danger-soft",
            )}
          >
            <label htmlFor={selectId} className="font-medium">
              {pair.left}
            </label>
            <ArrowRight className="hidden size-4 text-muted sm:block" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <select
                id={selectId}
                value={chosen}
                disabled={locked}
                onChange={(e) => onChange({ type: "matching", matches: { ...matches, [pair.id]: e.target.value } })}
                className="h-11 w-full min-w-0 rounded-xl border border-line bg-bg px-3 text-fg disabled:opacity-100"
              >
                <option value="" disabled>
                  Escolha…
                </option>
                {question.order.map((id) => (
                  <option key={id} value={id}>
                    {rightById.get(id)}
                  </option>
                ))}
              </select>
              {locked &&
                (ok ? (
                  <Check className="size-5 shrink-0 text-success" aria-label="correto" />
                ) : (
                  <X className="size-5 shrink-0 text-danger" aria-label="incorreto" />
                ))}
            </div>
            {locked && !ok && (
              <p className="text-sm sm:col-span-3">
                Correto: <strong className="text-success">{pair.right}</strong>
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
