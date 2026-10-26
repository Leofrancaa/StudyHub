import { seededRng } from "@/lib/quiz/random";

/** Amostras normais determinísticas (Box–Muller) para as cenas ficarem iguais a cada visita. */
export function gaussianCloud(seed: number, n: number, center: [number, number, number], spread: number): [number, number, number][] {
  const rng = seededRng(seed);
  const normal = () => {
    const u = Math.max(rng(), 1e-9);
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  return Array.from({ length: n }, () => [center[0] + normal() * spread, center[1] + normal() * spread, center[2] + normal() * spread]);
}

export function dist(a: readonly number[], b: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += ((a[i] ?? 0) - (b[i] ?? 0)) ** 2;
  return Math.sqrt(s);
}
