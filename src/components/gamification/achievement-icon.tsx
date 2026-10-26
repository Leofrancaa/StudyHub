import { Crown, Flag, Flame, Footprints, Repeat, Star, Target, Timer, Trophy, Zap, type LucideIcon } from "lucide-react";
import type { AchievementDef } from "@/lib/gamification/achievements";

const ICONS: Record<AchievementDef["icon"], LucideIcon> = {
  Crown,
  Flag,
  Flame,
  Footprints,
  Repeat,
  Star,
  Target,
  Timer,
  Trophy,
  Zap,
};

export function AchievementIcon({ name, className }: { name: AchievementDef["icon"]; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
