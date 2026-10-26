"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Paleta fixa das cenas (boa leitura nos dois temas). */
export const SCENE_COLORS = {
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  rose: "#f43f5e",
  green: "#22c55e",
  slate: "#94a3b8",
} as const;

export function useSceneTheme() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return { dark, grid: dark ? "#334155" : "#cbd5e1", text: dark ? "#e2e8f0" : "#0f172a", muted: dark ? "#64748b" : "#94a3b8" };
}

/** Observa se o elemento está visível para pausar a renderização fora da tela. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

let webglCache: boolean | undefined;
function detectWebGL(): boolean {
  if (webglCache === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglCache = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}
const noopSubscribe = () => () => {};

/** null no servidor; no cliente, se o navegador suporta WebGL (verificado uma vez). */
function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => null);
}

type SceneShellProps = {
  children: ReactNode;
  /** Controles HTML (sliders, botões) exibidos abaixo do canvas. */
  controls?: ReactNode;
  /** Texto curto que muda com a interação (lido por leitores de tela). */
  status?: ReactNode;
  /** Cena com animação contínua; sem isso só redesenha quando algo muda. */
  animated?: boolean;
  camera?: [number, number, number];
  label: string;
};

export function SceneShell({ children, controls, status, animated = false, camera = [6, 5, 8], label }: SceneShellProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const webgl = useWebGLSupport();
  const reduceMotion = useReducedMotion();
  const frameloop = !inView ? "never" : animated && !reduceMotion ? "always" : "demand";

  return (
    <div className="flex flex-col">
      <div ref={ref} className="relative aspect-[16/10] min-h-64 w-full touch-none" role="img" aria-label={label}>
        {webgl === false && (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted">
            Este navegador não suporta WebGL, então a cena 3D não pode ser exibida. Os controles e a legenda continuam valendo.
          </div>
        )}
        {inView && webgl && (
          <Canvas frameloop={frameloop} dpr={[1, 1.75]} camera={{ position: camera, fov: 45 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 6]} intensity={1.1} />
            <OrbitControls makeDefault enableDamping={!reduceMotion} enablePan={false} minDistance={4} maxDistance={20} />
            {children}
          </Canvas>
        )}
        {webgl && <p className="pointer-events-none absolute bottom-2 right-3 text-[0.7rem] font-medium text-muted">Arraste para girar · role para zoom</p>}
      </div>
      {(controls || status) && (
        <div className="space-y-3 border-t border-line p-4">
          {status && (
            <p className="text-sm font-medium" aria-live="polite">
              {status}
            </p>
          )}
          {controls && <div className="grid gap-4 sm:grid-cols-2">{controls}</div>}
        </div>
      )}
    </div>
  );
}

export function SceneSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => String(v),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const id = `slider-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <span className="font-mono tabular-nums text-accent-text">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-auto accent-[var(--accent)]"
      />
    </div>
  );
}

export function SceneButtons({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-2 sm:col-span-2", className)}>{children}</div>;
}

export function SceneButton({ children, onClick, active, disabled }: { children: ReactNode; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "h-9 rounded-xl px-3 text-sm font-semibold transition-colors disabled:opacity-40",
        active ? "gradient-accent text-on-accent" : "border border-line bg-elev hover:border-line-strong",
      )}
    >
      {children}
    </button>
  );
}
