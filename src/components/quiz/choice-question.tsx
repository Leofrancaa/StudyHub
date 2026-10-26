"use client";

import { Check, X } from "lucide-react";
import type { PreparedQuestion, QuestionResponse } from "@/lib/quiz/engine";
import { CodeView } from "@/components/ui/code-view";
import { markerClass, optionClass, type OptionState } from "./option-styles";

type ChoiceQ = Extract<PreparedQuestion, { type: "multiple-choice" | "output" }>;
type ChoiceR = Extract<QuestionResponse, { type: "multiple-choice" | "output" }>;

export function ChoiceQuestion({
  question,
  response,
  onChange,
  locked,
  name,
}: {
  question: ChoiceQ;
  response: ChoiceR | undefined;
  onChange: (r: ChoiceR) => void;
  locked: boolean;
  name: string;
}) {
  const byId = new Map(question.options.map((o) => [o.id, o]));
  const chosen = response?.optionId;
  return (
    <div className="space-y-4">
      {question.type === "output" && (
        <div className="overflow-hidden rounded-2xl border border-line bg-[#0f1020]">
          <CodeView code={question.code} language={question.language} className="p-4 text-sm sm:text-base" />
        </div>
      )}
      <fieldset className="space-y-2.5">
        <legend className="sr-only">Alternativas</legend>
        {question.order.map((id, i) => {
          const opt = byId.get(id)!;
          const isAnswer = id === question.answer;
          const state: OptionState = locked
            ? isAnswer
              ? "correct"
              : chosen === id
                ? "wrong"
                : "dim"
            : chosen === id
              ? "selected"
              : "idle";
          return (
            <label key={id} className={optionClass(state)}>
              <input
                type="radio"
                name={name}
                value={id}
                checked={chosen === id}
                disabled={locked}
                onChange={() => onChange({ type: question.type, optionId: id })}
                className="sr-only"
              />
              <span className={markerClass(state, "circle")} aria-hidden="true">
                {state === "correct" ? <Check className="size-3" /> : state === "wrong" ? <X className="size-3" /> : String.fromCharCode(65 + i)}
              </span>
              <span className={question.type === "output" ? "font-mono" : undefined}>{opt.text}</span>
              {locked && isAnswer && <span className="sr-only">(resposta correta)</span>}
              {locked && chosen === id && !isAnswer && <span className="sr-only">(sua resposta, incorreta)</span>}
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
