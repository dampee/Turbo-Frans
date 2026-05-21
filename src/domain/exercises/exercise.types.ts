import type { LearningGoalId } from "../learning/learning-goal.types";
import type { LearningModuleId } from "../learning/learning-module.types";

export type MiniGameType =
  | "match-pairs"
  | "fill-blank"
  | "multiple-choice"
  | "secret-word"
  | "crack-code";

export interface BaseExercise {
  id: string;
  type: MiniGameType;
  title: string;
  prompt: string;
  moduleIds: LearningModuleId[];
  learningGoals: LearningGoalId[];
  points: number;
  tags: string[];
  generated?: boolean;
  source?: string;
}

export interface FillBlankExercise extends BaseExercise {
  type: "fill-blank";
  sentence: string;
  acceptedAnswers: string[];
  hint?: string;
  speechText?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple-choice";
  question: string;
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  speechText?: string;
}

export interface MatchPairsExercise extends BaseExercise {
  type: "match-pairs";
  pairs: {
    id: string;
    left: string;
    right: string;
  }[];
}

export interface SecretWordExercise extends BaseExercise {
  type: "secret-word";
  clue: string;
  answer: string;
  revealedLetters?: number[];
  speechText?: string;
}

export interface CrackCodeExercise extends BaseExercise {
  type: "crack-code";
  steps: {
    id: string;
    question: string;
    acceptedAnswers: string[];
    rewardSymbol: string;
  }[];
  finalMessage: string;
}

export type Exercise =
  | FillBlankExercise
  | MultipleChoiceExercise
  | MatchPairsExercise
  | SecretWordExercise
  | CrackCodeExercise;
