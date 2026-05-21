import type { LearningModuleId } from "../learning/learning-module.types";

export type FrenchVerbGroup = "er" | "ir" | "re" | "irregular";
export type FrenchAuxiliary = "avoir" | "être";

export interface FrenchVerb {
  infinitive: string;
  translationNl: string;
  participePasse: string;
  auxiliary?: FrenchAuxiliary;
  group: FrenchVerbGroup;
  moduleIds: LearningModuleId[];
  tags: string[];
  notes?: string;
  exampleSentence?: string;
}
