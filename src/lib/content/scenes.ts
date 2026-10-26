/**
 * IDs das cenas 3D disponíveis para o bloco `interactive-3d`.
 * Fica separado dos componentes Three.js para que a validação de conteúdo
 * não precise importar código de renderização.
 * A fase 3 adiciona as cenas; cada id novo precisa de entrada no registry de `/components/three`.
 */
export const SCENE_IDS: readonly string[] = [];
