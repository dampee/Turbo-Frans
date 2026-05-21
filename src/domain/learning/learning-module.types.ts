export type LearningModuleId = string;

export interface LearningModule {
  id: LearningModuleId;
  title: string;
  source: "casse-cou";
  schoolYear: "5";
  moduleNumber: number;
  description?: string;
}
