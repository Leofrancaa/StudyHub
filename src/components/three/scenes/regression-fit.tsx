"use client";

import { Line } from "@react-three/drei";
import { useState } from "react";
import { SCENE_COLORS, SceneButton, SceneButtons, SceneShell, SceneSlider, useSceneTheme } from "../scene-shell";

/** Fertilizante (g) × crescimento (cm), com ruído leve. */
const DATA: [number, number][] = [
  [0, 5.5],
  [5, 6.8],
  [10, 9.4],
  [15, 10.6],
  [20, 13.3],
  [25, 14.6],
  [30, 17.2],
];

// Escala para a cena: x ∈ [-3, 3], y ∈ [0, ~6].
const sx = (g: number) => g / 5 - 3;
const sy = (cm: number) => cm / 3;

function ols(data: [number, number][]) {
  const n = data.length;
  const mx = data.reduce((s, [x]) => s + x, 0) / n;
  const my = data.reduce((s, [, y]) => s + y, 0) / n;
  const num = data.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0);
  const den = data.reduce((s, [x]) => s + (x - mx) ** 2, 0);
  const w = num / den;
  return { w, b: my - w * mx };
}

export default function RegressionFitScene() {
  const theme = useSceneTheme();
  const [w, setW] = useState(0.2);
  const [b, setB] = useState(8);
  const predict = (g: number) => w * g + b;
  const mse = DATA.reduce((s, [x, y]) => s + (y - predict(x)) ** 2, 0) / DATA.length;
  const best = ols(DATA);

  return (
    <SceneShell
      label="Gráfico 3D de pontos de fertilizante e crescimento com uma reta ajustável e os erros de cada ponto"
      camera={[0, 3, 9]}
      status={
        <>
          Reta: crescimento = <strong>{w.toFixed(2)}</strong> · g + <strong>{b.toFixed(1)}</strong> · erro quadrático médio (MSE):{" "}
          <strong className={mse < 0.5 ? "text-success" : undefined}>{mse.toFixed(2)}</strong>
          {mse < 0.5 && " · ótimo ajuste!"}
        </>
      }
      controls={
        <>
          <SceneSlider label="Inclinação w" value={w} min={0} max={1} step={0.01} onChange={setW} format={(v) => v.toFixed(2)} />
          <SceneSlider label="Intercepto b" value={b} min={0} max={12} step={0.1} onChange={setB} format={(v) => v.toFixed(1)} />
          <SceneButtons>
            <SceneButton
              onClick={() => {
                setW(Number(best.w.toFixed(2)));
                setB(Number(best.b.toFixed(1)));
              }}
            >
              Mostrar o ajuste do treino (MQO)
            </SceneButton>
            <SceneButton
              onClick={() => {
                setW(0.2);
                setB(8);
              }}
            >
              Reiniciar
            </SceneButton>
          </SceneButtons>
        </>
      }
    >
      <gridHelper args={[8, 8, theme.grid, theme.grid]} position={[0, 0, 0]} />
      {/* Eixos */}
      <Line points={[[-3.5, 0, 0], [3.5, 0, 0]]} color={theme.muted} lineWidth={1.5} />
      <Line points={[[-3, 0, 0], [-3, 6.5, 0]]} color={theme.muted} lineWidth={1.5} />
      {/* Reta do modelo */}
      <Line points={[[sx(-2), sy(predict(-2)), 0], [sx(32), sy(predict(32)), 0]]} color={SCENE_COLORS.violet} lineWidth={4} />
      {DATA.map(([x, y]) => (
        <group key={x}>
          <mesh position={[sx(x), sy(y), 0]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color={SCENE_COLORS.cyan} />
          </mesh>
          {/* Resíduo: distância vertical até a reta */}
          <Line points={[[sx(x), sy(y), 0], [sx(x), sy(predict(x)), 0]]} color={SCENE_COLORS.amber} lineWidth={2} dashed dashSize={0.08} gapSize={0.05} />
        </group>
      ))}
    </SceneShell>
  );
}
