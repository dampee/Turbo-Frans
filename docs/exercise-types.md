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

## Common fields

Every exercise has:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | `string` | Unique identifier |
| `type` | `MiniGameType` | Discriminant — drives `MiniGameRenderer` |
| `moduleIds` | `string[]` | Curriculum modules this exercise belongs to |
| `learningGoals` | `LearningGoal[]` | Skills taught (e.g. `"grammar.participe-passe"`) |
| `tags` | `string[]` | Additional filtering metadata |

## FillBlankExercise

`type: "fill-blank"`

The student types missing words into blanks inside a sentence.

```ts
{
  sentence: string        // Full sentence; blanks are marked with ___
  blanks: {
    answer: string        // Expected text for each blank (in order)
    hint?: string         // Optional hint shown near the blank
  }[]
  speakText?: string      // French text spoken aloud via speech synthesis
}
```

Component: `FillBlankGame.vue`

## MultipleChoiceExercise

`type: "multiple-choice"`

The student picks one answer from a list of options.

```ts
{
  question: string
  options: string[]       // All choices including the correct one
  correctAnswer: string   // Must match one element of options exactly
  speakText?: string
}
```

Component: `MultipleChoiceGame.vue`

## MatchPairsExercise

`type: "match-pairs"`

The student connects left-column items to right-column items.

```ts
{
  pairs: {
    left: string
    right: string
  }[]
}
```

The renderer shuffles the right column independently before display. All pairs must be matched to complete the exercise.

Component: `MatchPairsGame.vue`

## SecretWordExercise

`type: "secret-word"`

The student guesses a word letter by letter (Hangman-style) based on clues.

```ts
{
  word: string            // The word to guess (French)
  clues: string[]         // Clues shown progressively
  speakText?: string
}
```

Component: `SecretWordGame.vue`

## CrackCodeExercise

`type: "crack-code"`

A multi-step puzzle where the student answers several sub-questions; each correct answer reveals one digit of a code.

```ts
{
  steps: {
    question: string
    answer: string
    digit: string         // Single character revealed on correct answer
  }[]
  codeLength: number      // Total digits in the final code
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

Every mini-game emits this on completion:

```ts
{
  correct: boolean
  pointsEarned: number
  answer: string          // What the student actually submitted
  expectedAnswer: string  // What was expected
}
```

The race session records this per checkpoint.

## Answer normalization

`src/shared/utils/normalizeAnswer.ts` applies `toLocaleLowerCase("fr-FR")` and trims whitespace before comparing answers. This handles French accents and case differences consistently. All mini-game components should normalize answers before emitting `AnswerResult`.
