/**
 * IDs das cenas 3D disponíveis para o bloco `interactive-3d`.
 * Fica separado dos componentes Three.js para que a validação de conteúdo
 * não precise importar código de renderização. Cada id precisa de entrada em
 * src/components/three/registry.ts (um teste garante isso).
 */
export const SCENE_IDS: readonly string[] = [
  "regression-fit",
  "knn-space",
  "gradient-descent",
  "neural-net",
  "convolution",
  "olap-cube",
  "kmeans",
];
