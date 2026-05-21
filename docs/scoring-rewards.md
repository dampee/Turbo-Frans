# Scoring and rewards

## Score

Points per exercise are defined on each `Exercise` object via the `points` field. Mini-game components apply their own scoring logic when emitting `AnswerResult.earnedPoints` — see individual components in `src/features/minigames/` to see how partial credit or bonuses work.

`ScoreService.applyResult()` in `src/services/scoring/score.service.ts` merges an `AnswerResult` into the current `Score`:

```ts
interface Score {
  points: number          // accumulated points for the session
  correctAnswers: number  // count of exercises answered correctly
  mistakes: number        // count of incorrect submissions
}
```

## Streaks

A streak is a run of consecutive correct answers without any mistakes in between.

`StreakService.applyResult()` in `src/services/scoring/streak.service.ts` updates:

```ts
interface Streak {
  current: number   // resets to 0 on any incorrect answer
  best: number      // highest streak reached in the session
}
```

Streaks carry across checkpoints within a single race session.

## Badges

Badges are calculated at the end of a race inside `RacePage.handleCompleted()` — not in `FinishPage`. When the last checkpoint completes, `RacePage` calls `rewardService.calculateBadges(session)` and saves the result before routing to the finish screen. `FinishPage` only renders the already-completed session.

The badge definitions (id, title, icon, description) live in `src/services/scoring/reward.service.ts`.

| Badge id | Condition |
|----------|-----------|
| `first-finish` | `session.completedAt` is set |
| `perfect-checkpoint` | Any result has `isCorrect && mistakes.length === 0` |
| `turbo-streak-3` | `session.streak.best >= 3` |
| `turbo-streak-5` | `session.streak.best >= 5` |
| `grammar-hero` | Any result with `exerciseId` containing `"participe-passe"` is correct |
| `code-cracker` | Any result with `exerciseId` containing `"crack-code"` is correct |

Badges are additive — a student can earn multiple badges in a single session.

## Per-student persistence

`StudentProgress` in `src/services/storage/student-progress.storage.ts` stores:

```ts
interface StudentProgress {
  studentId: string
  activeSession?: RaceSession       // in-progress race, cleared on completion
  completedSessions: RaceSession[]  // full session objects
  scoreHistory: ScoreHistoryEntry[] // lightweight summary per completed session
  streak: Streak                    // updated to best-ever on each completion
  badges: EarnedBadge[]             // deduplicated across sessions
  mistakes: string[]                // all incorrect submissions ever
}
```

There is no single "all-time total points" field. Derive it by summing `scoreHistory[].points`.

`StudentProgressStorage.completeSession()` merges a finished session: appends to `completedSessions`, pushes a `ScoreHistoryEntry`, updates `streak.best`, deduplicates new badges, and collects mistakes.

## Extending badges

To add a new badge:

1. Add a `Badge` object to the `badges` array in `src/services/scoring/reward.service.ts`.
2. Add the earning condition inside `RewardService.calculateBadges()`.
3. Add a display entry in `RewardBadge.vue` (or wherever badges are rendered) if a custom icon/label is needed.
