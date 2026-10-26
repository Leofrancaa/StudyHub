"use client";

import { useState } from "react";
import { SCENE_COLORS, SceneButton, SceneButtons, SceneShell, useSceneTheme } from "../scene-shell";

const PRODUCTS = ["Carro", "Moto", "Ônibus"] as const;
const REGIONS = ["Nordeste", "Sudeste", "Sul"] as const;
const YEARS = ["2024", "2025", "2026"] as const;

/** Vendas (mil unidades) por [produto][região][ano]. */
const SALES = PRODUCTS.map((_, p) => REGIONS.map((_, r) => YEARS.map((_, y) => 10 + ((p * 7 + r * 5 + y * 3) % 9) + y * 2 - p * 3)));

type Mode = "cube" | "slice" | "dice" | "rollup";

const MODES: { id: Mode; label: string }[] = [
  { id: "cube", label: "Cubo completo" },
  { id: "slice", label: "Slice: ano = 2026" },
  { id: "dice", label: "Dice: NE+SE · Carro+Moto · 2025–26" },
  { id: "rollup", label: "Roll-up: total por região" },
];

function selected(mode: Mode, p: number, r: number, y: number) {
  if (mode === "slice") return y === 2;
  if (mode === "dice") return r <= 1 && p <= 1 && y >= 1;
  return true;
}

export default function OlapCubeScene() {
  const theme = useSceneTheme();
  const [mode, setMode] = useState<Mode>("cube");

  const sumWhere = (pred: (p: number, r: number, y: number) => boolean) => {
    let s = 0;
    SALES.forEach((rs, p) => rs.forEach((ys, r) => ys.forEach((v, y) => pred(p, r, y) && (s += v))));
    return s;
  };

  const status =
    mode === "cube"
      ? `27 células = 3 produtos × 3 regiões × 3 anos. Total: ${sumWhere(() => true)} mil vendas.`
      : mode === "slice"
        ? `Fatiar fixa UMA dimensão (ano = 2026) e sobra um plano 3×3. Total do recorte: ${sumWhere((_p, _r, y) => y === 2)} mil.`
        : mode === "dice"
          ? `Dice filtra várias dimensões ao mesmo tempo e sobra um sub-cubo 2×2×2. Total: ${sumWhere((p, r, y) => r <= 1 && p <= 1 && y >= 1)} mil.`
          : `Roll-up agrega produtos e anos: ${REGIONS.map((reg, r) => `${reg} ${sumWhere((_p, rr) => rr === r)}`).join(" · ")} (mil). Drill-down é o caminho inverso.`;

  return (
    <SceneShell
      label="Cubo OLAP 3 por 3 por 3 com produto, região e ano, destacando operações de slice, dice e roll-up"
      camera={[6, 5, 7]}
      status={status}
      controls={
        <SceneButtons>
          {MODES.map((m) => (
            <SceneButton key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
              {m.label}
            </SceneButton>
          ))}
          <p className="w-full text-xs text-muted">
            Eixo x: produto ({PRODUCTS.join(", ")}) · eixo y: região ({REGIONS.join(", ")}) · eixo z: ano ({YEARS.join(", ")})
          </p>
        </SceneButtons>
      }
    >
      <group position={[-1.1, 0.2, -1.1]}>
        {mode === "rollup"
          ? REGIONS.map((_, r) => (
              <mesh key={r} position={[1.1, r * 1.1 + 0.5, 1.1]}>
                <boxGeometry args={[3.2, 1, 3.2]} />
                <meshStandardMaterial color={[SCENE_COLORS.violet, SCENE_COLORS.cyan, SCENE_COLORS.amber][r]} transparent opacity={0.85} />
              </mesh>
            ))
          : PRODUCTS.map((_, p) =>
              REGIONS.map((_, r) =>
                YEARS.map((_, y) => {
                  const on = selected(mode, p, r, y);
                  return (
                    <mesh key={`${p}${r}${y}`} position={[p * 1.1, r * 1.1 + 0.5, y * 1.1]}>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial color={on ? SCENE_COLORS.violet : theme.dark ? "#334155" : "#cbd5e1"} transparent opacity={on ? 0.9 : 0.18} />
                    </mesh>
                  );
                }),
              ),
            )}
      </group>
      <gridHelper args={[8, 8, theme.grid, theme.grid]} position={[0, -0.05, 0]} />
    </SceneShell>
  );
}
