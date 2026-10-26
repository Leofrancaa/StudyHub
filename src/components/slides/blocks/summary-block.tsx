import { motion } from "motion/react";
import { CircleCheck } from "lucide-react";
import type { SummaryBlock as SummaryBlockData } from "@/lib/content/schema";
import { staggerItem } from "../motion";

export function SummaryBlock({ block }: { block: SummaryBlockData }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Recap</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{block.title ?? "Resumo"}</h2>
      <ul className="mt-6 space-y-3">
        {block.points.map((p) => (
          <motion.li key={p} variants={staggerItem} className="glass flex gap-3 rounded-2xl p-4">
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            <span>{p}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
