# StudyHub

Hub de aprendizado gamificado e agnóstico ao assunto: slides interativos, quizzes com banco sorteado, XP, níveis, streak, conquistas e revisão espaçada. Primeiro curso: **Machine Learning e Mineração de Dados**.

> Status: fases 1 e 2 entregues (base, engine de quiz, gamificação, páginas, login provisório e o módulo 1 completo). Fases 3–6 (cenas 3D, demais módulos, polimento e README completo) vêm a seguir.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run lint
npm run build      # roda a validação de conteúdo antes (prebuild)
```

## Login (provisório, sem banco)

- Padrão: usuário `admin`, senha `admin`.
- Sessão em cookie `httpOnly` assinado com HMAC-SHA256 (7 dias). O `src/proxy.ts` protege todas as rotas.
- **Em produção, defina na Vercel:** `AUTH_USER`, `AUTH_PASSWORD` e `AUTH_SECRET` (string longa e aleatória). Sem `AUTH_SECRET`, o segredo padrão está neste repositório e o cookie pode ser forjado.
- O progresso fica no `localStorage` do navegador, atrás da interface `ProgressRepository` (`src/lib/progress/repository.ts`), pronta para trocar por backend.

## Estrutura

```
content/courses/<curso>/course.ts        metadados + lista de módulos
content/courses/<curso>/modules/*.ts     slides e banco de questões
src/lib/content/    schemas Zod, validação cruzada, registry
src/lib/quiz/       sorteio (Fisher–Yates), dificuldade, correção, aprovação ≥ 90%
src/lib/gamification/  XP, níveis, streak, conquistas, Leitner
src/lib/progress/   reducers puros, store Zustand (persist), repositório
src/lib/auth/       sessão assinada, server actions de login/logout
src/components/slides|quiz|three|gamification
```

## Adicionar um curso

1. Crie `content/courses/<slug>/course.ts` com `defineCourse({...})`.
2. Crie os módulos em `modules/01-<slug>.ts` (`defineModule`) e `01-<slug>.quiz.ts` (`defineQuiz`).
3. Inclua o curso em `content/courses/index.ts`.
4. `npm test`: a validação acusa banco pequeno (< 5 × questões por tentativa), tags sem slide, falta de analogia/mini-check/resumo etc.

## Decisões

- **Next 16 com Cache Components**: páginas de conteúdo são estáticas (`generateStaticParams`); a autenticação roda no `proxy`, sem ler cookies nas páginas.
- **Fontes locais** (`next/font/local`, OFL): o build não depende de rede.
- **Realce de código próprio** (`src/lib/highlight.ts`) para não adicionar dependência.
- **Anti-farm de XP**: depois de aprovado, acertos no mesmo módulo valem 2 XP.
