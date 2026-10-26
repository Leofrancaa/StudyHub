import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  label,
  className,
  size = "md",
}: {
  /** 0–1 */
  value: number;
  label: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn("w-full overflow-hidden rounded-full bg-sunken", size === "sm" ? "h-1.5" : "h-2.5", className)}
    >
      <div className="gradient-accent h-full rounded-full transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}
