import type { AnswerResult } from "../../domain/exercises/exercise-result.types";
import type { Score } from "../../domain/race/score.types";

export class ScoreService {
  applyResult(score: Score, result: AnswerResult): Score {
    return {
      points: score.points + result.earnedPoints,
      correctAnswers: score.correctAnswers + (result.isCorrect ? 1 : 0),
      mistakes: score.mistakes + result.mistakes.length,
    };
  }
}

export const scoreService = new ScoreService();
