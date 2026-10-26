/** Datas como chave "YYYY-MM-DD" no fuso local do usuário. */
export type DayKey = string;

export function toDayKey(date: Date): DayKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDayKey(key: DayKey): number {
  const [y, m, d] = key.split("-").map(Number);
  // UTC evita que horário de verão desloque a diferença em dias.
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** Dias inteiros entre duas chaves (b − a). */
export function daysBetween(a: DayKey, b: DayKey): number {
  return Math.round((parseDayKey(b) - parseDayKey(a)) / 86_400_000);
}

export function addDays(key: DayKey, days: number): DayKey {
  const t = new Date(parseDayKey(key) + days * 86_400_000);
  const y = t.getUTCFullYear();
  const m = String(t.getUTCMonth() + 1).padStart(2, "0");
  const d = String(t.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
