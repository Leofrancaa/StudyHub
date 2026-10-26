"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, Clock, Lock, Play, Sparkles, Star } from "lucide-react";
import type { CourseSummary } from "@/lib/content/summary";
import { useHydratedProgress } from "@/lib/progress/hooks";
import { getModuleProgress } from "@/lib/progress/types";
import { moduleStatus, type ModuleStatus } from "@/lib/progress/unlock";
import { cn } from "@/lib/cn";

const STATUS_LABEL: Record<ModuleStatus | "upcoming", string> = {
  locked: "Bloqueado",
  available: "Disponível",
  "in-progress": "Em andamento",
  completed: "Concluído",
  upcoming: "Em breve",
};

type Node = {
  key: string;
  index: number;
  title: string;
  description: string;
  minutes?: number;
  href?: string;
  status: ModuleStatus | "upcoming";
  best?: number;
};

export function CourseTrail({ course }: { course: CourseSummary }) {
  const { hydrated, progress } = useHydratedProgress();
  const slugs = course.modules.map((m) => m.slug);

  const nodes: Node[] = [
    ...course.modules.map((m, i) => {
      const status = hydrated ? moduleStatus(progress, course.slug, slugs, i) : i === 0 ? "available" : "locked";
      const p = getModuleProgress(progress, course.slug, m.slug);
      return {
        key: m.slug,
        index: i,
        title: m.title,
        description: m.description,
        minutes: m.estimatedMinutes,
        href: status === "locked" ? undefined : `/courses/${course.slug}/${m.slug}`,
        status,
        best: p.attempts > 0 ? p.bestScore : undefined,
      } satisfies Node;
    }),
    ...course.upcoming.map(
      (u, j) =>
        ({
          key: `upcoming-${j}`,
          index: course.modules.length + j,
          title: u.title,
          description: u.description,
          status: "upcoming",
        }) satisfies Node,
    ),
  ];

  return (
    <ol className="relative mx-auto max-w-3xl" aria-busy={!hydrated}>
      {/* Linha da trilha */}
      <div aria-hidden="true" className="absolute bottom-8 left-8 top-8 w-1 rounded-full bg-sunken sm:left-1/2 sm:-translate-x-1/2" />
      {nodes.map((node, i) => {
        const side = i % 2 === 0 ? "sm:pr-[calc(50%+2.5rem)]" : "sm:pl-[calc(50%+2.5rem)]";
        const active = node.status === "available" || node.status === "in-progress";
        const Icon =
          node.status === "completed" ? Check : node.status === "locked" || node.status === "upcoming" ? Lock : active ? Play : Sparkles;
        const card = (
          <div
            className={cn(
              "glass rounded-3xl p-5 transition-[transform,box-shadow]",
              node.href && "hover:-translate-y-0.5 hover:shadow-lift",
              (node.status === "locked" || node.status === "upcoming") && "opacity-70",
              active && "ring-2 ring-[var(--accent)]",
            )}
          >
            <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="text-accent-text">Módulo {node.index + 1}</span>
              <span className={cn(node.status === "completed" ? "text-success" : "text-muted")}>{STATUS_LABEL[node.status]}</span>
            </div>
            <h3 className="mt-1.5 font-display text-lg font-bold leading-snug">{node.title}</h3>
            <p className="mt-1 text-sm text-muted">{node.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              {node.minutes && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden="true" /> {node.minutes} min
                </span>
              )}
              {node.best !== undefined && (
                <span className="inline-flex items-center gap-1 font-semibold text-fg">
                  <Star className="size-3.5 fill-current text-[#f59e0b]" aria-hidden="true" /> Melhor nota: {Math.round(node.best * 100)}%
                </span>
              )}
            </div>
          </div>
        );

        return (
          <motion.li
            key={node.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
            className={cn("relative pb-6 pl-20 sm:pl-0", side)}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-8 top-6 z-10 grid size-12 -translate-x-1/2 place-items-center rounded-full border-4 border-[var(--bg)] sm:left-1/2",
                node.status === "completed" && "bg-success text-white",
                active && "gradient-accent text-on-accent shadow-lift",
                (node.status === "locked" || node.status === "upcoming") && "bg-sunken text-muted",
              )}
            >
              <Icon className={cn("size-5", active && "fill-current")} />
            </span>
            {node.href ? (
              <Link href={node.href} className="block rounded-3xl" aria-label={`Módulo ${node.index + 1}: ${node.title} (${STATUS_LABEL[node.status]})`}>
                {card}
              </Link>
            ) : (
              <div aria-label={`Módulo ${node.index + 1}: ${node.title} (${STATUS_LABEL[node.status]})`} role="group">
                {card}
              </div>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}
