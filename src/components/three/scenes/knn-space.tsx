"use client";

import { Line } from "@react-three/drei";
import { useMemo, useState } from "react";
import { dist, gaussianCloud } from "../math";
import { SCENE_COLORS, SceneShell, SceneSlider, useSceneTheme } from "../scene-shell";

type Pt = { p: [number, number, number]; cls: 0 | 1 };

const POINTS: Pt[] = [
  ...gaussianCloud(11, 22, [-1.3, 1.6, -0.4], 0.75).map((p) => ({ p, cls: 0 as const })),
  ...gaussianCloud(29, 22, [1.3, 1.0, 0.5], 0.75).map((p) => ({ p, cls: 1 as const })),
];
const NAMES = ["roxa", "ciano"] as const;
const COLORS = [SCENE_COLORS.violet, SCENE_COLORS.cyan] as const;

export default function KnnSpaceScene() {
  const theme = useSceneTheme();
  const [x, setX] = useState(0);
  const [y, setY] = useState(1.3);
  const [z, setZ] = useState(0);
  const [k, setK] = useState(5);
  const q: [number, number, number] = [x, y, z];

  const neighbors = useMemo(
    () =>
      POINTS.map((pt) => ({ ...pt, d: dist(pt.p, [x, y, z]) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, k),
    [x, y, z, k],
  );
  const votes = [0, 0];
  for (const n of neighbors) votes[n.cls] = (votes[n.cls] ?? 0) + 1;
  const winner = (votes[1] ?? 0) > (votes[0] ?? 0) ? 1 : 0;

  return (
    <SceneShell
      label="Espaço 3D com pontos de duas classes e um ponto novo ligado aos seus k vizinhos mais próximos"
      camera={[5, 4, 7]}
      status={
        <>
          k = {k}: {votes[0]} {NAMES[0]} × {votes[1]} {NAMES[1]} → o ponto novo é classificado como <strong style={{ color: COLORS[winner] }}>{NAMES[winner]}</strong>
        </>
      }
      controls={
        <>
          <SceneSlider label="Feature 1 (x)" value={x} min={-3} max={3} step={0.1} onChange={setX} format={(v) => v.toFixed(1)} />
          <SceneSlider label="Feature 2 (y)" value={y} min={-0.5} max={3.5} step={0.1} onChange={setY} format={(v) => v.toFixed(1)} />
          <SceneSlider label="Feature 3 (z)" value={z} min={-2.5} max={2.5} step={0.1} onChange={setZ} format={(v) => v.toFixed(1)} />
          <SceneSlider label="Vizinhos k" value={k} min={1} max={15} step={2} onChange={setK} />
        </>
      }
    >
      <gridHelper args={[8, 8, theme.grid, theme.grid]} position={[0, -0.6, 0]} />
      {POINTS.map((pt, i) => (
        <mesh key={i} position={pt.p}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={COLORS[pt.cls]} />
        </mesh>
      ))}
      <mesh position={q}>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color={SCENE_COLORS.amber} emissive={SCENE_COLORS.amber} emissiveIntensity={0.4} />
      </mesh>
      {neighbors.map((n, i) => (
        <Line key={i} points={[q, n.p]} color={COLORS[n.cls]} lineWidth={2} transparent opacity={0.8} />
      ))}
    </SceneShell>
  );
}
