import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { StreakChip, XpChip } from "@/components/gamification/stat-chips";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_oklab,var(--bg)_75%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="shrink-0 rounded-xl" aria-label="StudyHub, página inicial">
          <Logo />
        </Link>
        <NavLinks className="hidden md:flex" />
        <div className="ml-auto flex items-center gap-2">
          <StreakChip />
          <span className="hidden sm:block">
            <XpChip />
          </span>
          <span className="hidden lg:block">
            <ThemeToggle />
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="glass grid size-10 place-items-center rounded-full text-muted hover:text-fg"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="size-4.5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
      <NavLinks className="flex justify-center border-t border-line px-2 py-1.5 md:hidden" />
    </header>
  );
}
