"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { FlipCardsBlock as FlipCardsBlockData } from "@/lib/content/schema";
import { cn } from "@/lib/cn";
import { staggerItem } from "../motion";

function FlipCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.li variants={staggerItem} className="[perspective:1000px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? `${front}: ${back}. Clique para voltar` : `${front}. Clique para virar`}
        className="relative block h-40 w-full rounded-3xl text-left"
      >
        <motion.span
          className="absolute inset-0 block [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="glass absolute inset-0 flex flex-col justify-between rounded-3xl p-5 [backface-visibility:hidden]">
            <span className="font-display text-xl font-bold">{front}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-text">
              <RotateCcw className="size-3.5" aria-hidden="true" /> Toque para virar
            </span>
          </span>
          <span
            className={cn(
              "gradient-accent absolute inset-0 flex items-center rounded-3xl p-5 font-medium text-on-accent [backface-visibility:hidden] [transform:rotateY(180deg)]",
            )}
          >
            {back}
          </span>
        </motion.span>
      </button>
    </motion.li>
  );
}

export function FlipCardsBlock({ block }: { block: FlipCardsBlockData }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {block.cards.map((c) => (
        <FlipCard key={c.front} front={c.front} back={c.back} />
      ))}
    </ul>
  );
}
