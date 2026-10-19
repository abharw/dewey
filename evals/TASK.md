# Unscaffolded opening-response baseline

Status: agent-authored development pilot; not a validated learning benchmark.

This document describes the original eight opening-response cases. The newer [golden-interaction suite](golden/README.md) uses the same runner with fixed conversation histories and case-specific judges; it tests different behavior and keeps its results separate.

The question is **what different models do when someone asks for help learning, before Dewey supplies a teaching policy**. We want to observe existing behavior before deciding which missing capabilities need prompts, tools, memory, or other harness support.

## Controlled input

Use the eight fictional inputs in [baseline.json](baseline.json), unchanged across target models. Send only each record's `prompt` as a user message. The target model receives:

- No system prompt or agent instructions.
- No tools, conversation history, learner profile, proficiency definitions, or teaching scaffold.
- No horizon label, diagnostic opportunity, or rubric from the case record.

Providers can still apply their own hidden defaults and safety behavior. “No system prompt” describes our request, not a claim that the underlying service is completely unconditioned.

Each case begins a fresh conversation. The cases are deliberately natural and underspecified: deciding what is already clear and what needs discovery is part of the behavior under observation. Do not insert directions such as “assess my prior knowledge” into the visible input.

## Cases and variation

| Case | Horizon | What the opening can reveal |
| --- | --- | --- |
| HTTP 404 | Immediate | Answers a bounded question directly without unnecessary onboarding |
| Training accuracy | Immediate | Uses a volunteered misconception without assuming global inability |
| AI vendor comparison | Short-term | Connects a two-week work goal to meaningful choices and checking |
| System-design interview | Short-term | Starts deadline-driven preparation while leaving room for unknown experience and format |
| ML fundamentals | Long-term | Begins a months-long interest without presuming a prerequisite inventory or fixed goal |
| Spanish conversation | Long-term | Starts useful practice while respecting what text can and cannot reveal |
| Drawing | Unspecified | Makes progress actionable without imposing an aesthetic goal or endpoint |
| Better at AI | Unspecified | Helps clarify an open request without requiring the learner to define the whole problem |

These are representative contrasts, not a balanced sample of all learners or domains. Current metadata uses the simplified horizon vocabulary; saved runs retain their original case snapshots and labels. Horizon is the time context of the request, not a proficiency level. The drawing and broad AI requests supply no timeframe, so their horizons remain unspecified unless the conversation supplies more information. The research's profile-update cases address a different question; do not merge their expected conclusions into these user prompts.

## What to inspect

Keep observable behavior separate from judgments about its appropriateness:

- Does the reply make a useful start? What can the learner do or understand next?
- Does it provide an opportunity to discover the learner's starting point or purpose **when this would matter**? Is the opportunity a concrete task or decision, a focused question, or only a request for self-ratings?
- What does it assume? Is an assumption provisional and easy to revise, or asserted as known?
- What burden does it place on the learner before helping? Is that burden justified by this request?
- Is the response proportionate to the request's horizon and specificity?

Questioning is not universally desirable. The HTTP case should normally get a direct answer. The misconception case already contains evidence worth using. A long list of questions is not automatically better diagnosis, and a long plan is not automatically more useful teaching. There can be several defensible openings for a case.

## Independent judging

Run evaluation only after saving the target response. The evaluator can receive the original user prompt, target response, hidden diagnostic opportunity, and case rubric. The target model must never receive the evaluator's rubric or feedback during this baseline.

Use Pydantic Evals' supported judge interface. Preserve per-case judgments and their reasons alongside the raw response. Keep requested model identity out of the judge's text input where practical; store it in the run record for comparison. Blind judging reduces one avoidable source of bias but does not validate the judge.

Inspect examples manually, including strong replies, flagged failures, disagreements, and at least the direct-answer control. Check that the judge does not reward questioning in every case. Treat evaluator ratings as proposed readings of observable responses. Do not turn them into Familiar, Capable, Fluent, or Expert learner labels, or into a claim that the person learned anything.

## Run provenance and validity

Record the exact prompts and dataset version or hash; requested and reported model identifiers; actual request settings; SDK versions; run time; wall-clock latency; usage and cost information when available; raw messages and outputs; and the evaluator model, rubric, settings, verdict, and reason. Do not log credentials.

Hold the harness and request conditions constant across models where the APIs permit, and disclose settings that differ or remain provider defaults. A response limit can affect content; mark truncation. A provider may change behavior behind an identifier, so timestamp results and preserve any reported version metadata. Do not silently replace a failed target model with another model.

Infrastructure failures, unavailable models, rate limits, and malformed or truncated responses must be identifiable separately from pedagogical judgments. Preserve failures rather than removing inconvenient cases. Judge failures should remain missing judgments, not become target-model failures. Latency here measures the observed request under current routing and load, not an intrinsic teaching speed.

## What this pilot cannot establish

This is a **single-turn opening-response** comparison. The horizon varies in the request; the experiment does not actually run for those durations. There is no learner sequel, retention test, profile update, or observed work beyond the initial statement. A proposed diagnostic question does not prove that the model would interpret the answer correctly or adapt well.

The pilot can reveal candidate model differences under one minimal harness. It cannot by itself isolate a harness effect, establish general model rankings, or measure learning outcomes. One trial is also sensitive to sampling variability. Follow up promising or concerning patterns with repeated cases, fixed continuation tests, and then a controlled harness ablation that changes one feature while holding model, inputs, and review procedure constant.

The first result should be a list of **observed behaviors, concrete failure examples, and the smallest next experiment**, rather than a universal tutor score or a mandatory teaching script. Research motivation: understanding and discovery and capability principles.
