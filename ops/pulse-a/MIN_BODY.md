# Pulse quality gates (keep in sync)

- `ops/pulse-a/run.ts` — `MIN_BODY_CHARS = 1100`
- `ops/pulse-a/ai.ts` — `parseAiOutput` should reject only if `textLen < 1100` (not 1800)
- `isWeakTitle` — prefer `length < 24` and word count `< 5`
- Break partial loop when `partial.length > 900` and TITLE present

If AI still fails, run workflow **seed-broad** to publish ghostwriting / music / tutoring seeds.
