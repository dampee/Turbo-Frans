# Scoring and rewards

## Score

Points are earned per mini-game and accumulated across checkpoints in a race session. The exact point values are defined in `src/services/scoring/score.service.ts`.

A `Score` object tracks:

- `totalPoints` — accumulated points for the session
- `correctAnswers` — count of exercises answered correctly
- `mistakes` — array of incorrect submissions with context

## Streaks

A streak is a run of consecutive correct answers without any mistakes in between.

`src/services/scoring/streak.service.ts` tracks:

- `currentStreak` — resets to 0 on any incorrect answer
- `bestStreak` — highest streak reached in the session

Streaks carry across checkpoints within a single race session.

## Badges

Badges are calculated once at the end of a race by `RewardService.calculateBadges()` in `src/services/scoring/reward.service.ts`. They are then saved to the student's progress record.

| Badge | Condition |
|-------|-----------|
| First Finish | Complete any race |
| Perfect Checkpoint | Answer a checkpoint with zero mistakes |
| Turbo Streak 3 | Reach a streak of 3 in a session |
| Turbo Streak 5 | Reach a streak of 5 in a session |
| Grammar Hero | Answer a participe passé exercise correctly |
| Code Cracker | Complete a crack-code checkpoint |

Badges are additive — a student can earn multiple badges in a single session.

## Per-student persistence

`src/services/storage/student-progress.storage.ts` stores:

- All-time total score and correct answers
- All-time best streak
- All-time mistakes list
- Array of earned badges (with timestamp)
- Array of completed race sessions (history)

Progress is merged after each race: new points are added to the running total, new badges are appended (duplicates not re-added), and the completed session is pushed to history.

## Extending rewards

To add a new badge:

1. Add a new entry to the `BadgeType` union in `src/domain/race/reward.types.ts`.
2. Add the earning condition to `RewardService.calculateBadges()`.
3. Add a display entry (label, icon, description) wherever badges are rendered (`RewardBadge.vue`).
