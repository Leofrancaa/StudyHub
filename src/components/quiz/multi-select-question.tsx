"use client";

import { Check, X } from "lucide-react";
import type { PreparedQuestion, QuestionResponse } from "@/lib/quiz/engine";
import { markerClass, optionClass, type OptionState } from "./option-styles";

type MSQ = Extract<PreparedQuestion, { type: "multi-select" }>;
type MSR = Extract<QuestionResponse, { type: "multi-select" }>;

export function MultiSelectQuestion({
  question,
  response,
  onChange,
  locked,
}: {
  question: MSQ;
  response: MSR | undefined;
  onChange: (r: MSR) => void;
  locked: boolean;
}) {
  const chosen = new Set(response?.optionIds ?? []);
  const byId = new Map(question.options.map((o) => [o.id, o]));
  const toggle = (id: string) => {
    const next = new Set(chosen);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ type: "multi-select", optionIds: [...next] });
  };
  return (
    <fieldset className="space-y-2.5">
      <legend className="mb-2 text-sm text-muted">Pode haver mais de uma correta.</legend>
      {question.order.map((id) => {
        const isAnswer = question.answers.includes(id);
        const picked = chosen.has(id);
        const state: OptionState = locked
          ? isAnswer
            ? picked
              ? "correct"
              : "missed"
            : picked
              ? "wrong"
              : "dim"
          : picked
            ? "selected"
            : "idle";
        return (
          <label key={id} className={optionClass(state)}>
            <input type="checkbox" checked={picked} disabled={locked} onChange={() => toggle(id)} className="sr-only" />
            <span className={markerClass(state, "square")} aria-hidden="true">
              {(state === "selected" || state === "correct") && <Check className="size-3" />}
              {state === "wrong" && <X className="size-3" />}
            </span>
            <span>{byId.get(id)!.text}</span>
            {locked && state === "missed" && <span className="ml-auto text-xs font-semibold text-success">faltou marcar</span>}
          </label>
        );
      })}
    </fieldset>
  );
}
