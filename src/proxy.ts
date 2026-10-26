import { NextResponse, type NextRequest } from "next/server";
import { getAuthConfig } from "@/lib/auth/config";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * Protege todas as páginas: sem sessão válida, redireciona para /login?next=<rota>.
 * As páginas continuam estáticas; a checagem acontece antes da renderização.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, getAuthConfig().secret);

  if (pathname === "/login") {
    return session ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Ignora assets do Next, imagens e arquivos estáticos (qualquer caminho com extensão).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
