import type { ExerciseGenerator, ExerciseGeneratorQuery } from "../../domain/exercises/exercise-generator.types";
import type { Exercise } from "../../domain/exercises/exercise.types";
import { ParticipePasseExerciseGenerator } from "./participe-passe-exercise-generator";

export class ExerciseGeneratorRegistry {
  private readonly generators: ExerciseGenerator[] = [new ParticipePasseExerciseGenerator()];

  generate(query: ExerciseGeneratorQuery): Exercise[] {
    const generator = this.generators.find((candidate) => candidate.canHandle(query));
    return generator?.generate(query) ?? [];
  }
}

export const exerciseGeneratorRegistry = new ExerciseGeneratorRegistry();
