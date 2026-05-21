# Rallye des Mots

## Documentation

- [Architecture](docs/architecture.md) — folder layout, routing, storage, session lifecycle
- [Exercise types](docs/exercise-types.md) — all mini-game interfaces and how to add a new type
- [Content guide](docs/content-guide.md) — adding verbs, static exercises, checkpoints, and tracks
- [Scoring & rewards](docs/scoring-rewards.md) — points, streaks, badges, and per-student persistence

A local-first Vue 3 + TypeScript educational racing game for children learning French. Students select a profile, complete mini games at checkpoints, earn points and badges, and finish the track.

## Run the app

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Student profiles

At startup the app shows existing student profiles from `localStorage`. Create a new profile by entering a name on the student selection screen. Selecting a profile stores the selected student id and starts or resumes that student's active race.

Each student has separate progress, active session, completed sessions, score history, streak, badges and mistake history.

## Add a new static exercise

Add an object to [src/data/exercises/static-exercises.ts](src/data/exercises/static-exercises.ts). Exercises use the discriminated union in [src/domain/exercises/exercise.types.ts](src/domain/exercises/exercise.types.ts).

Then point a checkpoint to it from [src/data/tracks/tracks.ts](src/data/tracks/tracks.ts):

```ts
{
  id: "checkpoint-new",
  title: "Nieuwe bocht",
  description: "Een nieuwe oefening.",
  exerciseId: "your-static-exercise-id",
}
```

## Add a new verb

Add a `FrenchVerb` to [src/data/french/french-verbs.ts](src/data/french/french-verbs.ts). The internal builder page can help create the object:

1. Open the app.
2. Click `Open interne builder` or `Builder`.
3. Fill in the participe passe form.
4. Copy the JSON into the TypeScript source file.

## Add a generated exercise type

Generated exercises are handled by [src/services/exercises/exercise-generator-registry.ts](src/services/exercises/exercise-generator-registry.ts). Add a class implementing `ExerciseGenerator`, then register it in the registry.

The current MVP includes `ParticipePasseExerciseGenerator`, which supports queries like:

```ts
{
  moduleId: "casse-cou-5-module-5",
  learningGoal: "grammar.participe-passe",
  miniGameType: "fill-blank",
  count: 5,
}
```

## Add a new mini game

1. Add the new mini game type to `MiniGameType` in [src/domain/exercises/exercise.types.ts](src/domain/exercises/exercise.types.ts).
2. Add a specific exercise interface to the same file.
3. Create a Vue component in `src/features/minigames`.
4. Render it from [src/features/minigames/MiniGameRenderer.vue](src/features/minigames/MiniGameRenderer.vue).
5. Emit `completed` with an `AnswerResult`.

## localStorage keys

The storage layer is centralized under `src/services/storage`; components should not call `localStorage` directly.

Current versioned keys:

- `rallye-des-mots:v1:student-profiles`
- `rallye-des-mots:v1:selected-student-id`
- `rallye-des-mots:v1:student-progress:{studentId}`

The version segment is reserved for future migrations.

## Implemented MVP

- Student profile selection and creation.
- Per-student local progress.
- Playable race with checkpoints.
- Fill blank, multiple choice, match pairs, secret word and crack-code mini games.
- Data-driven static exercises.
- Dynamic participe passe generation from verb source data.
- Browser speech synthesis through `speechService.speakFrench`.
- Score, streak, badge and mistake tracking.
- Internal builder page for participe passe verb data.

## Intentionally not implemented yet

- Backend storage.
- Authentication.
- Teacher profiles or class management.
- AI exercise generation.
- Advanced curriculum accuracy for all participe passe rules.
- Full routing library; the MVP uses a small internal route state.
- Migration logic for older `localStorage` versions.
