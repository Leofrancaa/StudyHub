import type { HeadingBlock as HeadingBlockData } from "@/lib/content/schema";

export function HeadingBlock({ block, isFirst }: { block: HeadingBlockData; isFirst: boolean }) {
  // O primeiro heading do slide é o título principal (h2; o h1 é o título do módulo).
  const Tag = isFirst && block.level === 1 ? "h2" : "h3";
  return (
    <div>
      {block.eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">{block.eyebrow}</p>}
      <Tag
        className={
          Tag === "h2"
            ? "mt-2 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            : "mt-1 font-display text-2xl font-bold leading-tight tracking-tight"
        }
      >
        {block.text}
      </Tag>
    </div>
  );
}
