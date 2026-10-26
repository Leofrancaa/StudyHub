import { cn } from "@/lib/cn";

export type OptionState = "idle" | "selected" | "correct" | "wrong" | "missed" | "dim";

/** Visual de uma alternativa conforme o estado (antes e depois de confirmar). */
export function optionClass(state: OptionState) {
  return cn(
    "flex w-full cursor-pointer items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-medium transition-[border-color,background-color,transform] duration-150",
    "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--ring)]",
    state === "idle" && "border-line bg-elev hover:-translate-y-0.5 hover:border-line-strong",
    state === "selected" && "border-[var(--accent)] bg-accent-soft",
    state === "correct" && "cursor-default border-success bg-success-soft",
    state === "wrong" && "cursor-default border-danger bg-danger-soft",
    state === "missed" && "cursor-default border-dashed border-success",
    state === "dim" && "cursor-default border-line bg-elev opacity-55",
  );
}

export function markerClass(state: OptionState, shape: "circle" | "square") {
  return cn(
    "mt-0.5 grid size-5 shrink-0 place-items-center border-2 text-[0.65rem] font-bold",
    shape === "circle" ? "rounded-full" : "rounded-md",
    state === "selected" && "border-[var(--accent)] bg-[var(--accent)] text-on-accent",
    state === "correct" && "border-success bg-success text-white",
    state === "wrong" && "border-danger bg-danger text-white",
    (state === "idle" || state === "dim" || state === "missed") && "border-line-strong",
  );
}
