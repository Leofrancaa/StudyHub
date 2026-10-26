"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { CodeBlock as CodeBlockData } from "@/lib/content/schema";
import { CodeView } from "@/components/ui/code-view";

export function CodeBlock({ block }: { block: CodeBlockData }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <figure className="overflow-hidden rounded-3xl border border-line bg-[#0f1020] text-[#e8e8f4] shadow-soft">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#a6abc4]">{block.language}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-[#c7cbe0] hover:bg-white/10 hover:text-white"
          aria-label={copied ? "Código copiado" : "Copiar código"}
        >
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <CodeView code={block.code} language={block.language} className="p-5 text-[0.95rem] sm:text-base" />
      {block.caption && <figcaption className="border-t border-white/10 px-5 py-3 text-sm text-[#c7cbe0]">{block.caption}</figcaption>}
    </figure>
  );
}
