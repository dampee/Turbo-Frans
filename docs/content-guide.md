# Content guide

This page explains how to add French content to the game: verbs, exercises, and tracks.

## Adding a verb

Verbs live in `src/data/french/french-verbs.ts` as `FrenchVerb` objects.

The fastest way to generate the correct JSON is the built-in builder:

1. Start the dev server (`npm run dev`).
2. Open the app and click **Builder** (or navigate to the builder route).
3. Fill in the participe passé form.
4. Copy the generated JSON into `french-verbs.ts`.

A `FrenchVerb` object looks like:

```ts
{
  infinitive: "manger",
  participePasse: "mangé",
  auxiliaire: "avoir",
  moduleId: "casse-cou-5-module-5",
  learningGoal: "grammar.participe-passe",
}
```

Once the verb is in the list it becomes available to `ParticipePasseExerciseGenerator` and will appear in generated checkpoints that query for `"grammar.participe-passe"`.

## Adding a static exercise

Static exercises live in `src/data/exercises/static-exercises.ts`.

Add a new object matching the relevant interface from `src/domain/exercises/exercise.types.ts`. See [exercise-types.md](exercise-types.md) for all fields.

Example — a match-pairs exercise:

```ts
{
  id: "animals-match-1",
  type: "match-pairs",
  moduleIds: ["casse-cou-5-module-1"],
  learningGoals: ["vocabulary.animals"],
  tags: ["animals", "basic"],
  pairs: [
    { left: "le chat", right: "de kat" },
    { left: "le chien", right: "de hond" },
    { left: "le lapin", right: "het konijn" },
  ],
}
```

## Adding a checkpoint to a track

Checkpoints are defined in `src/data/tracks/tracks.ts`. A checkpoint can reference either a static exercise or a generator query.

**Static exercise:**

```ts
{
  id: "checkpoint-animals",
  title: "Dierenhoek",
  description: "Koppel de dieren aan hun Nederlandse naam.",
  exerciseId: "animals-match-1",
}
```

**Generated exercise:**

```ts
{
  id: "checkpoint-participe-passe",
  title: "Tunnel van de zinnen",
  description: "Vul het participé passé in.",
  generatorQuery: {
    moduleId: "casse-cou-5-module-5",
    learningGoal: "grammar.participe-passe",
    miniGameType: "fill-blank",
    count: 5,
    seed: 42,          // Deterministic order per student/session
  },
}
```

The `seed` field ensures the same verbs appear each time a student retries or resumes this checkpoint.

## Adding a track

A `Track` in `tracks.ts` contains:

```ts
{
  id: "rallye-des-mots",
  title: "Rallye des Mots",
  checkpoints: [/* ordered list of CheckpointDefinition */],
}
```

Checkpoints are played in array order. The race ends after the last checkpoint.

## Curriculum modules

Module IDs (e.g. `"casse-cou-5-module-5"`) come from `src/data/learning/casse-cou.modules.ts`. When adding content for a new module, register the module there first, then use its ID in exercises and verbs.

Learning goals follow dot-notation: `"grammar.participe-passe"`, `"vocabulary.animals"`, etc. These can be extended freely — just use the same string consistently in verbs, exercises, and generator queries.
