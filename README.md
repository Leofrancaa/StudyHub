# StudyHub

Hub de aprendizado gamificado e agnóstico ao assunto: slides interativos (com cenas 3D), quizzes com banco sorteado, XP, níveis, streak, conquistas e revisão espaçada. Primeiro curso: **Machine Learning e Mineração de Dados**, com 12 módulos e mais de 600 questões.

Produção: https://studyhub-nine-wheat.vercel.app (login provisório `admin` / `admin`).

## Rodar

Requisitos: Node 20+.

```bash
npm install
npm run dev              # http://localhost:3000
npm test                 # Vitest (unidade + validação de conteúdo)
npm run lint
npm run typecheck
npm run build            # o prebuild valida o conteúdo e falha se algo estiver errado
npm start
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Todas são opcionais em desenvolvimento.

| Variável | Padrão | Uso |
|---|---|---|
| `AUTH_USER` | `admin` | Usuário do login provisório |
| `AUTH_PASSWORD` | `admin` | Senha do login provisório |
| `AUTH_SECRET` | segredo de desenvolvimento | Chave HMAC do cookie de sessão. **Obrigatória em produção**: sem ela, o segredo padrão está neste repositório e o cookie pode ser forjado. Gere com `openssl rand -base64 48`. |

## Funcionalidades

- **Trilha** por curso: cada módulo libera o próximo quando o quiz é aprovado com **≥ 90%**.
- **Slides**: 14 tipos de bloco (texto, cards, timeline, passos, comparação, código com realce, analogia, mini-check, callout, resumo, cena 3D...). Teclado (← →), swipe, link por `#slide`, progresso salvo por slide.
- **Cenas 3D** (React Three Fiber): ajuste de regressão, KNN no espaço, descida do gradiente, rede neural, convolução, cubo OLAP e k-means. Só renderizam quando visíveis; fora da tela, `frameloop="never"`.
- **Quiz**: 7 tipos (múltipla escolha, múltipla seleção, V/F, lacuna, ordenação, associação, saída de código). Sorteio com Fisher–Yates semeado, mistura de dificuldade 30/50/20 e sem repetir a tentativa anterior.
- **Gamificação**: XP (slide 5, acerto 10, combo +5 a cada 3, bônus de aprovação, de primeira e nota perfeita), níveis `100·(n−1)^1.5`, streak diária, 11 conquistas, confete.
- **Revisão espaçada**: questões erradas entram em caixas de Leitner.
- **Tema** claro/escuro/sistema, `prefers-reduced-motion` respeitado, foco visível e navegação por teclado.

## Estrutura

```
content/courses/index.ts                  registro de cursos
content/courses/<curso>/course.ts         metadados + módulos (+ "upcoming" opcional)
content/courses/<curso>/modules/NN-*.ts   slides (defineModule)
content/courses/<curso>/modules/NN-*.quiz.ts  banco de questões (defineQuiz)

src/app/(app)/        catálogo, curso, dashboard, revisão (com header)
src/app/(focus)/      slides e quiz em tela cheia
src/app/login/        login provisório
src/proxy.ts          proteção de rotas (substitui o middleware no Next 16)

src/lib/content/      schemas Zod, validação cruzada, registry, ícones permitidos, ids de cena
src/lib/quiz/         sorteio, alocação por dificuldade, correção, aprovação
src/lib/gamification/ XP, níveis, streak, conquistas, Leitner
src/lib/progress/     reducers puros, store Zustand (persist), repositório, desbloqueio
src/lib/auth/         sessão assinada (Web Crypto), server actions de login/logout
src/components/       ui, slides, quiz, three, gamification, course, layout
```

## Adicionar um curso

1. Crie `content/courses/<slug>/course.ts` com `defineCourse({ slug, title, theme, modules, ... })`.
2. Para cada módulo, crie `modules/01-<slug>.ts` com `defineModule` e `modules/01-<slug>.quiz.ts` com `defineQuiz`, e junte-os em `modules: [{ ...module01, quiz: quiz01 }]`.
3. Registre o curso em `content/courses/index.ts`.
4. Rode `npm test`. A validação acusa:
   - banco menor que 5 × `questionsPerAttempt`, ou menos de 2 × o alvo de cada dificuldade;
   - tag de questão que não aparece em nenhum slide;
   - módulo sem analogia, sem mini-check ou sem resumo no último slide;
   - ids repetidos, explicações curtas, opções duplicadas, associação com menos de 3 pares;
   - de 8 a 15 slides por módulo e até 6 blocos por slide.
5. Ícones vêm de uma lista fechada (`src/lib/content/icons.ts`); cenas 3D, de `src/lib/content/scenes.ts`. Nova cena: crie o componente em `src/components/three/scenes/`, adicione o id e o loader em `src/components/three/registry.ts`.

O conteúdo não importa nada de React: dá para gerar ou revisar os módulos sem tocar na interface.

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: Next.js).
2. Em **Settings → Environment Variables**, defina `AUTH_SECRET` (e, se quiser, `AUTH_USER` e `AUTH_PASSWORD`).
3. Cada push na `main` gera um deploy de produção. O build falha se o conteúdo for inválido.

## Decisões

- **Next 16 com Cache Components**: páginas de conteúdo são estáticas (`generateStaticParams`); a autenticação roda no `proxy`, sem ler cookies nas páginas.
- **Progresso no navegador**: `localStorage` atrás da interface `ProgressRepository` (`src/lib/progress/repository.ts`), com envelope versionado e migração. Trocar por um backend é implementar a interface.
- **Reducers puros** para XP, streak, conquistas e revisão: testáveis sem React.
- **Cenas 3D carregadas sob demanda** (`dynamic import`): quem não abre o slide não baixa o three.js.
- **Fontes locais** (`next/font/local`, OFL): o build não depende de rede.
- **Realce de código próprio** (`src/lib/highlight.ts`) para não adicionar dependência.
- **Anti-farm de XP**: depois de aprovado, acertos no mesmo módulo valem 2 XP.
- **Correções do material**: onde os slides da disciplina tinham erro (ex.: mapa de ativação da Aula 14), o módulo traz um callout com a conta refeita.

## Lighthouse (build de produção, local)

| Página | Desktop: performance | Mobile: performance | Acessibilidade / boas práticas / SEO |
|---|---|---|---|
| Catálogo `/` | 99 | 69 | 100 / 100 / 100 |
| Slides do módulo 1 | 100 | 79 | 100 / 100 / 100 |
| Trilha do curso | – | 77 | 100 / 100 / 100 |
| Dashboard | – | 81 | 100 / 100 / 100 |

No perfil mobile (CPU 4× mais lenta), o que pesa é a hidratação do runtime do React/Next (~120 KB gzip), não o conteúdo; o three.js só é baixado no slide com cena.

## Limitações conhecidas

- Login único e provisório, sem banco; o progresso não sincroniza entre dispositivos.
- Cenas 3D exigem WebGL; sem ele, o slide mostra a legenda e o restante do conteúdo continua acessível.
