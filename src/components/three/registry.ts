import type { ComponentType } from "react";

export type SceneProps = Record<string, string | number | boolean>;

/**
 * Cenas 3D por id. Cada cena é carregada sob demanda (next/dynamic, ssr: false).
 * Ao adicionar uma cena, registre também o id em src/lib/content/scenes.ts.
 * A fase 3 popula este registro.
 */
export const SCENE_LOADERS: Record<string, () => Promise<{ default: ComponentType<SceneProps> }>> = {};
