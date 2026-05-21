export interface VocabularyItem {
  id: string;
  french: string;
  dutch: string;
  moduleIds: string[];
  learningGoals: string[];
  tags: string[];
}

export const vocabulary: VocabularyItem[] = [
  {
    id: "animal-chat",
    french: "le chat",
    dutch: "de kat",
    moduleIds: ["casse-cou-5-module-1"],
    learningGoals: ["vocabulary.animals"],
    tags: ["animals"],
  },
  {
    id: "color-rouge",
    french: "rouge",
    dutch: "rood",
    moduleIds: ["casse-cou-5-module-2"],
    learningGoals: ["vocabulary.colors"],
    tags: ["colors"],
  },
];
