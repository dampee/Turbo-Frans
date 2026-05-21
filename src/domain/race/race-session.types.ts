import type { AnswerResult } from "../exercises/exercise-result.types";
import type { EarnedBadge } from "./reward.types";
import type { Score, Streak } from "./score.types";

export interface RaceSession {
  id: string;
  studentId: string;
  trackId: string;
  currentCheckpointIndex: number;
  score: Score;
  streak: Streak;
  results: AnswerResult[];
  earnedBadges: EarnedBadge[];
  startedAt: string;
  completedAt?: string;
}
