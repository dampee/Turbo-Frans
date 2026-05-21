# Exercise types

All exercise interfaces are defined in `src/domain/exercises/exercise.types.ts` as a discriminated union on the `type` field.

```ts
type Exercise =
  | FillBlankExercise
  | MultipleChoiceExercise
  | MatchPairsExercise
  | SecretWordExercise
  | CrackCodeExercise
```

## Common fields (BaseExercise)

Every exercise extends `BaseExercise`:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | `string` | Unique identifier |
| `type` | `MiniGameType` | Discriminant — drives `MiniGameRenderer` |
| `title` | `string` | Display title for the checkpoint card |
| `prompt` | `string` | Instruction shown to the student |
| `points` | `number` | Points awarded for a correct answer |
| `moduleIds` | `LearningModuleId[]` | Curriculum modules this exercise belongs to |
| `learningGoals` | `LearningGoalId[]` | Skills taught (e.g. `"grammar.participe-passe"`) |
| `tags` | `string[]` | Additional filtering metadata |
| `generated?` | `boolean` | True for programmatically generated exercises |
| `source?` | `string` | Optional origin label for generated exercises |

## FillBlankExercise

`type: "fill-blank"`

The student types a missing word into a blank inside a sentence.

```ts
{
  sentence: string          // Full sentence; the blank position is implied
  acceptedAnswers: string[] // All acceptable correct answers
  hint?: string             // Optional hint shown near the blank
  speechText?: string       // French text spoken aloud via speech synthesis
}
```

Component: `FillBlankGame.vue`

## MultipleChoiceExercise

`type: "multiple-choice"`

The student picks one answer from a list of choices.

```ts
{
  question: string
  choices: {
    id: string
    text: string
    isCorrect: boolean
  }[]
  speechText?: string
}
```

Component: `MultipleChoiceGame.vue`

## MatchPairsExercise

`type: "match-pairs"`

The student connects left-column items to right-column items.

```ts
{
  pairs: {
    id: string    // Used by MatchPairsGame to key selections
    left: string
    right: string
  }[]
}
```

The renderer shuffles the right column independently before display. All pairs must be matched to complete the exercise.

Component: `MatchPairsGame.vue`

## SecretWordExercise

`type: "secret-word"`

The student guesses a single word from a clue (Hangman-style).

```ts
{
  clue: string              // Single clue shown to the student
  answer: string            // The word to guess (French)
  revealedLetters?: number[] // Indices of pre-revealed letter positions
  speechText?: string
}
```

Component: `SecretWordGame.vue`

## CrackCodeExercise

`type: "crack-code"`

A multi-step puzzle where the student answers several sub-questions; each correct answer reveals a reward symbol that forms a code.

```ts
{
  steps: {
    id: string
    question: string
    acceptedAnswers: string[] // All acceptable correct answers for this step
    rewardSymbol: string      // Symbol revealed when this step is solved
  }[]
  finalMessage: string        // Shown when all steps are complete
}
```

Component: `CrackCodeGame.vue`

## Adding a new type

1. Add the type literal to `MiniGameType` in `exercise.types.ts`.
2. Define an interface extending `BaseExercise` with `type: "your-type"`.
3. Add it to the `Exercise` union.
4. Create `src/features/minigames/YourTypeGame.vue` — it must emit `completed` with an `AnswerResult`.
5. Add a branch in `MiniGameRenderer.vue` to render the new component.

## AnswerResult

Every mini-game emits this on completion (`src/domain/exercises/exercise-result.types.ts`):

```ts
{
  exerciseId: string    // ID of the completed exercise
  isCorrect: boolean
  earnedPoints: number
  mistakes: string[]    // Each incorrect submission the student made
  usedHint: boolean
  completedAt: string   // ISO date string
}
```

The race session records this per checkpoint. `ScoreService.applyResult()` uses `earnedPoints` and `isCorrect`; the actual point amount comes from the exercise's `points` field and the mini-game's scoring logic.

## Answer normalization

`src/shared/utils/normalizeAnswer.ts` applies `.trim()` and `.toLocaleLowerCase("fr-FR")` before comparing answers. This handles case differences with French locale awareness but does **not** strip or normalize diacritics — `mangé` and `mange` are still treated as different answers. Mini-game components should normalize both the student answer and the accepted answers before comparing.
