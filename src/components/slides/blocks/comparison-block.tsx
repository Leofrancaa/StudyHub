import { motion } from "motion/react";
import { Equal } from "lucide-react";
import type { ComparisonBlock as ComparisonBlockData } from "@/lib/content/schema";
import { ContentIcon } from "@/components/ui/content-icon";
import { staggerItem } from "../motion";

type Side = ComparisonBlockData["left"];

function Column({ side, tone }: { side: Side; tone: "a" | "b" }) {
  return (
    <motion.div variants={staggerItem} className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-3">
        {side.icon && (
          <span
            className={
              tone === "a"
                ? "grid size-10 place-items-center rounded-2xl bg-sunken text-fg"
                : "gradient-accent grid size-10 place-items-center rounded-2xl text-on-accent"
            }
          >
            <ContentIcon name={side.icon} className="size-5" />
          </span>
        )}
        <h3 className="font-display text-lg font-semibold">{side.title}</h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {side.points.map((p) => (
          <li key={p} className="flex gap-2.5 text-muted">
            <span className={tone === "a" ? "mt-2 size-1.5 shrink-0 rounded-full bg-muted" : "gradient-accent mt-2 size-1.5 shrink-0 rounded-full"} aria-hidden="true" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function ComparisonBlock({ block }: { block: ComparisonBlockData }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Column side={block.left} tone="a" />
        <Column side={block.right} tone="b" />
      </div>
      {block.verdict && (
        <motion.p variants={staggerItem} className="flex items-start gap-3 rounded-3xl bg-accent-soft p-4 font-medium">
          <Equal className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden="true" />
          {block.verdict}
        </motion.p>
      )}
    </div>
  );
}
