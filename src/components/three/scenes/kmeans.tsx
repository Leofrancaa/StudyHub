"use client";

import { Line } from "@react-three/drei";
import { useMemo, useState } from "react";
import { dist, gaussianCloud } from "../math";
import { SCENE_COLORS, SceneButton, SceneButtons, SceneShell, SceneSlider, useSceneTheme } from "../scene-shell";

type P = [number, number, number];
const flat = (pts: [number, number, number][]): P[] => pts.map(([x, , z]) => [x, 0.12, z]);
const POINTS: P[] = [
  ...flat(gaussianCloud(3, 18, [-2, 0, -1.2], 0.55)),
  ...flat(gaussianCloud(7, 18, [1.8, 0, -1.5], 0.55)),
  ...flat(gaussianCloud(13, 18, [0.2, 0, 1.8], 0.55)),
  ...flat(gaussianCloud(17, 10, [2.4, 0, 1.6], 0.45)),
];
const PALETTE = [SCENE_COLORS.violet, SCENE_COLORS.cyan, SCENE_COLORS.amber, SCENE_COLORS.green, SCENE_COLORS.rose];

/** Centróides iniciais "ruins" de propósito (pontos próximos), para o algoritmo ter trabalho. */
const initCentroids = (k: number): P[] => Array.from({ length: k }, (_, i) => POINTS[i * 3] ?? [0, 0.12, 0]);

export default function KMeansScene() {
  const theme = useSceneTheme();
  const [k, setK] = useState(3);
  const [centroids, setCentroids] = useState<P[]>(() => initCentroids(3));
  const [assign, setAssign] = useState<number[] | null>(null);
  const [iter, setIter] = useState(0);

  const inertia = useMemo(
    () => (assign ? POINTS.reduce((s, p, i) => s + dist(p, centroids[assign[i] ?? 0] ?? p) ** 2, 0) : null),
    [assign, centroids],
  );

  const doAssign = () =>
    setAssign(POINTS.map((p) => centroids.reduce((best, c, ci) => (dist(p, c) < dist(p, centroids[best] ?? c) ? ci : best), 0)));

  const doUpdate = () => {
    if (!assign) return;
    setCentroids(
      centroids.map((c, ci) => {
        const members = POINTS.filter((_, i) => assign[i] === ci);
        if (members.length === 0) return c;
        return [members.reduce((s, m) => s + m[0], 0) / members.length, 0.12, members.reduce((s, m) => s + m[2], 0) / members.length];
      }),
    );
    setIter((n) => n + 1);
  };

  const reset = (newK = k) => {
    setK(newK);
    setCentroids(initCentroids(newK));
    setAssign(null);
    setIter(0);
  };

  return (
    <SceneShell
      label="Pontos num plano agrupados pelo algoritmo k-means, com centróides que se movem a cada iteração"
      camera={[0, 8, 6]}
      status={
        <>
          Iteração {iter} · {assign ? <>soma das distâncias² (inércia): <strong>{inertia?.toFixed(2)}</strong></> : "pontos ainda sem grupo"}. Alterne
          “Atribuir” e “Mover centróides” até nada mudar.
        </>
      }
      controls={
        <>
          <SceneSlider label="Número de grupos k" value={k} min={2} max={5} step={1} onChange={(v) => reset(v)} />
          <SceneButtons>
            <SceneButton onClick={doAssign}>1. Atribuir ao centróide mais próximo</SceneButton>
            <SceneButton onClick={doUpdate} disabled={!assign}>
              2. Mover centróides para a média
            </SceneButton>
            <SceneButton onClick={() => reset()}>Reiniciar</SceneButton>
          </SceneButtons>
        </>
      }
    >
      <gridHelper args={[8, 8, theme.grid, theme.grid]} />
      {POINTS.map((p, i) => {
        const g = assign?.[i];
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color={g === undefined ? SCENE_COLORS.slate : PALETTE[g]} />
          </mesh>
        );
      })}
      {assign &&
        POINTS.map((p, i) => {
          const c = centroids[assign[i] ?? 0];
          return c ? <Line key={`l${i}`} points={[p, c]} color={PALETTE[assign[i] ?? 0]} lineWidth={1} transparent opacity={0.3} /> : null;
        })}
      {centroids.map((c, ci) => (
        <mesh key={`c${ci}`} position={[c[0], 0.35, c[2]]}>
          <coneGeometry args={[0.22, 0.5, 4]} />
          <meshStandardMaterial color={PALETTE[ci]} emissive={PALETTE[ci]} emissiveIntensity={0.35} />
        </mesh>
      ))}
    </SceneShell>
  );
}
