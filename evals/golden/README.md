# Golden-interaction checkpoints

Status: **160 live responses, 328 completed automated judgments, and qualitative assistant review.** See the [dated comparison](../../results/golden-comparison.md) for raw counts, judge disagreements, and limitations. The [casebook](../../docs/golden-interactions.md) describes 12 desired experiences across use cases and horizons. This development suite tests 20 selected decision points from them. Neither is evidence that people learned.

Offline verification on October 11, 2026: 13 tests and Ruff passed. A mocked HTTP pass over all cases twice checked 40 exact target requests for history isolation and hidden-rubric exclusion. Mock judging exercised 82 assertions; the 21 calibration anchors exercised 44 expected assertions. Those checks verify request and evaluation plumbing, **not model behavior or judge accuracy**.

The first opening-response pilot found that models often offer diagnosis, examples, and useful explanations already. Its broad judge also passed questionable replies. This suite moves from “does the opening sound helpful?” to specific decisions with relevant context available.

## What the target receives

Each record in [checkpoints.json](checkpoints.json) contains:

| Field | Visible to target? | Purpose |
| --- | --- | --- |
| `history` | Yes | Fixed, authored user/assistant turns before this checkpoint |
| `prompt` | Yes | The next learner message |
| `id`, `domain`, `horizon` | No | Comparison and coverage metadata; horizon records timeframe only |
| `diagnostic_opportunity` | No | What the author wants to investigate |
| `rubric`, `judge_criteria` | No | Case-specific review criteria |

There is **no teaching system prompt, tool, learner-profile injection, proficiency vocabulary, or golden answer** in the target request. Earlier assistant turns are part of the controlled conversation, so these are not context-free models; that is intentional. Some prior assistant turns are mistaken. The test is whether the next response handles the evidence and current request well.

Pydantic AI receives native message history. Every case/model/repetition starts from a fresh copy of the authored history and generates one response. No previous target response carries into another checkpoint. Opening controls have an empty history.

These are **frozen decision points**, not a simulated multi-session learner. A scripted learner reply is never forced to follow an incompatible model-generated answer. We can later test full trajectories with responsive learners once the individual decisions and environment are understood.

## Coverage and contrasts

| Case family | Checkpoints | What can be observed now |
| --- | --- | --- |
| G01 | `quick-answer` | Concise factual help without onboarding; does not test a later stop message |
| G02 | `find-purpose`, `purpose-pivot` | A useful start and abandoning an assumed goal when corrected |
| G03 | `vendor-judgment`, `vendor-assisted`, `vendor-term-change` | Attribution with identical final totals; changing a prior conclusion |
| G04 | `interview-guide`, `interview-explain` | Same problem, different requested assistance |
| G05 | `ml-attribution`, `ml-transfer` | Correcting a prior claim and addressing a new overgeneralization |
| G06 | `spanish-deadline`, `spanish-repair` | Changing the activity, then supplying a requested phrase |
| G07 | `astronomy-return` | Revisiting an idea without imposing a course or assuming regression |
| G08 | `poem-intent` | Revising critique against a stated intent using a visible artifact |
| G09 | `visual-pending`, `visual-ready` | Responding to different reported presentation states |
| G10 | `deadline-shift`, `assisted-success` | Changing help under urgency; interpreting assisted delivery |
| G11 | `revise-experiment` | Updating a causal interpretation when assignment details change |
| G12 | `algebra-bridge` | Explaining the useful relationship without an unrelated prerequisite path |

IDs have the lowercase family prefix, for example `g03-vendor-assisted`. They link back to the casebook. The strongest matched pairs are G03 attribution, G04 requested assistance, and G09 readiness; they keep the underlying situation stable while changing a consequential condition. Other checkpoints are related examples, not perfectly controlled causal contrasts.

[Horizon](../../docs/vocabulary/README.md#horizon) uses Immediate, Short-term, and Long-term. Label only the timeframe supported by the supplied context; a broader goal can remain unspecified. Exact deadlines and goal completion are facts, not additional horizon categories.

Text is the entire environment. Proposal amounts and experiment counts are supplied fictional facts. The poem is a real authored text artifact. Reported source checking is not observed browser activity. The visual cases contain **learner-reported status text, no image, screen, or actual tool event**. Do not call their result a perception or presentation test.

## What the judge decides

Each case has two bounded, positively phrased assertions; the memory-correction case has a third for storage honesty. There are 41 assertions per model/repetition across the 20 checkpoints. These replace the original pilot's generic opening criteria for this suite.

Assess useful decisions, factual care, response to new evidence or requests, and attribution. Different wording, methods, and teaching approaches can pass. Do not reward questions, terminology, confidence, or length on their own. A focused Socratic question must be allowed where it is a valid next move; it need not disclose the answer to pass. A request for explanation should receive one.

Each judge call receives the visible conversation, the saved target response, and **one** of that case's hidden criteria. The general case rubric is excluded from these calls so a failure on one dimension does not automatically fail the others. The judge does not receive the target model name in its text input. Every verdict requires a reason citing a concrete phrase or omission. Cases remain inspectable separately; averaging different assertions does not create a universal tutor score.

[calibration.json](calibration.json) contains assistant-authored anchors, including plausible wrong answers and valid alternatives: correct totals with wrong credit, helpful teaching with a fabricated memory write, a good hint, unwanted solution disclosure, and stale or invented visual state. These are draft judgments to inspect, **not independently validated ground truth**. They concentrate on known risks and do not calibrate every case family. Inspect disagreements before relying on scores; even perfect agreement on these anchors would not prove reliability everywhere. The first revised calibration matched 41/44 labels, with three overlapping-criterion disputes retained in the report; scores remain review flags rather than a validated ranking.

Before drawing conclusions, manually inspect every flagged failure, disagreements between repeats, each matched pair, the direct-answer control, and a sample of passes. Revise an ambiguous rubric rather than forcing a model to match a preferred script. Preserve the old fixture hash when rerunning; do not silently change what was measured.

## Run it

From the repository root, use the existing Pydantic AI / Pydantic Evals path. No new service or simulator is needed. Check availability with `uv run dewey models`; model IDs below come from the earlier dated pilot, not a guarantee of future availability.

```bash
uv run pytest -q
uv run ruff check src tests

PYDANTIC_AI_NO_BANNER=1 uv run dewey calibrate \
  --fixtures evals/golden/calibration.json \
  --model anthropic/claude-opus-5.5 --max-tokens 2000 \
  --out runs/golden-calibration-01
```

Start with one model and one case to verify routing. Then compare the same suite across models with repeated trials:

```bash
PYDANTIC_AI_NO_BANNER=1 uv run dewey run \
  --cases evals/golden/checkpoints.json \
  --model openai/gpt-6.1-sol \
  --model anthropic/claude-sonnet-5.5 \
  --model google/gemini-3.8-flash \
  --model deepseek/deepseek-v4.1-flash \
  --repeats 2 --max-estimated-usd 8 --out runs/golden-01

PYDANTIC_AI_NO_BANNER=1 uv run dewey judge runs/golden-01 \
  --model anthropic/claude-opus-5.5 --max-tokens 2000 \
  --out runs/golden-judgments-01
```

The complete example makes 160 target calls and up to 328 judge calls, plus 44 calls per calibration. Use `--limit` for a smaller first pass, keeping matched pairs together. The command explicitly allows an $8 planned generation cost at the checked catalog prices; the CLI default remains $5 and can refuse a larger plan. Judge calls have token/time limits but no account spend cap. Do not silently raise the allowance or substitute a model after a failure.

All model calls use only `AI_GATEWAY_API_KEY`. Outputs go to new local folders. Exact case snapshots, source hashes, actual requests, provider IDs, usage, elapsed response time, errors, and judge audit transcripts are retained. Authored assistant turns are not counted as newly generated model usage.

## How a result becomes a harness decision

| Observation to reproduce | Smallest comparison | What the result would justify |
| --- | --- | --- |
| A model chooses poorly despite complete relevant context | Same inputs, repeats, another model, inspect judgments | Consider model selection or a narrow instruction; a memory system cannot supply facts already present |
| Full transcript works but our retained summary fails | Same model and checkpoint; full evidence versus faithful summary versus current retrieval | Fix what is stored/retrieved, preserving who did what; do not label missing context a teaching failure |
| Different methods work until a rigid instruction is added | Same model/cases with and without that one instruction | Remove or narrow the scaffold; preserve the quick-answer and changed-help controls |
| The model reasons correctly about reported readiness but narrates a real stale screen | Inspect actual event delivery, artifact version, display state, and transcript | Add or fix observation/readiness plumbing if state was missing or stale; test model behavior if it ignored correct delivered state |
| Correct attribution is stated but lost next session | Inspect actual profile write and a fresh-session read | Fix persistence/retrieval, not prose alone |
| Generic advice succeeds but work observation is needed | Supply actual artifact/tool access in a representative task | Add the specific observation or execution capability; verify the action and result |
| Good next replies do not help actual learners | Observe learner work and later relevant attempts under real conditions | Reconsider the activity or pedagogy; reply scores are not learning outcomes |

These comparisons after the baseline are a plan, not implemented experimental conditions. Add **one** change at a time, record it exactly, and retain helpful behaviors that already work. A result may justify deleting a constraint rather than adding a feature.

## Reading the first comparison

The result should be an evidence table: case and repeat, model/configuration, exact response, assertion verdicts and reasons, human review, request latency, failure category, and the smallest next experiment. Keep these failure categories distinct:

- **Model decision:** relevant evidence was delivered, but the response mishandled it.
- **Context or runtime:** required information/action was unavailable, stale, or incorrectly delivered.
- **Judge or fixture:** the criterion rejected a valid alternative, accepted a flawed response, or the authored setup was unclear.
- **Request failure:** unavailable model, rate limit, timeout, invalid response, or truncation. This is not a pedagogical failure.

Repeated checkpoints can identify promising behaviors and reproducible weaknesses. They cannot estimate learning gains, retention, general proficiency, complete conversation quality, or universal model rankings. All scenarios are a development set; author and hold out new families before making broader claims.
