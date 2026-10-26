"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthConfig } from "./config";
import { createSessionToken, safeEqual, sanitizeNextPath, SESSION_COOKIE, SESSION_TTL_SECONDS } from "./session";

/** `username` volta para o formulário: o React limpa o form depois da action. */
export type LoginState = { error: string | null; username?: string };

const loginSchema = z.object({
  username: z.string().trim().min(1, "Informe o usuário").max(100),
  password: z.string().min(1, "Informe a senha").max(200),
  next: z.string().max(500).optional(),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
  const typedUser = typeof formData.get("username") === "string" ? String(formData.get("username")).slice(0, 100) : "";
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos", username: typedUser };

  const config = getAuthConfig();
  const [userOk, passOk] = await Promise.all([
    safeEqual(parsed.data.username, config.username, config.secret),
    safeEqual(parsed.data.password, config.password, config.secret),
  ]);
  if (!userOk || !passOk) return { error: "Usuário ou senha incorretos", username: typedUser };

  const token = await createSessionToken(config.username, config.secret);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect(sanitizeNextPath(parsed.data.next));
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
