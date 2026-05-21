export interface Score {
  points: number;
  correctAnswers: number;
  mistakes: number;
}

export interface Streak {
  current: number;
  best: number;
}

export interface ScoreHistoryEntry {
  sessionId: string;
  trackId: string;
  points: number;
  correctAnswers: number;
  mistakes: number;
  completedAt: string;
}
