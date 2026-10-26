import { Lightbulb, PartyPopper, TriangleAlert } from "lucide-react";
import type { CalloutBlock as CalloutBlockData } from "@/lib/content/schema";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/cn";

const VARIANTS = {
  tip: { Icon: Lightbulb, label: "Dica", box: "border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-success-soft", icon: "text-success" },
  warning: { Icon: TriangleAlert, label: "Atenção", box: "border-[color-mix(in_oklab,var(--warning)_35%,transparent)] bg-warning-soft", icon: "text-warning" },
  fun: { Icon: PartyPopper, label: "Curiosidade", box: "border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-accent-soft", icon: "text-accent-text" },
} as const;

export function CalloutBlock({ block }: { block: CalloutBlockData }) {
  const v = VARIANTS[block.variant];
  return (
    <aside className={cn("flex gap-4 rounded-3xl border p-5", v.box)} aria-label={block.title ?? v.label}>
      <v.Icon className={cn("mt-0.5 size-6 shrink-0", v.icon)} aria-hidden="true" />
      <div>
        <p className={cn("font-display font-semibold", v.icon)}>{block.title ?? v.label}</p>
        <Markdown md={block.md} className="mt-1 text-fg/90" />
      </div>
    </aside>
  );
}
