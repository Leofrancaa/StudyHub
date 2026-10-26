import type { CourseInput, ModuleInput, QuestionInput } from "./schema";

/** Helpers de identidade: só dão autocomplete e checagem de tipo aos arquivos de /content. */
export const defineCourse = (course: CourseInput): CourseInput => course;
export const defineModule = (mod: Omit<ModuleInput, "quiz">): Omit<ModuleInput, "quiz"> => mod;
export const defineQuiz = (questions: QuestionInput[]): QuestionInput[] => questions;
