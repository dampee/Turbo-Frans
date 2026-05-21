export type LearningGoalId =
  | `vocabulary.${string}`
  | `grammar.${string}`
  | `listening.${string}`
  | `reading.${string}`
  | `spelling.${string}`;

export interface LearningGoal {
  id: LearningGoalId;
  title: string;
  description?: string;
}
