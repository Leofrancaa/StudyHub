"use client";

import type { PreparedQuestion, QuestionResponse } from "@/lib/quiz/engine";
import { cn } from "@/lib/cn";

type FBQ = Extract<PreparedQuestion, { type: "fill-blank" }>;
type FBR = Extract<QuestionResponse, { type: "fill-blank" }>;

export function FillBlankQuestion({
  question,
  response,
  onChange,
  onSubmit,
  locked,
  correct,
  inputId,
}: {
  question: FBQ;
  response: FBR | undefined;
  onChange: (r: FBR) => void;
  onSubmit: () => void;
  locked: boolean;
  correct: boolean | null;
  inputId: string;
}) {
  const [before, after] = question.prompt.split("___") as [string, string];
  return (
    <div className="rounded-3xl border border-line bg-elev p-5 text-lg leading-loose sm:text-xl">
      <span>{before}</span>
      <input
        id={inputId}
        value={response?.text ?? ""}
        onChange={(e) => onChange({ type: "fill-blank", text: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        disabled={locked}
        autoComplete="off"
        spellCheck={false}
        aria-label="Resposta da lacuna"
        className={cn(
          "mx-1 inline-block w-48 border-b-2 bg-transparent px-1 text-center font-semibold outline-none",
          !locked && "border-[var(--accent)] focus-visible:bg-accent-soft",
          locked && correct && "border-success text-success",
          locked && correct === false && "border-danger text-danger line-through",
        )}
      />
      <span>{after}</span>
      {locked && correct === false && (
        <p className="mt-3 text-base">
          Resposta esperada: <strong className="text-success">{question.accepted[0]}</strong>
        </p>
      )}
    </div>
  );
}
