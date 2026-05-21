import type { LearningGoalId } from "../learning/learning-goal.types";
import type { LearningModuleId } from "../learning/learning-module.types";
import type { Exercise, MiniGameType } from "./exercise.types";

export interface ExerciseGeneratorQuery {
  moduleId: LearningModuleId;
  learningGoal: LearningGoalId;
  miniGameType: MiniGameType;
  count: number;
  seed?: string;
  tags?: string[];
}

export interface ExerciseGenerator {
  id: string;
  canHandle(query: ExerciseGeneratorQuery): boolean;
  generate(query: ExerciseGeneratorQuery): Exercise[];
}
