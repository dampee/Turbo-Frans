# Architecture

Rallye des Mots is a local-first Vue 3 + TypeScript SPA. No backend exists; all state lives in `localStorage`.

## Folder layout

```
src/
├── app/          # Shell and routing
├── data/         # Static data (verbs, exercises, tracks)
├── domain/       # TypeScript interfaces and types only — no logic
├── features/     # Page components and mini-game components
├── services/     # Business logic (scoring, storage, speech, exercise generation)
└── shared/       # Reusable UI components and utility functions
```

The dependency direction is strictly `features → services → domain` and `features → data`. Data files depend only on domain types; nothing in `data/` or `domain/` imports from `features/` or `services/`.

## Routing

There is no routing library. `src/app/router.ts` defines:

```ts
export type AppRoute = "students" | "race" | "finish" | "builder";
```

`App.vue` holds a `ref<AppRoute>` initialised via `getInitialRoute()`. Page components emit events (`@start-race`, `@finish`, `@back`) that `App.vue` handles by updating the ref. This keeps routing trivial and avoids URL-based state, which is appropriate for a kiosk-style app.

## State management

No state library. Each feature manages its own local `ref`s. The two pieces of shared state are:

- **Selected student** – stored in `localStorage` and re-read at startup (`selectedStudentId`).
- **Active race session** – a `RaceSession` object nested inside the per-student progress record, read and written after every checkpoint completion.

## Storage layer

All `localStorage` access goes through `src/services/storage`. Components never call `localStorage` directly.

```
LocalStorageService              ← low-level JSON read/write with typed generics
  StudentProfileStorage          ← CRUD for student profiles
  StudentProgressStorage         ← per-student stats, badges, history, activeSession
    RaceSessionStorage           ← delegates to StudentProgressStorage;
                                   no separate localStorage key for sessions
```

Keys follow the pattern `rallye-des-mots:v1:{name}` or `rallye-des-mots:v1:{name}:{id}`. The `v1` segment is reserved for future migration logic.

## Exercise pipeline

```
Track definition
  └─ Checkpoint
       ├─ exerciseId        → exerciseRepository.getExerciseForCheckpoint()
       │                         → staticExercises.find(id)
       └─ generatorQuery    → exerciseRepository.getExerciseForCheckpoint()
                                 → generatedExerciseService.generate(query)
                                       → ExerciseGeneratorRegistry
                                             → ParticipePasseExerciseGenerator
                                                   → french-verbs.ts + seeded shuffle
```

`MiniGameRenderer.vue` receives an `Exercise` and renders the appropriate mini-game component based on `exercise.type`.

## Session lifecycle

1. Student selects profile → `RaceSessionStorage.getActiveSession()` checks `StudentProgressStorage` for an in-progress session.
2. If none, a new `RaceSession` is created with empty score/streak/results and saved via `raceSessionStorage.saveActiveSession()`.
3. After each mini-game `RacePage.handleCompleted()` updates score, streak, and results, then writes the session back to storage.
4. When the last checkpoint is completed, `handleCompleted()` sets `completedAt`, calls `rewardService.calculateBadges()`, saves via `raceSessionStorage.completeSession()`, and emits `finish`.
5. `FinishPage` receives and renders the already-completed session; it does not write any data.

## Speech

`src/services/speech/speech.service.ts` wraps the Web Speech API. It checks for browser support before speaking and silently does nothing if the API is unavailable. The language is fixed to `fr-FR`.

## Seeded randomization

`src/shared/utils/shuffle.ts` exports a `shuffle(array, seed)` function that produces a deterministic order for a given seed string. Exercise generators receive a seed from the checkpoint's `generatorQuery` so the same verb set appears whenever that checkpoint is replayed. The seed comes from the track definition and is the same for all students.
