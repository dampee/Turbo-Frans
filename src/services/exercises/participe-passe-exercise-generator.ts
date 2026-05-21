import { frenchVerbs } from "../../data/french/french-verbs";
import type { FrenchVerb } from "../../domain/french/french-verb.types";
import type { ExerciseGenerator, ExerciseGeneratorQuery } from "../../domain/exercises/exercise-generator.types";
import type {
  CrackCodeExercise,
  Exercise,
  FillBlankExercise,
  MatchPairsExercise,
  MultipleChoiceExercise,
} from "../../domain/exercises/exercise.types";
import { shuffle } from "../../shared/utils/shuffle";

export class ParticipePasseExerciseGenerator implements ExerciseGenerator {
  id = "participe-passe";

  canHandle(query: ExerciseGeneratorQuery): boolean {
    return query.learningGoal === "grammar.participe-passe";
  }

  generate(query: ExerciseGeneratorQuery): Exercise[] {
    const verbs = this.selectVerbs(query);
    if (verbs.length === 0) {
      return [];
    }

    if (query.miniGameType === "match-pairs") {
      return [this.createMatchPairsExercise(query, verbs.slice(0, Math.max(3, query.count)))];
    }

    if (query.miniGameType === "crack-code") {
      return [this.createCrackCodeExercise(query, verbs.slice(0, Math.max(3, query.count)))];
    }

    return verbs.slice(0, query.count).map((verb, index) => {
      if (query.miniGameType === "multiple-choice") {
        return this.createMultipleChoiceExercise(query, verb, index);
      }

      return this.createFillBlankExercise(query, verb, index);
    });
  }

  private selectVerbs(query: ExerciseGeneratorQuery): FrenchVerb[] {
    const matching = frenchVerbs.filter((verb) => {
      const moduleMatches = verb.moduleIds.includes(query.moduleId);
      const tagMatches = !query.tags?.length || query.tags.every((tag) => verb.tags.includes(tag));
      return moduleMatches && tagMatches;
    });

    return shuffle(matching, `${query.seed ?? "participe-passe"}-${query.miniGameType}`);
  }

  private createFillBlankExercise(
    query: ExerciseGeneratorQuery,
    verb: FrenchVerb,
    index: number,
  ): FillBlankExercise {
    return {
      id: this.exerciseId(query, verb, index),
      type: "fill-blank",
      title: "Participe passe pitstop",
      prompt: `Vul het participe passe van '${verb.infinitive}' in.`,
      sentence: verb.exampleSentence ?? `J'ai ___ (${verb.infinitive}).`,
      acceptedAnswers: [verb.participePasse],
      hint: `${verb.group === "irregular" ? "Onregelmatig werkwoord" : `Groep ${verb.group}`}: ${verb.translationNl}`,
      moduleIds: [query.moduleId],
      learningGoals: [query.learningGoal],
      points: 10,
      tags: ["participe-passe", verb.group, ...verb.tags],
      generated: true,
      source: this.id,
      speechText: (verb.exampleSentence ?? `J'ai ${verb.participePasse}.`).replace("___", verb.participePasse),
    };
  }

  private createMultipleChoiceExercise(
    query: ExerciseGeneratorQuery,
    verb: FrenchVerb,
    index: number,
  ): MultipleChoiceExercise {
    const choices = this.buildChoices(verb, query.seed ?? "choices").map((choice, choiceIndex) => ({
      id: `${this.exerciseId(query, verb, index)}-choice-${choiceIndex}`,
      text: choice,
      isCorrect: choice === verb.participePasse,
    }));

    return {
      id: this.exerciseId(query, verb, index),
      type: "multiple-choice",
      title: "Turbo-keuze",
      prompt: "Kies het juiste participe passe.",
      question: `Wat is het participe passe van '${verb.infinitive}'?`,
      choices,
      moduleIds: [query.moduleId],
      learningGoals: [query.learningGoal],
      points: 10,
      tags: ["participe-passe", verb.group, ...verb.tags],
      generated: true,
      source: this.id,
      speechText: verb.infinitive,
    };
  }

  private createMatchPairsExercise(query: ExerciseGeneratorQuery, verbs: FrenchVerb[]): MatchPairsExercise {
    return {
      id: `generated-${this.id}-${query.seed ?? "match"}-pairs`,
      type: "match-pairs",
      title: "Participe passe paren",
      prompt: "Verbind elk infinitief met het juiste participe passe.",
      pairs: verbs.map((verb) => ({
        id: `pair-${verb.infinitive}`,
        left: verb.infinitive,
        right: verb.participePasse,
      })),
      moduleIds: [query.moduleId],
      learningGoals: [query.learningGoal],
      points: 15,
      tags: ["participe-passe", "matching"],
      generated: true,
      source: this.id,
    };
  }

  private createCrackCodeExercise(query: ExerciseGeneratorQuery, verbs: FrenchVerb[]): CrackCodeExercise {
    const symbols = ["R", "A", "L", "L", "Y"];
    return {
      id: `generated-${this.id}-${query.seed ?? "code"}-crack-code`,
      type: "crack-code",
      title: "Kraak de code",
      prompt: "Elk juist participe passe opent een deel van de schatkist.",
      steps: verbs.slice(0, symbols.length).map((verb, index) => ({
        id: `code-${verb.infinitive}`,
        question: `Participe passe van '${verb.infinitive}'`,
        acceptedAnswers: [verb.participePasse],
        rewardSymbol: symbols[index] ?? "!",
      })),
      finalMessage: "Tres bien, de finish is open!",
      moduleIds: [query.moduleId],
      learningGoals: [query.learningGoal],
      points: 20,
      tags: ["participe-passe", "code"],
      generated: true,
      source: this.id,
    };
  }

  private buildChoices(verb: FrenchVerb, seed: string): string[] {
    const fakeChoices = [
      `${verb.infinitive.replace(/er$/, "")}é`,
      `${verb.infinitive.replace(/ir$/, "")}i`,
      `${verb.infinitive.replace(/re$/, "")}u`,
      `${verb.infinitive}u`,
    ];
    const pool = [
      verb.participePasse,
      ...frenchVerbs.map((candidate) => candidate.participePasse),
      ...fakeChoices,
    ].filter((value, index, all) => value && all.indexOf(value) === index);

    const shuffled = shuffle(pool, `${seed}-${verb.infinitive}`);
    const withoutCorrect = shuffled.filter((choice) => choice !== verb.participePasse);
    return shuffle([verb.participePasse, ...withoutCorrect.slice(0, 3)], `${seed}-${verb.infinitive}-final`);
  }

  private exerciseId(query: ExerciseGeneratorQuery, verb: FrenchVerb, index: number): string {
    return `generated-${this.id}-${query.seed ?? "exercise"}-${query.miniGameType}-${verb.infinitive}-${index}`;
  }
}
