import { z } from "zod";
import { CONTENT_ICON_NAMES } from "./icons";
import { SCENE_IDS } from "./scenes";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use kebab-case (a-z, 0-9, hífen)");
const nonEmpty = z.string().trim().min(1);
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "cor hex #RRGGBB");
const iconName = z.enum(CONTENT_ICON_NAMES);

/* ------------------------------------------------------------------ */
/* Blocos de slide                                                     */
/* ------------------------------------------------------------------ */

export const headingBlockSchema = z.object({
  type: z.literal("heading"),
  text: nonEmpty,
  eyebrow: nonEmpty.optional(),
  level: z.union([z.literal(1), z.literal(2)]).default(1),
});

export const textBlockSchema = z.object({
  type: z.literal("text"),
  /** Markdown leve: **negrito**, *itálico*, `código`, listas com "- " e parágrafos. */
  md: nonEmpty,
});

export const cardGridBlockSchema = z.object({
  type: z.literal("card-grid"),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  cards: z
    .array(z.object({ icon: iconName, title: nonEmpty, description: nonEmpty }))
    .min(2)
    .max(8),
});

export const calloutBlockSchema = z.object({
  type: z.literal("callout"),
  variant: z.enum(["tip", "warning", "fun"]),
  title: nonEmpty.optional(),
  md: nonEmpty,
});

export const codeBlockSchema = z.object({
  type: z.literal("code"),
  language: z.enum(["python", "sql", "bash", "text"]),
  code: nonEmpty,
  caption: nonEmpty.optional(),
});

export const imageBlockSchema = z.object({
  type: z.literal("image"),
  src: z.string().regex(/^\/(?!\/)/, "use um caminho local começando com /"),
  alt: nonEmpty,
  caption: nonEmpty.optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const comparisonSide = z.object({
  title: nonEmpty,
  icon: iconName.optional(),
  points: z.array(nonEmpty).min(1).max(6),
});

export const comparisonBlockSchema = z.object({
  type: z.literal("comparison"),
  left: comparisonSide,
  right: comparisonSide,
  verdict: nonEmpty.optional(),
});

export const stepsBlockSchema = z.object({
  type: z.literal("steps"),
  steps: z.array(z.object({ title: nonEmpty, description: nonEmpty })).min(2).max(7),
});

export const timelineBlockSchema = z.object({
  type: z.literal("timeline"),
  items: z
    .array(z.object({ date: nonEmpty, title: nonEmpty, description: nonEmpty }))
    .min(2)
    .max(8),
});

export const flipCardsBlockSchema = z.object({
  type: z.literal("flip-cards"),
  cards: z.array(z.object({ front: nonEmpty, back: nonEmpty })).min(2).max(8),
});

export const analogyBlockSchema = z.object({
  type: z.literal("analogy"),
  icon: iconName.optional(),
  concept: z.object({ title: nonEmpty, description: nonEmpty }),
  analogy: z.object({ title: nonEmpty, description: nonEmpty }),
});

export const miniCheckBlockSchema = z
  .object({
    type: z.literal("mini-check"),
    question: nonEmpty,
    options: z.array(nonEmpty).min(2).max(5),
    answerIndex: z.number().int().nonnegative(),
    explanation: nonEmpty,
  })
  .refine((b) => b.answerIndex < b.options.length, {
    message: "answerIndex fora do intervalo de options",
    path: ["answerIndex"],
  });

export const interactive3dBlockSchema = z.object({
  type: z.literal("interactive-3d"),
  sceneId: z.string().refine((id) => SCENE_IDS.includes(id), {
    message: "sceneId não registrado em src/lib/content/scenes.ts",
  }),
  props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  caption: nonEmpty,
});

export const summaryBlockSchema = z.object({
  type: z.literal("summary"),
  title: nonEmpty.optional(),
  points: z.array(nonEmpty).min(2).max(8),
});

export const blockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  textBlockSchema,
  cardGridBlockSchema,
  calloutBlockSchema,
  codeBlockSchema,
  imageBlockSchema,
  comparisonBlockSchema,
  stepsBlockSchema,
  timelineBlockSchema,
  flipCardsBlockSchema,
  analogyBlockSchema,
  miniCheckBlockSchema,
  interactive3dBlockSchema,
  summaryBlockSchema,
]);

export const slideSchema = z.object({
  id: slug,
  /** Subtópicos cobertos pelo slide; o quiz usa para linkar revisão. */
  tags: z.array(slug).default([]),
  blocks: z.array(blockSchema).min(1).max(6),
});

/* ------------------------------------------------------------------ */
/* Questões                                                            */
/* ------------------------------------------------------------------ */

export const difficultySchema = z.enum(["easy", "medium", "hard"]);

const option = z.object({ id: slug, text: nonEmpty });

const questionBase = {
  id: slug,
  prompt: nonEmpty,
  /** Por que a certa está certa e por que as erradas estão erradas. */
  explanation: nonEmpty,
  hint: nonEmpty.optional(),
  difficulty: difficultySchema,
  tags: z.array(slug).min(1),
};

export const multipleChoiceSchema = z.object({
  ...questionBase,
  type: z.literal("multiple-choice"),
  options: z.array(option).min(3).max(5),
  answer: slug,
});

export const trueFalseSchema = z.object({
  ...questionBase,
  type: z.literal("true-false"),
  answer: z.boolean(),
});

export const multiSelectSchema = z.object({
  ...questionBase,
  type: z.literal("multi-select"),
  options: z.array(option).min(3).max(6),
  answers: z.array(slug).min(1),
});

export const orderingSchema = z.object({
  ...questionBase,
  type: z.literal("ordering"),
  /** Itens já na ordem correta; o engine embaralha a apresentação. */
  items: z.array(option).min(3).max(6),
});

export const fillBlankSchema = z.object({
  ...questionBase,
  type: z.literal("fill-blank"),
  /** O prompt contém exatamente um "___" no lugar da lacuna. */
  accepted: z.array(nonEmpty).min(1),
});

export const matchingSchema = z.object({
  ...questionBase,
  type: z.literal("matching"),
  pairs: z
    .array(z.object({ id: slug, left: nonEmpty, right: nonEmpty }))
    .min(3)
    .max(5),
});

export const outputSchema = z.object({
  ...questionBase,
  type: z.literal("output"),
  language: z.enum(["python", "sql", "bash", "text"]),
  code: nonEmpty,
  options: z.array(option).min(3).max(5),
  answer: slug,
});

export const questionSchema = z
  .discriminatedUnion("type", [
    multipleChoiceSchema,
    trueFalseSchema,
    multiSelectSchema,
    orderingSchema,
    fillBlankSchema,
    matchingSchema,
    outputSchema,
  ])
  .superRefine((q, ctx) => {
    const issue = (message: string) => ctx.addIssue({ code: "custom", message, path: [q.id] });
    const uniqueIds = (ids: string[]) => new Set(ids).size === ids.length;

    switch (q.type) {
      case "multiple-choice":
      case "output":
        if (!uniqueIds(q.options.map((o) => o.id))) issue("ids de opções repetidos");
        if (!q.options.some((o) => o.id === q.answer)) issue("answer não está entre as opções");
        break;
      case "multi-select": {
        const ids = q.options.map((o) => o.id);
        if (!uniqueIds(ids)) issue("ids de opções repetidos");
        if (!uniqueIds(q.answers)) issue("answers repetidas");
        if (!q.answers.every((a) => ids.includes(a))) issue("answers fora das opções");
        if (q.answers.length === q.options.length) issue("todas as opções corretas não discrimina nada");
        break;
      }
      case "ordering":
        if (!uniqueIds(q.items.map((i) => i.id))) issue("ids de itens repetidos");
        break;
      case "matching":
        if (!uniqueIds(q.pairs.map((p) => p.id))) issue("ids de pares repetidos");
        if (!uniqueIds(q.pairs.map((p) => p.right))) issue("lado direito repetido torna o pareamento ambíguo");
        break;
      case "fill-blank":
        if (q.prompt.split("___").length !== 2) issue('o prompt precisa de exatamente um "___"');
        break;
      case "true-false":
        break;
    }
  });

/* ------------------------------------------------------------------ */
/* Módulo e curso                                                      */
/* ------------------------------------------------------------------ */

export const difficultyMixSchema = z
  .object({ easy: z.number().min(0).max(1), medium: z.number().min(0).max(1), hard: z.number().min(0).max(1) })
  .refine((m) => Math.abs(m.easy + m.medium + m.hard - 1) < 1e-6, {
    message: "easy + medium + hard precisa somar 1",
  });

export const moduleSchema = z.object({
  slug,
  title: nonEmpty,
  description: nonEmpty,
  objectives: z.array(nonEmpty).min(2).max(6),
  estimatedMinutes: z.number().int().min(5).max(120),
  questionsPerAttempt: z.number().int().min(8).max(15),
  difficultyMix: difficultyMixSchema.default({ easy: 0.3, medium: 0.5, hard: 0.2 }),
  slides: z.array(slideSchema).min(8).max(15),
  quiz: z.array(questionSchema),
});

export const courseSchema = z.object({
  slug,
  title: nonEmpty,
  tagline: nonEmpty,
  description: nonEmpty,
  icon: iconName,
  level: z.enum(["Iniciante", "Intermediário", "Avançado", "Do básico ao avançado"]),
  estimatedHours: z.number().positive(),
  theme: z.object({ from: hexColor, to: hexColor }),
  modules: z.array(moduleSchema).min(1),
  /** Módulos planejados que ainda não têm conteúdo; aparecem bloqueados no mapa. */
  upcoming: z.array(z.object({ title: nonEmpty, description: nonEmpty })).default([]),
});

export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type TextBlock = z.infer<typeof textBlockSchema>;
export type CardGridBlock = z.infer<typeof cardGridBlockSchema>;
export type CalloutBlock = z.infer<typeof calloutBlockSchema>;
export type CodeBlock = z.infer<typeof codeBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type ComparisonBlock = z.infer<typeof comparisonBlockSchema>;
export type StepsBlock = z.infer<typeof stepsBlockSchema>;
export type TimelineBlock = z.infer<typeof timelineBlockSchema>;
export type FlipCardsBlock = z.infer<typeof flipCardsBlockSchema>;
export type AnalogyBlock = z.infer<typeof analogyBlockSchema>;
export type MiniCheckBlock = z.infer<typeof miniCheckBlockSchema>;
export type Interactive3dBlock = z.infer<typeof interactive3dBlockSchema>;
export type SummaryBlock = z.infer<typeof summaryBlockSchema>;
export type Block = z.infer<typeof blockSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type DifficultyMix = z.infer<typeof difficultyMixSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionType = Question["type"];
export type Module = z.infer<typeof moduleSchema>;
export type Course = z.infer<typeof courseSchema>;

/** Formato de autoria (antes dos defaults do Zod), usado nos arquivos de /content. */
export type CourseInput = z.input<typeof courseSchema>;
export type ModuleInput = z.input<typeof moduleSchema>;
export type SlideInput = z.input<typeof slideSchema>;
export type QuestionInput = z.input<typeof questionSchema>;
