"use client";

import type { PreparedQuestion, QuestionResponse } from "@/lib/quiz/engine";
import { ChoiceQuestion } from "./choice-question";
import { FillBlankQuestion } from "./fill-blank-question";
import { MatchingQuestion } from "./matching-question";
import { MultiSelectQuestion } from "./multi-select-question";
import { OrderingQuestion } from "./ordering-question";
import { TrueFalseQuestion } from "./true-false-question";

type Props = {
  question: PreparedQuestion;
  response: QuestionResponse | undefined;
  onChange: (r: QuestionResponse) => void;
  onSubmit: () => void;
  locked: boolean;
  correct: boolean | null;
};

/** Escolhe o componente pelo tipo da questão. */
export function QuestionView({ question, response, onChange, onSubmit, locked, correct }: Props) {
  const name = `q-${question.id}`;
  switch (question.type) {
    case "multiple-choice":
    case "output":
      return (
        <ChoiceQuestion
          question={question}
          response={response?.type === question.type ? response : undefined}
          onChange={onChange}
          locked={locked}
          name={name}
        />
      );
    case "true-false":
      return (
        <TrueFalseQuestion
          question={question}
          response={response?.type === "true-false" ? response : undefined}
          onChange={onChange}
          locked={locked}
          name={name}
        />
      );
    case "multi-select":
      return (
        <MultiSelectQuestion
          question={question}
          response={response?.type === "multi-select" ? response : undefined}
          onChange={onChange}
          locked={locked}
        />
      );
    case "ordering":
      return (
        <OrderingQuestion
          question={question}
          response={response?.type === "ordering" ? response : undefined}
          onChange={onChange}
          locked={locked}
        />
      );
    case "fill-blank":
      return (
        <FillBlankQuestion
          question={question}
          response={response?.type === "fill-blank" ? response : undefined}
          onChange={onChange}
          onSubmit={onSubmit}
          locked={locked}
          correct={correct}
          inputId={`${name}-input`}
        />
      );
    case "matching":
      return (
        <MatchingQuestion
          question={question}
          response={response?.type === "matching" ? response : undefined}
          onChange={onChange}
          locked={locked}
          name={name}
        />
      );
  }
}

/** Resposta inicial: ordenação já começa "completa" com a ordem embaralhada. */
export function initialResponse(q: PreparedQuestion): QuestionResponse | undefined {
  if (q.type === "ordering") return { type: "ordering", itemIds: q.order };
  if (q.type === "matching") return { type: "matching", matches: {} };
  return undefined;
}
