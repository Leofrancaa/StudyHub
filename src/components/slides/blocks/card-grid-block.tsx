import { motion } from "motion/react";
import type { CardGridBlock as CardGridBlockData } from "@/lib/content/schema";
import { ContentIcon } from "@/components/ui/content-icon";
import { cn } from "@/lib/cn";
import { staggerItem } from "../motion";

const COLS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" } as const;

export function CardGridBlock({ block }: { block: CardGridBlockData }) {
  const cols = COLS[block.columns ?? (block.cards.length >= 4 ? 2 : 3) as 2 | 3 | 4];
  return (
    <ul className={cn("grid gap-4", cols)}>
      {block.cards.map((card) => (
        <motion.li key={card.title} variants={staggerItem} className="glass rounded-3xl p-5">
          <span className="gradient-accent grid size-11 place-items-center rounded-2xl text-on-accent shadow-soft">
            <ContentIcon name={card.icon} className="size-5.5" />
          </span>
          <p className="mt-4 font-display text-lg font-semibold">{card.title}</p>
          <p className="mt-1 text-muted">{card.description}</p>
        </motion.li>
      ))}
    </ul>
  );
}
