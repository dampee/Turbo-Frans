export interface AnswerResult {
  exerciseId: string;
  isCorrect: boolean;
  earnedPoints: number;
  mistakes: string[];
  usedHint: boolean;
  completedAt: string;
}

export interface FeedbackPolicy {
  showCorrectAnswer: boolean;
  allowRetry: boolean;
  immediateFeedback: boolean;
}
