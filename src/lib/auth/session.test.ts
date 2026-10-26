import { describe, expect, it } from "vitest";
import { createSessionToken, safeEqual, sanitizeNextPath, verifySessionToken } from "./session";

const secret = "segredo-de-teste";

describe("sessão assinada", () => {
  it("aceita token válido e devolve o usuário", async () => {
    const token = await createSessionToken("admin", secret, 1000, 60);
    expect(await verifySessionToken(token, secret, 1010)).toEqual({ sub: "admin", exp: 1060 });
  });

  it("rejeita token expirado", async () => {
    const token = await createSessionToken("admin", secret, 1000, 60);
    expect(await verifySessionToken(token, secret, 1060)).toBeNull();
  });

  it("rejeita assinatura com outro segredo", async () => {
    const token = await createSessionToken("admin", secret, 1000, 60);
    expect(await verifySessionToken(token, "outro", 1010)).toBeNull();
  });

  it("rejeita payload adulterado", async () => {
    const token = await createSessionToken("admin", secret, 1000, 60);
    const [, sig] = token.split(".");
    const forged = btoa(JSON.stringify({ sub: "admin", exp: 9_999_999_999 })).replace(/=+$/, "");
    expect(await verifySessionToken(`${forged}.${sig}`, secret, 1010)).toBeNull();
  });

  it("rejeita lixo", async () => {
    for (const bad of [undefined, "", "abc", "a.b.c", "!!!.???"]) {
      expect(await verifySessionToken(bad, secret)).toBeNull();
    }
  });

  it("safeEqual compara corretamente", async () => {
    expect(await safeEqual("admin", "admin", secret)).toBe(true);
    expect(await safeEqual("admin", "admim", secret)).toBe(false);
    expect(await safeEqual("", "admin", secret)).toBe(false);
  });
});

describe("sanitizeNextPath", () => {
  it("mantém caminhos internos", () => {
    expect(sanitizeNextPath("/courses/ml-mineracao")).toBe("/courses/ml-mineracao");
  });

  it("bloqueia redirecionamento aberto e loops", () => {
    for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "evil", "", null, "/login"]) {
      expect(sanitizeNextPath(bad)).toBe("/");
    }
  });
});
