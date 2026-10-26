"use client";

import { Check, X } from "lucide-react";
import type { PreparedQuestion, QuestionResponse } from "@/lib/quiz/engine";
import { cn } from "@/lib/cn";
import { optionClass, type OptionState } from "./option-styles";

type TFQ = Extract<PreparedQuestion, { type: "true-false" }>;
type TFR = Extract<QuestionResponse, { type: "true-false" }>;

export function TrueFalseQuestion({
  question,
  response,
  onChange,
  locked,
  name,
}: {
  question: TFQ;
  response: TFR | undefined;
  onChange: (r: TFR) => void;
  locked: boolean;
  name: string;
}) {
  return (
    <fieldset className="grid grid-cols-2 gap-3">
      <legend className="sr-only">Verdadeiro ou falso</legend>
      {[true, false].map((value) => {
        const chosen = response?.value === value;
        const isAnswer = question.answer === value;
        const state: OptionState = locked ? (isAnswer ? "correct" : chosen ? "wrong" : "dim") : chosen ? "selected" : "idle";
        const Icon = value ? Check : X;
        return (
          <label key={String(value)} className={cn(optionClass(state), "flex-col items-center justify-center py-6 text-center text-lg")}>
            <input
              type="radio"
              name={name}
              checked={chosen}
              disabled={locked}
              onChange={() => onChange({ type: "true-false", value })}
              className="sr-only"
            />
            <Icon className="size-7" aria-hidden="true" />
            {value ? "Verdadeiro" : "Falso"}
          </label>
        );
      })}
    </fieldset>
  );
}
