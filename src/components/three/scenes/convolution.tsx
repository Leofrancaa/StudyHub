"use client";

import { useState } from "react";
import { SCENE_COLORS, SceneButton, SceneButtons, SceneShell, SceneSlider, useSceneTheme } from "../scene-shell";

const IMAGE = [
  [3, 1, 0, 2, 5, 4],
  [2, 8, 7, 1, 3, 0],
  [1, 9, 8, 2, 0, 1],
  [0, 7, 9, 1, 2, 3],
  [4, 2, 1, 0, 6, 5],
  [3, 0, 2, 4, 7, 8],
];

const KERNELS = {
  "Borda vertical": [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ],
  "Aula 14": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
  ],
  Identidade: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
} as const;
type KernelName = keyof typeof KERNELS;

const N = 6;
const K = 3;
const OUT = N - K + 1; // stride 1, sem padding

function convAt(kernel: readonly (readonly number[])[], r: number, c: number) {
  let sum = 0;
  const terms: string[] = [];
  for (let i = 0; i < K; i++)
    for (let j = 0; j < K; j++) {
      const k = kernel[i]?.[j] ?? 0;
      const v = IMAGE[r + i]?.[c + j] ?? 0;
      sum += k * v;
      if (k !== 0) terms.push(`${k}×${v}`);
    }
  return { sum, terms };
}

export default function ConvolutionScene() {
  const theme = useSceneTheme();
  const [kernelName, setKernelName] = useState<KernelName>("Borda vertical");
  const [pos, setPos] = useState(0);
  const kernel = KERNELS[kernelName];
  const r0 = Math.floor(pos / OUT);
  const c0 = pos % OUT;
  const { sum, terms } = convAt(kernel, r0, c0);

  return (
    <SceneShell
      label="Imagem 6 por 6 em colunas 3D com um filtro 3 por 3 deslizando e o mapa de ativação sendo preenchido"
      camera={[1, 9, 9]}
      status={
        <>
          Janela na linha {r0 + 1}, coluna {c0 + 1}: {terms.join(" + ") || "0"} = <strong>{sum}</strong>. Saída {OUT}×{OUT} = (6 − 3)/1 + 1.
        </>
      }
      controls={
        <>
          <SceneSlider label="Posição do filtro" value={pos} min={0} max={OUT * OUT - 1} step={1} onChange={setPos} format={(v) => `${v + 1}/${OUT * OUT}`} />
          <SceneButtons>
            {(Object.keys(KERNELS) as KernelName[]).map((name) => (
              <SceneButton key={name} active={name === kernelName} onClick={() => setKernelName(name)}>
                {name}
              </SceneButton>
            ))}
          </SceneButtons>
        </>
      }
    >
      {/* Imagem de entrada: altura ∝ intensidade do pixel */}
      <group position={[-4.2, 0, -2.5]}>
        {IMAGE.map((row, r) =>
          row.map((v, c) => {
            const inWindow = r >= r0 && r < r0 + K && c >= c0 && c < c0 + K;
            const h = 0.15 + v * 0.12;
            return (
              <mesh key={`${r}-${c}`} position={[c, h / 2, r]}>
                <boxGeometry args={[0.9, h, 0.9]} />
                <meshStandardMaterial color={inWindow ? SCENE_COLORS.amber : theme.dark ? "#475569" : "#cbd5e1"} />
              </mesh>
            );
          }),
        )}
      </group>
      {/* Mapa de ativação: preenchido até a posição atual */}
      <group position={[3, 0, -1.5]}>
        {Array.from({ length: OUT * OUT }, (_, i) => {
          const r = Math.floor(i / OUT);
          const c = i % OUT;
          const filled = i <= pos;
          const value = convAt(kernel, r, c).sum;
          const h = filled ? 0.15 + Math.abs(value) * 0.05 : 0.05;
          return (
            <mesh key={i} position={[c, h / 2, r]}>
              <boxGeometry args={[0.9, h, 0.9]} />
              <meshStandardMaterial
                color={!filled ? (theme.dark ? "#1e293b" : "#e2e8f0") : value >= 0 ? SCENE_COLORS.violet : SCENE_COLORS.cyan}
                emissive={i === pos ? SCENE_COLORS.violet : "#000000"}
                emissiveIntensity={i === pos ? 0.5 : 0}
              />
            </mesh>
          );
        })}
      </group>
    </SceneShell>
  );
}
