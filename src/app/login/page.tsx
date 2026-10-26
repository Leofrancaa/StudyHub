import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse o StudyHub.",
};

export default function LoginPage() {
  return (
    <main className="app-backdrop relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div
        aria-hidden="true"
        className="gradient-accent pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full opacity-30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="gradient-accent pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full opacity-20 blur-3xl"
      />

      <div className="glass relative w-full max-w-md rounded-4xl p-8 sm:p-10">
        <Logo />
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight">
          Bora estudar<span className="text-gradient">.</span>
        </h1>
        <p className="mt-2 text-muted">Entre para continuar sua trilha, seu streak e suas conquistas.</p>
        <Suspense fallback={<div className="mt-8 h-64" aria-hidden="true" />}>
          <LoginForm showDefaultHint={process.env.NODE_ENV !== "production"} />
        </Suspense>
      </div>
    </main>
  );
}
