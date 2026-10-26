import { tokenize, type TokenKind } from "@/lib/highlight";
import { cn } from "@/lib/cn";

/** Cores pensadas para fundo escuro fixo (#0f1020), com contraste AA. */
const COLORS: Record<TokenKind, string> = {
  plain: "text-[#e8e8f4]",
  comment: "text-[#9aa0bd] italic",
  string: "text-[#86efac]",
  number: "text-[#fdba74]",
  keyword: "text-[#c4b5fd] font-semibold",
  function: "text-[#7dd3fc]",
  builtin: "text-[#f9a8d4]",
};

export function CodeView({ code, language, className }: { code: string; language: string; className?: string }) {
  return (
    <pre className={cn("overflow-x-auto font-mono leading-relaxed", className)} tabIndex={0}>
      <code>
        {tokenize(code, language).map((t, i) => (
          <span key={i} className={COLORS[t.kind]}>
            {t.text}
          </span>
        ))}
      </code>
    </pre>
  );
}
