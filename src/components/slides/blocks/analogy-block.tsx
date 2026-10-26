import { motion } from "motion/react";
import { ArrowLeftRight } from "lucide-react";
import type { AnalogyBlock as AnalogyBlockData } from "@/lib/content/schema";
import { ContentIcon } from "@/components/ui/content-icon";
import { staggerItem } from "../motion";

export function AnalogyBlock({ block }: { block: AnalogyBlockData }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Analogia</p>
      <div className="mt-3 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
        <motion.div variants={staggerItem} className="glass rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">O conceito</p>
          <h3 className="mt-2 font-display text-2xl font-bold">{block.concept.title}</h3>
          <p className="mt-2 text-muted">{block.concept.description}</p>
        </motion.div>
        <div className="grid place-items-center" aria-hidden="true">
          <span className="gradient-accent grid size-12 place-items-center rounded-full text-on-accent shadow-lift">
            {block.icon ? <ContentIcon name={block.icon} className="size-5.5" /> : <ArrowLeftRight className="size-5.5" />}
          </span>
        </div>
        <motion.div variants={staggerItem} className="rounded-3xl border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-accent-soft p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-text">No dia a dia</p>
          <h3 className="mt-2 font-display text-2xl font-bold">{block.analogy.title}</h3>
          <p className="mt-2 text-fg/85">{block.analogy.description}</p>
        </motion.div>
      </div>
    </div>
  );
}
