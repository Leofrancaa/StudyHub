import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { CelebrationLayer } from "@/components/gamification/celebration-layer";
import { inter, jetbrainsMono, spaceGrotesk } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "StudyHub", template: "%s · StudyHub" },
  description: "Hub de aprendizado gamificado: slides interativos, quizzes, XP, streak e revisão espaçada.",
  applicationName: "StudyHub",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          {children}
          <CelebrationLayer />
        </Providers>
      </body>
    </html>
  );
}
