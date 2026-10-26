"use client";

import dynamic from "next/dynamic";
import { Box } from "lucide-react";
import type { Interactive3dBlock as Interactive3dBlockData } from "@/lib/content/schema";
import { SCENE_LOADERS } from "@/components/three/registry";

function SceneSkeleton() {
  return (
    <div className="grid aspect-video w-full animate-pulse place-items-center rounded-3xl bg-sunken text-muted">
      <Box className="size-8" aria-hidden="true" />
      <span className="sr-only">Carregando cena 3D</span>
    </div>
  );
}

/** Um componente dinâmico por cena, criado uma única vez no carregamento do módulo. */
const SCENES = Object.fromEntries(
  Object.entries(SCENE_LOADERS).map(([id, loader]) => [id, dynamic(loader, { ssr: false, loading: SceneSkeleton })]),
);

export function Interactive3dBlock({ block }: { block: Interactive3dBlockData }) {
  const Scene = SCENES[block.sceneId];

  return (
    <figure className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-line bg-elev">
        {Scene ? <Scene {...(block.props ?? {})} /> : <SceneSkeleton />}
      </div>
      <figcaption className="text-sm text-muted">{block.caption}</figcaption>
    </figure>
  );
}
