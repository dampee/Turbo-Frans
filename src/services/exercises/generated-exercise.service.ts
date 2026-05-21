import type { ExerciseGeneratorQuery } from "../../domain/exercises/exercise-generator.types";
import type { Exercise } from "../../domain/exercises/exercise.types";
import { exerciseGeneratorRegistry } from "./exercise-generator-registry";

export class GeneratedExerciseService {
  generate(query: ExerciseGeneratorQuery): Exercise[] {
    return exerciseGeneratorRegistry.generate(query).filter((exercise) => this.hasValidAnswer(exercise));
  }

  private hasValidAnswer(exercise: Exercise): boolean {
    if (exercise.type === "fill-blank") {
      return exercise.acceptedAnswers.length > 0;
    }

    if (exercise.type === "multiple-choice") {
      return exercise.choices.some((choice) => choice.isCorrect);
    }

    if (exercise.type === "match-pairs") {
      return exercise.pairs.length > 0;
    }

    if (exercise.type === "secret-word") {
      return exercise.answer.length > 0;
    }

    return exercise.steps.length > 0;
  }
}

export const generatedExerciseService = new GeneratedExerciseService();
