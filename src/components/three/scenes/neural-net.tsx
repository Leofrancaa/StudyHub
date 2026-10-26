"use client";

import { Line } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { seededRng } from "@/lib/quiz/random";
import { SCENE_COLORS, SceneButton, SceneButtons, SceneShell, SceneSlider } from "../scene-shell";

type Mode = "idle" | "forward" | "backward";

export default function NeuralNetScene() {
  const [hidden, setHidden] = useState(2);
  const [width, setWidth] = useState(4);
  const [mode, setMode] = useState<Mode>("idle");
  const [lit, setLit] = useState(-1);

  const sizes = useMemo(() => [3, ...Array.from({ length: hidden }, () => width), 2], [hidden, width]);
  const layers = sizes.length;
  const params = sizes.slice(1).reduce((s, n, i) => s + n * (sizes[i] ?? 0) + n, 0);

  const nodes = useMemo(
    () =>
      sizes.map((n, li) => {
        const x = (li - (layers - 1) / 2) * 2.2;
        return Array.from({ length: n }, (_, ni): [number, number, number] => [x, (ni - (n - 1) / 2) * 0.9 + 2, 0]);
      }),
    [sizes, layers],
  );

  const edges = useMemo(() => {
    const rng = seededRng(hidden * 10 + width);
    const out: { a: [number, number, number]; b: [number, number, number]; layer: number; positive: boolean }[] = [];
    for (let l = 0; l < layers - 1; l++) {
      for (const a of nodes[l] ?? []) for (const b of nodes[l + 1] ?? []) out.push({ a, b, layer: l, positive: rng() > 0.4 });
    }
    return out;
  }, [nodes, layers, hidden, width]);

  // Anima camada a camada: forward da entrada para a saída, backward ao contrário.
  useEffect(() => {
    if (mode === "idle") return;
    let i = 0;
    const order = Array.from({ length: layers }, (_, k) => (mode === "forward" ? k : layers - 1 - k));
    const id = window.setInterval(() => {
      if (i >= order.length) {
        window.clearInterval(id);
        setMode("idle");
        setLit(-1);
        return;
      }
      setLit(order[i] ?? -1);
      i++;
    }, 450);
    return () => window.clearInterval(id);
  }, [mode, layers]);

  const active = (layer: number) => mode !== "idle" && layer === lit;
  const pulse = mode === "backward" ? SCENE_COLORS.rose : SCENE_COLORS.amber;

  return (
    <SceneShell
      label="Rede neural em 3D com camada de entrada, camadas ocultas e camada de saída ligadas por pesos"
      camera={[0, 2, 10]}
      status={
        <>
          Arquitetura {sizes.join(" → ")} · <strong>{params}</strong> parâmetros treináveis (pesos + bias).{" "}
          {mode === "forward" && "Forward: o sinal vai da entrada até a previsão."}
          {mode === "backward" && "Backpropagation: o erro volta da saída, calculando o gradiente de cada peso."}
        </>
      }
      controls={
        <>
          <SceneSlider label="Camadas ocultas" value={hidden} min={1} max={3} step={1} onChange={setHidden} />
          <SceneSlider label="Neurônios por camada oculta" value={width} min={2} max={6} step={1} onChange={setWidth} />
          <SceneButtons>
            <SceneButton onClick={() => setMode("forward")} disabled={mode !== "idle"} active={mode === "forward"}>
              Forward pass
            </SceneButton>
            <SceneButton onClick={() => setMode("backward")} disabled={mode !== "idle"} active={mode === "backward"}>
              Backpropagation
            </SceneButton>
          </SceneButtons>
        </>
      }
    >
      {edges.map((e, i) => (
        <Line
          key={i}
          points={[e.a, e.b]}
          color={active(mode === "forward" ? e.layer + 1 : e.layer) ? pulse : e.positive ? SCENE_COLORS.violet : SCENE_COLORS.cyan}
          lineWidth={active(mode === "forward" ? e.layer + 1 : e.layer) ? 2.5 : 1}
          transparent
          opacity={0.55}
        />
      ))}
      {nodes.map((layer, li) =>
        layer.map((p, ni) => (
          <mesh key={`${li}-${ni}`} position={p}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial
              color={active(li) ? pulse : li === 0 ? SCENE_COLORS.green : li === layers - 1 ? SCENE_COLORS.amber : SCENE_COLORS.violet}
              emissive={active(li) ? pulse : "#000000"}
              emissiveIntensity={active(li) ? 0.6 : 0}
            />
          </mesh>
        )),
      )}
    </SceneShell>
  );
}
