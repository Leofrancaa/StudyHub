/**
 * Realce de sintaxe mínimo, sem dependências: comentários, strings, números,
 * palavras-chave e chamadas de função. Suficiente para trechos didáticos curtos.
 */
export type TokenKind = "plain" | "comment" | "string" | "number" | "keyword" | "function" | "builtin";
export type Token = { kind: TokenKind; text: string };

const KEYWORDS: Record<string, readonly string[]> = {
  python: ["def", "return", "if", "elif", "else", "for", "while", "in", "import", "from", "as", "class", "with", "try", "except", "lambda", "and", "or", "not", "is", "None", "True", "False", "pass", "yield", "raise"],
  sql: ["select", "from", "where", "group", "by", "order", "join", "left", "right", "inner", "on", "as", "and", "or", "insert", "into", "values", "create", "table", "having", "limit", "count", "sum", "avg"],
  bash: ["if", "then", "else", "fi", "for", "do", "done", "export", "echo", "cd"],
  text: [],
};

const BUILTINS = ["print", "len", "range", "abs", "sum", "min", "max", "round", "list", "dict", "int", "float", "str"];

const COMMENT: Record<string, RegExp> = {
  python: /#.*/y,
  bash: /#.*/y,
  sql: /--.*/y,
  text: /(?!)/y,
};

export function tokenize(code: string, language: string): Token[] {
  const keywords = new Set((KEYWORDS[language] ?? []).map((k) => k.toLowerCase()));
  const caseInsensitive = language === "sql";
  const comment = COMMENT[language] ?? COMMENT.text!;
  const tokens: Token[] = [];
  const push = (kind: TokenKind, text: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind && kind === "plain") last.text += text;
    else tokens.push({ kind, text });
  };

  let i = 0;
  while (i < code.length) {
    comment.lastIndex = i;
    const c = comment.exec(code);
    if (c && language !== "text") {
      push("comment", c[0]);
      i += c[0].length;
      continue;
    }
    const ch = code[i]!;
    if (language !== "text" && (ch === '"' || ch === "'")) {
      let j = i + 1;
      while (j < code.length && code[j] !== ch && code[j] !== "\n") j += code[j] === "\\" ? 2 : 1;
      push("string", code.slice(i, j + 1));
      i = j + 1;
      continue;
    }
    const num = /\d+(?:\.\d+)?/y;
    num.lastIndex = i;
    const n = num.exec(code);
    if (n && language !== "text" && !/[A-Za-z_]/.test(code[i - 1] ?? "")) {
      push("number", n[0]);
      i += n[0].length;
      continue;
    }
    const word = /[A-Za-z_][A-Za-z0-9_]*/y;
    word.lastIndex = i;
    const w = word.exec(code);
    if (w) {
      const text = w[0];
      const key = caseInsensitive ? text.toLowerCase() : text;
      const after = code.slice(i + text.length).trimStart();
      if (keywords.has(key)) push("keyword", text);
      else if (language !== "text" && BUILTINS.includes(text)) push("builtin", text);
      else if (language !== "text" && after.startsWith("(")) push("function", text);
      else push("plain", text);
      i += text.length;
      continue;
    }
    push("plain", ch);
    i += 1;
  }
  return tokens;
}
