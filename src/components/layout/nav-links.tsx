"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Repeat } from "lucide-react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Cursos", Icon: BookOpen, match: (p: string) => p === "/" || p.startsWith("/courses") },
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, match: (p: string) => p.startsWith("/dashboard") },
  { href: "/review", label: "Revisão", Icon: Repeat, match: (p: string) => p.startsWith("/review") },
] as const;

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className={cn("items-center gap-1", className)}>
      {LINKS.map(({ href, label, Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors",
              active ? "bg-accent-soft text-accent-text" : "text-muted hover:text-fg",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
