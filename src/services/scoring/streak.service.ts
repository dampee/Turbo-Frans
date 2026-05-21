import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { Streak } from "../../domain/race/score.types";

export class StreakService {
  applyResult(streak: Streak, result: AnswerResult): Streak {
    const current = result.isCorrect ? streak.current + 1 : 0;
    return {
      current,
      best: Math.max(streak.best, current),
    };
  }
}

export const streakService = new StreakService();
