"use client";

import { Reorder, useDragControls } from "motion/react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { useState } from "react";
import type { PreparedQuestion, QuestionResponse } from "@/lib/quiz/engine";
import { cn } from "@/lib/cn";

type OQ = Extract<PreparedQuestion, { type: "ordering" }>;
type OR = Extract<QuestionResponse, { type: "ordering" }>;

function Item({
  id,
  text,
  position,
  total,
  locked,
  correctId,
  onMove,
}: {
  id: string;
  text: string;
  position: number;
  total: number;
  locked: boolean;
  correctId: string | undefined;
  onMove: (from: number, to: number) => void;
}) {
  const controls = useDragControls();
  const ok = correctId === id;
  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "flex items-center gap-2 rounded-2xl border-2 bg-elev p-2 pl-1",
        !locked && "border-line",
        locked && ok && "border-success bg-success-soft",
        locked && !ok && "border-danger bg-danger-soft",
      )}
    >
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        disabled={locked}
        onPointerDown={(e) => !locked && controls.start(e)}
        className="grid size-9 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-muted active:cursor-grabbing disabled:cursor-default"
      >
        <GripVertical className="size-5" />
      </button>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sunken text-sm font-bold">{position + 1}</span>
      <span className="flex-1 font-medium">{text}</span>
      {!locked && (
        <span className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onMove(position, position - 1)}
            disabled={position === 0}
            aria-label={`Mover "${text}" para cima`}
            className="grid size-9 place-items-center rounded-xl text-muted hover:bg-accent-soft hover:text-fg disabled:opacity-30"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(position, position + 1)}
            disabled={position === total - 1}
            aria-label={`Mover "${text}" para baixo`}
            className="grid size-9 place-items-center rounded-xl text-muted hover:bg-accent-soft hover:text-fg disabled:opacity-30"
          >
            <ArrowDown className="size-4" aria-hidden="true" />
          </button>
        </span>
      )}
    </Reorder.Item>
  );
}

/** Ordenação com arrastar (mouse/toque) e botões ↑ ↓ acessíveis por teclado. */
export function OrderingQuestion({
  question,
  response,
  onChange,
  locked,
}: {
  question: OQ;
  response: OR | undefined;
  onChange: (r: OR) => void;
  locked: boolean;
}) {
  const order = response?.itemIds ?? question.order;
  const textById = new Map(question.items.map((i) => [i.id, i.text]));
  const [announcement, setAnnouncement] = useState("");

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = order.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    onChange({ type: "ordering", itemIds: next });
    setAnnouncement(`"${textById.get(item!)}" agora está na posição ${to + 1} de ${order.length}.`);
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Arraste pela alça ou use as setas.</p>
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={(ids: string[]) => !locked && onChange({ type: "ordering", itemIds: ids })}
        className="space-y-2"
      >
        {order.map((id, i) => (
          <Item
            key={id}
            id={id}
            text={textById.get(id) ?? id}
            position={i}
            total={order.length}
            locked={locked}
            correctId={question.items[i]?.id}
            onMove={move}
          />
        ))}
      </Reorder.Group>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {locked && order.some((id, i) => question.items[i]?.id !== id) && (
        <div className="mt-4 rounded-2xl bg-success-soft p-4 text-sm">
          <p className="font-semibold text-success">Ordem correta</p>
          <ol className="mt-1 list-decimal pl-5">
            {question.items.map((i) => (
              <li key={i.id}>{i.text}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
