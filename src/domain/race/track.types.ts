import type { ExerciseGeneratorQuery } from "../exercises/exercise-generator.types";

export interface Checkpoint {
  id: string;
  title: string;
  description: string;
  exerciseId?: string;
  generatorQuery?: ExerciseGeneratorQuery;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  checkpoints: Checkpoint[];
}
