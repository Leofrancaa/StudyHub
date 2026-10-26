import { Fragment, type ReactNode } from "react";

/**
 * Markdown leve e seguro (sem HTML cru): **negrito**, *itálico*, `código`,
 * listas com "- " e parágrafos separados por linha em branco.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(<Fragment key={`${keyPrefix}-t${i++}`}>{text.slice(last, start)}</Fragment>);
    const token = match[0];
    const key = `${keyPrefix}-m${i++}`;
    if (token.startsWith("**")) nodes.push(<strong key={key} className="font-semibold text-fg">{token.slice(2, -2)}</strong>);
    else if (token.startsWith("`"))
      nodes.push(
        <code key={key} className="rounded-md bg-sunken px-1.5 py-0.5 font-mono text-[0.9em] text-accent-text">
          {token.slice(1, -1)}
        </code>,
      );
    else nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    last = start + token.length;
  }
  if (last < text.length) nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(last)}</Fragment>);
  return nodes;
}

export function Markdown({ md, className }: { md: string; className?: string }) {
  const blocks = md.trim().split(/\n\s*\n/);
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={bi} className="my-3 list-disc space-y-1.5 pl-5 marker:text-accent-text">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.trim().slice(2), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} className="my-3 first:mt-0 last:mb-0">
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
