/**
 * Sessão em cookie assinado com HMAC-SHA256 (Web Crypto).
 * Funciona no runtime Node e no Edge, sem dependências externas.
 * Formato: base64url(payload JSON).base64url(assinatura)
 */

export const SESSION_COOKIE = "studyhub_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export type SessionPayload = { sub: string; exp: number };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) return null;
  try {
    const b64 = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSessionToken(
  username: string,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
  ttlSeconds: number = SESSION_TTL_SECONDS,
): Promise<string> {
  const payload: SessionPayload = { sub: username, exp: nowSeconds + ttlSeconds };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body)));
  return `${body}.${toBase64Url(sig)}`;
}

/** Valida assinatura (comparação em tempo constante via subtle.verify) e expiração. */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sigText] = parts as [string, string];
  const sig = fromBase64Url(sigText);
  const bodyBytes = fromBase64Url(body);
  if (!sig || !bodyBytes) return null;

  const valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), sig, encoder.encode(body));
  if (!valid) return null;

  try {
    const payload = JSON.parse(decoder.decode(bodyBytes)) as Partial<SessionPayload>;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp <= nowSeconds) return null;
    return { sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

/** Compara credenciais sem vazar, pelo tempo de resposta, quantos caracteres batem. */
export async function safeEqual(a: string, b: string, secret: string): Promise<boolean> {
  const key = await hmacKey(secret);
  const [ha, hb] = await Promise.all([
    crypto.subtle.sign("HMAC", key, encoder.encode(a)),
    crypto.subtle.sign("HMAC", key, encoder.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= (va[i] ?? 0) ^ (vb[i] ?? 0);
  return diff === 0;
}

/** Só aceita caminhos internos ("/x"), bloqueando redirecionamento aberto ("//evil.com", "https://..."). */
export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  if (next.startsWith("/login")) return "/";
  return next;
}
