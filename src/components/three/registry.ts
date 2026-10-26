import type { ComponentType } from "react";

export type SceneProps = Record<string, string | number | boolean>;

/**
 * Cenas 3D por id, carregadas sob demanda (next/dynamic, ssr: false).
 * Ao adicionar uma cena, registre também o id em src/lib/content/scenes.ts.
 */
export const SCENE_LOADERS: Record<string, () => Promise<{ default: ComponentType<SceneProps> }>> = {
  "regression-fit": () => import("./scenes/regression-fit"),
  "knn-space": () => import("./scenes/knn-space"),
  "gradient-descent": () => import("./scenes/gradient-descent"),
  "neural-net": () => import("./scenes/neural-net"),
  convolution: () => import("./scenes/convolution"),
  "olap-cube": () => import("./scenes/olap-cube"),
  kmeans: () => import("./scenes/kmeans"),
};
