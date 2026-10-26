"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LogIn, TriangleAlert } from "lucide-react";
import { login, type LoginState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

const initialState: LoginState = { error: null };

const inputClass =
  "h-12 w-full rounded-2xl border border-line bg-elev px-4 text-fg shadow-soft outline-none transition-colors placeholder:text-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40";

export function LoginForm({ showDefaultHint }: { showDefaultHint: boolean }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const next = useSearchParams().get("next") ?? "/";

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Usuário
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          autoFocus
          defaultValue={state.username ?? ""}
          className={inputClass}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${inputClass} pr-12`}
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "login-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted hover:text-fg"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="size-4.5" aria-hidden="true" /> : <Eye className="size-4.5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div aria-live="assertive">
        {state.error && (
          <p id="login-error" className="flex items-center gap-2 rounded-2xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
            {state.error}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <LogIn className="size-5" aria-hidden="true" />}
        {pending ? "Entrando..." : "Entrar"}
      </Button>

      {showDefaultHint && (
        <p className="text-center text-xs text-muted">
          Ambiente de desenvolvimento: usuário <code className="font-mono">admin</code>, senha <code className="font-mono">admin</code>.
        </p>
      )}
    </form>
  );
}
