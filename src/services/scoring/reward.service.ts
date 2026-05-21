import type { RaceSession } from "../../domain/race/race-session.types";
import type { Badge, EarnedBadge } from "../../domain/race/reward.types";
import { todayIso } from "../../shared/utils/date";

export const badges: Badge[] = [
  {
    id: "first-finish",
    title: "First Finish",
    description: "Finish your first race.",
    icon: "🏁",
  },
  {
    id: "perfect-checkpoint",
    title: "Perfect Checkpoint",
    description: "Complete a checkpoint without mistakes.",
    icon: "⭐",
  },
  {
    id: "turbo-streak-3",
    title: "Turbo Streak 3",
    description: "Get three correct answers in a row.",
    icon: "🔥",
  },
  {
    id: "turbo-streak-5",
    title: "Turbo Streak 5",
    description: "Get five correct answers in a row.",
    icon: "🚀",
  },
  {
    id: "grammar-hero",
    title: "Grammar Hero",
    description: "Score on grammar checkpoints.",
    icon: "📘",
  },
  {
    id: "code-cracker",
    title: "Code Cracker",
    description: "Open the code checkpoint.",
    icon: "🔐",
  },
];

export class RewardService {
  calculateBadges(session: RaceSession): EarnedBadge[] {
    const earned = new Set<string>(session.earnedBadges.map((badge) => badge.badgeId));
    const add = (badgeId: string) => earned.add(badgeId);

    if (session.completedAt) {
      add("first-finish");
    }

    if (session.results.some((result) => result.isCorrect && result.mistakes.length === 0)) {
      add("perfect-checkpoint");
    }

    if (session.streak.best >= 3) {
      add("turbo-streak-3");
    }

    if (session.streak.best >= 5) {
      add("turbo-streak-5");
    }

    if (session.results.some((result) => result.exerciseId.includes("participe-passe") && result.isCorrect)) {
      add("grammar-hero");
    }

    if (session.results.some((result) => result.exerciseId.includes("crack-code") && result.isCorrect)) {
      add("code-cracker");
    }

    const earnedAt = todayIso();
    return [...earned].map((badgeId) => ({ badgeId, earnedAt }));
  }

  findBadge(badgeId: string): Badge | undefined {
    return badges.find((badge) => badge.id === badgeId);
  }
}

export const rewardService = new RewardService();
