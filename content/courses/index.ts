import type { CourseInput } from "@/lib/content/schema";
import { mlMineracao } from "./ml-mineracao/course";

/**
 * Lista de cursos do hub. Para adicionar um curso:
 * 1. crie /content/courses/<slug>/course.ts e os módulos em /modules;
 * 2. importe e inclua o curso neste array.
 */
export const courseSources: CourseInput[] = [mlMineracao];
