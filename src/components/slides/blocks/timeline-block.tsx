import { motion } from "motion/react";
import type { TimelineBlock as TimelineBlockData } from "@/lib/content/schema";
import { staggerItem } from "../motion";

export function TimelineBlock({ block }: { block: TimelineBlockData }) {
  return (
    <ol className="relative space-y-4 border-l-2 border-line pl-6">
      {block.items.map((item) => (
        <motion.li key={`${item.date}-${item.title}`} variants={staggerItem} className="relative">
          <span className="gradient-accent absolute -left-[calc(1.5rem+7px)] top-1.5 size-3 rounded-full ring-4 ring-[var(--bg)]" aria-hidden="true" />
          <p className="font-mono text-sm font-semibold text-accent-text">{item.date}</p>
          <p className="font-display text-lg font-semibold">{item.title}</p>
          <p className="text-muted">{item.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
