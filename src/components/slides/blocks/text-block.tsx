import type { TextBlock as TextBlockData } from "@/lib/content/schema";
import { Markdown } from "@/components/ui/markdown";

export function TextBlock({ block }: { block: TextBlockData }) {
  return <Markdown md={block.md} className="max-w-3xl text-lg leading-relaxed text-muted sm:text-xl" />;
}
