import type { Metadata } from "next";
import { getCourses } from "@/lib/content/registry";
import { summarizeCourse } from "@/lib/content/summary";
import { Dashboard } from "@/components/gamification/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Seu XP, nível, streak, tempo de estudo, progresso por curso e conquistas.",
};

export default function DashboardPage() {
  return <Dashboard courses={getCourses().map(summarizeCourse)} />;
}
