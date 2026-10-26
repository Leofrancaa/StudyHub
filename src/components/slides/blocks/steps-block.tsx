"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { StepsBlock as StepsBlockData } from "@/lib/content/schema";
import { Button } from "@/components/ui/button";

/** Passo a passo revelado progressivamente pelo aluno. */
export function StepsBlock({ block }: { block: StepsBlockData }) {
  const [shown, setShown] = useState(1);
  const done = shown >= block.steps.length;
  return (
    <div>
      <ol className="space-y-3" aria-live="polite">
        <AnimatePresence initial={false}>
          {block.steps.slice(0, shown).map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass flex gap-4 rounded-3xl p-4 sm:p-5"
            >
              <span className="gradient-accent grid size-9 shrink-0 place-items-center rounded-full font-display font-bold text-on-accent">
                {i + 1}
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{step.title}</p>
                <p className="text-muted">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      {!done && (
        <Button variant="secondary" className="mt-4" onClick={() => setShown((n) => n + 1)}>
          <ChevronDown className="size-4" aria-hidden="true" /> Próximo passo ({shown}/{block.steps.length})
        </Button>
      )}
    </div>
  );
}
