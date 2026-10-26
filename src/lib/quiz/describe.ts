import type { Question } from "@/lib/content/schema";

/** Texto da resposta correta, para a revisão das erradas e os flashcards. */
export function describeCorrectAnswer(q: Question): string {
  switch (q.type) {
    case "multiple-choice":
    case "output":
      return q.options.find((o) => o.id === q.answer)?.text ?? "";
    case "true-false":
      return q.answer ? "Verdadeiro" : "Falso";
    case "multi-select":
      return q.options
        .filter((o) => q.answers.includes(o.id))
        .map((o) => o.text)
        .join(" · ");
    case "ordering":
      return q.items.map((i, n) => `${n + 1}. ${i.text}`).join("  ");
    case "fill-blank":
      return q.accepted[0] ?? "";
    case "matching":
      return q.pairs.map((p) => `${p.left} → ${p.right}`).join(" · ");
  }
}

export const QUESTION_TYPE_LABEL: Record<Question["type"], string> = {
  "multiple-choice": "Múltipla escolha",
  "true-false": "Verdadeiro ou falso",
  "multi-select": "Marque todas as corretas",
  ordering: "Coloque em ordem",
  "fill-blank": "Complete a lacuna",
  matching: "Associe as colunas",
  output: "Qual é a saída?",
};
