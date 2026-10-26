export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="gradient-accent grid size-9 place-items-center rounded-xl font-display text-lg font-bold text-on-accent shadow-soft" aria-hidden="true">
        S
      </span>
      {!compact && <span className="font-display text-lg font-bold tracking-tight">StudyHub</span>}
    </span>
  );
}
