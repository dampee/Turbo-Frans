import type { Track } from "../../domain/race/track.types";

export const tracks: Track[] = [
  {
    id: "casse-cou-5-module-5-rally",
    title: "Rallye des Mots",
    description: "Race langs woordenschat en participe passe checkpoints.",
    moduleId: "casse-cou-5-module-5",
    checkpoints: [
      {
        id: "checkpoint-animals",
        title: "Startbocht",
        description: "Warm op met woordparen.",
        exerciseId: "static-animals-match-1",
      },
      {
        id: "checkpoint-fill",
        title: "Tunnel van de zinnen",
        description: "Vul het juiste participe passe in.",
        generatorQuery: {
          moduleId: "casse-cou-5-module-5",
          learningGoal: "grammar.participe-passe",
          miniGameType: "fill-blank",
          count: 1,
          seed: "track-fill",
        },
      },
      {
        id: "checkpoint-choice",
        title: "Turbo-keuze",
        description: "Kies de juiste vorm.",
        generatorQuery: {
          moduleId: "casse-cou-5-module-5",
          learningGoal: "grammar.participe-passe",
          miniGameType: "multiple-choice",
          count: 1,
          seed: "track-choice",
        },
      },
      {
        id: "checkpoint-match",
        title: "Haarspeldbocht",
        description: "Match infinitief en participe passe.",
        generatorQuery: {
          moduleId: "casse-cou-5-module-5",
          learningGoal: "grammar.participe-passe",
          miniGameType: "match-pairs",
          count: 1,
          seed: "track-match",
        },
      },
      {
        id: "checkpoint-code",
        title: "Codefinish",
        description: "Kraak de eindcode.",
        generatorQuery: {
          moduleId: "casse-cou-5-module-5",
          learningGoal: "grammar.participe-passe",
          miniGameType: "crack-code",
          count: 1,
          seed: "track-code",
        },
      },
    ],
  },
];
