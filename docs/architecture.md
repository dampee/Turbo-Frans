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

There is no routing library. `App.vue` holds a `route` ref typed as:

```ts
type Route = "students" | "race" | "finish" | "builder"
```

Page components emit events (`@start-race`, `@finish`, `@back`) that `App.vue` handles by updating `route`. This keeps routing trivial and avoids URL-based state, which is appropriate for a kiosk-style app.

## State management

No state library. Each feature manages its own local `ref`s. The two pieces of shared state are:

- **Selected student** – stored in `localStorage` and re-read at startup (`selectedStudentId`).
- **Active race session** – a `RaceSession` object read from and written to `localStorage` after every checkpoint completion.

## Storage layer

All `localStorage` access goes through `src/services/storage`. Components never call `localStorage` directly.

```
LocalStorageService          ← low-level JSON read/write with typed generics
  StudentProfileStorage      ← CRUD for student profiles
  StudentProgressStorage     ← per-student stats, badges, history
  RaceSessionStorage         ← active session read/write
```

Keys follow the pattern `rallye-des-mots:v1:{name}` or `rallye-des-mots:v1:{name}:{id}`. The `v1` segment is reserved for future migration logic.

## Exercise pipeline

```
Track definition
  └─ Checkpoint
       ├─ exerciseId        → ExerciseRepository.getById(id)
       │                         → static-exercises.ts
       └─ generatorQuery    → ExerciseGeneratorRegistry.generate(query)
                                 → ParticipePasseExerciseGenerator (only current impl)
                                       → french-verbs.ts + seeded shuffle
```

`MiniGameRenderer.vue` receives an `Exercise` and renders the appropriate mini-game component based on `exercise.type`.

## Session lifecycle

1. Student selects profile → `RaceSessionStorage` is checked for an in-progress session.
2. If none, a new `RaceSession` is created with all checkpoints in `pending` state.
3. After each mini-game the session is updated (score, streak, result per checkpoint) and written back to storage.
4. When the last checkpoint is completed the session is marked `complete` and the app routes to `FinishPage`.
5. `FinishPage` calls `RewardService.calculateBadges()` and saves the session to history.

## Speech

`src/services/speech/speech.service.ts` wraps the Web Speech API. It checks for browser support before speaking and silently does nothing if the API is unavailable. The language is fixed to `fr-FR`.

## Seeded randomization

`src/shared/utils/shuffle.ts` exports a `shuffle(array, seed)` function that produces a deterministic order for a given seed. Exercise generators receive a seed from the checkpoint definition so the same student always sees the same verb set for a given checkpoint — important for fairness and reproducibility when a student pauses and resumes.
