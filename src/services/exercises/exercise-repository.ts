import { staticExercises } from "../../data/exercises/static-exercises";
import type { Exercise } from "../../domain/exercises/exercise.types";
import type { Checkpoint } from "../../domain/race/track.types";
import { generatedExerciseService } from "./generated-exercise.service";

export class ExerciseRepository {
  findStaticById(exerciseId: string): Exercise | undefined {
    return staticExercises.find((exercise) => exercise.id === exerciseId);
  }

  getExerciseForCheckpoint(checkpoint: Checkpoint): Exercise | undefined {
    if (checkpoint.exerciseId) {
      return this.findStaticById(checkpoint.exerciseId);
    }

    if (checkpoint.generatorQuery) {
      return generatedExerciseService.generate(checkpoint.generatorQuery)[0];
    }

    return undefined;
  }
}

export const exerciseRepository = new ExerciseRepository();
