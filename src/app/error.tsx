"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="app-backdrop grid min-h-dvh place-items-center p-6">
      <div className="glass max-w-md rounded-4xl p-10 text-center" role="alert">
        <h1 className="font-display text-2xl font-bold">Algo deu errado</h1>
        <p className="mt-2 text-muted">Seu progresso continua salvo neste navegador. Tente carregar de novo.</p>
        <Button className="mt-6" onClick={reset}>
          Tentar de novo
        </Button>
      </div>
    </main>
  );
}
