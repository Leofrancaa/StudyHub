"use client";

/** Confetti carregado sob demanda; não dispara se o usuário pediu menos movimento. */
export async function celebrate(kind: "tiny" | "small" | "big" = "small"): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#7c3aed", "#0e7490", "#f59e0b", "#22c55e", "#ec4899"];
  if (kind === "tiny") {
    void confetti({ particleCount: 24, spread: 50, startVelocity: 25, scalar: 0.8, origin: { y: 0.75 }, colors, disableForReducedMotion: true });
    return;
  }
  if (kind === "small") {
    void confetti({ particleCount: 60, spread: 70, startVelocity: 35, origin: { y: 0.7 }, colors, disableForReducedMotion: true });
    return;
  }
  const end = Date.now() + 900;
  const frame = () => {
    void confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, disableForReducedMotion: true });
    void confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
