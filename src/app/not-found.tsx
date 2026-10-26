import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="app-backdrop grid min-h-dvh place-items-center p-6">
      <div className="glass max-w-md rounded-4xl p-10 text-center">
        <p className="font-display text-6xl font-bold text-gradient">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 text-muted">Esse conteúdo não existe ou mudou de lugar.</p>
        <ButtonLink href="/" className="mt-6">
          Voltar para os cursos
        </ButtonLink>
      </div>
    </main>
  );
}
