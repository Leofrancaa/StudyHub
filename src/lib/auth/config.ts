/**
 * Credenciais provisórias, enquanto não há banco de dados.
 * Sem variáveis de ambiente, o login padrão é admin / admin.
 *
 * Em produção, defina na Vercel: AUTH_USER, AUTH_PASSWORD e AUTH_SECRET.
 * Sem AUTH_SECRET, o segredo padrão está no repositório público e qualquer pessoa
 * poderia forjar o cookie de sessão.
 */
const DEFAULT_SECRET = "studyhub-dev-secret-troque-em-producao-AUTH_SECRET";

export type AuthConfig = { username: string; password: string; secret: string; usingDefaults: boolean };

export function getAuthConfig(): AuthConfig {
  const username = process.env.AUTH_USER?.trim() || "admin";
  const password = process.env.AUTH_PASSWORD || "admin";
  const secret = process.env.AUTH_SECRET || DEFAULT_SECRET;
  return {
    username,
    password,
    secret,
    usingDefaults: !process.env.AUTH_USER && !process.env.AUTH_PASSWORD,
  };
}
