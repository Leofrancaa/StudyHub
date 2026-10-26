"use client";

import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SCENE_COLORS, SceneButton, SceneButtons, SceneShell, SceneSlider } from "../scene-shell";

/** Loss em forma de tigela alongada: L(w1, w2) = 0,5·w1² + 1,5·w2². */
const A = 0.5;
const B = 1.5;
const loss = (w1: number, w2: number) => A * w1 * w1 + B * w2 * w2;
const grad = (w1: number, w2: number): [number, number] => [2 * A * w1, 2 * B * w2];
const START: [number, number] = [2.6, 1.6];
const H = 0.35; // escala vertical da superfície

function Surface() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(6.4, 6.4, 48, 48);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const l = loss(x, z);
      pos.setY(i, Math.min(l, 12) * H);
      c.setHSL(0.72 - Math.min(l / 12, 1) * 0.6, 0.7, 0.55);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} transparent opacity={0.85} />
    </mesh>
  );
}

export default function GradientDescentScene() {
  const [lr, setLr] = useState(0.1);
  const [path, setPath] = useState<[number, number][]>([START]);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);
  const current = path[path.length - 1] ?? START;
  const diverged = Math.abs(current[0]) > 6 || Math.abs(current[1]) > 6;

  const step = () =>
    setPath((p) => {
      const [w1, w2] = p[p.length - 1] ?? START;
      if (Math.abs(w1) > 6 || Math.abs(w2) > 6) return p;
      const [g1, g2] = grad(w1, w2);
      return [...p, [w1 - lr * g1, w2 - lr * g2]];
    });

  useEffect(() => {
    if (!running) return;
    let n = 0;
    timer.current = window.setInterval(() => {
      step();
      if (++n >= 25) setRunning(false);
    }, 160);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, lr]);

  const toScene = ([w1, w2]: [number, number]): [number, number, number] => [w1, Math.min(loss(w1, w2), 12) * H + 0.12, w2];
  const regime = lr < 0.34 ? "converge suavemente" : lr < 0.67 ? "oscila (zigue-zague) mas converge" : "diverge: o passo é grande demais";

  return (
    <SceneShell
      label="Superfície de erro em forma de tigela com uma bolinha descendo pelo gradiente"
      camera={[6, 6, 6]}
      status={
        <>
          Passo {path.length - 1} · loss = <strong>{diverged ? "explodiu" : loss(...current).toFixed(3)}</strong> · com learning rate {lr.toFixed(2)} a descida{" "}
          <strong>{regime}</strong>.
        </>
      }
      controls={
        <>
          <SceneSlider
            label="Learning rate"
            value={lr}
            min={0.02}
            max={0.75}
            step={0.01}
            onChange={(v) => {
              setLr(v);
              setPath([START]);
              setRunning(false);
            }}
            format={(v) => v.toFixed(2)}
          />
          <SceneButtons>
            <SceneButton onClick={step} disabled={running || diverged}>
              Dar um passo
            </SceneButton>
            <SceneButton onClick={() => setRunning(true)} disabled={running || diverged} active={running}>
              Rodar 25 passos
            </SceneButton>
            <SceneButton
              onClick={() => {
                setRunning(false);
                setPath([START]);
              }}
            >
              Reiniciar
            </SceneButton>
          </SceneButtons>
        </>
      }
    >
      <Surface />
      {path.length > 1 && <Line points={path.map(toScene)} color={SCENE_COLORS.amber} lineWidth={3} />}
      <mesh position={toScene(current)}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color={SCENE_COLORS.rose} emissive={SCENE_COLORS.rose} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={SCENE_COLORS.green} />
      </mesh>
    </SceneShell>
  );
}
