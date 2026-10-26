import { describe, expect, it } from "vitest";
import { SCENE_IDS } from "@/lib/content/scenes";
import { SCENE_LOADERS } from "./registry";

describe("registro de cenas 3D", () => {
  it("todo id de conteúdo tem cena e vice-versa", () => {
    expect([...SCENE_IDS].sort()).toEqual(Object.keys(SCENE_LOADERS).sort());
  });
});
