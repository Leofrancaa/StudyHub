import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="app-backdrop flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-elev focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <AppHeader />
      <main id="conteudo" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        StudyHub · aprenda no seu ritmo, um módulo por vez.
      </footer>
    </div>
  );
}
