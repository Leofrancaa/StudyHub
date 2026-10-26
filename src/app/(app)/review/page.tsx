import type { Metadata } from "next";
import { getQuestionIndex, getModule } from "@/lib/content/registry";
import { describeCorrectAnswer } from "@/lib/quiz/describe";
import { ReviewDeck, type ReviewItem } from "@/components/gamification/review-deck";

export const metadata: Metadata = {
  title: "Revisão",
  description: "Flashcards das questões que você errou, com repetição espaçada.",
};

export default function ReviewPage() {
  const items: Record<string, ReviewItem> = {};
  for (const [id, ref] of Object.entries(getQuestionIndex())) {
    const q = ref.question;
    items[id] = {
      prompt: q.type === "fill-blank" ? q.prompt.replace("___", "_____") : q.prompt,
      code: q.type === "output" ? q.code : undefined,
      language: q.type === "output" ? q.language : undefined,
      answer: describeCorrectAnswer(q),
      explanation: q.explanation,
      moduleTitle: getModule(ref.courseSlug, ref.moduleSlug)?.module.title ?? ref.moduleSlug,
    };
  }
  return <ReviewDeck items={items} />;
}
