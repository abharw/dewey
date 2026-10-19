# Record fields

Use this reference when creating or changing learner records. It owns the field contract; [Workspace and sessions](workspace.md) owns layout, navigation, and lifecycle, and [Vocabulary](vocabulary.md) defines the learning terms.

## Shared conventions

The root `README.md` is navigation prose with no frontmatter. Every other record described here starts with YAML frontmatter containing a stable `id` and a `type`. IDs are unique within the learner workspace; preserve them when titles change. Optional `aliases` is a list of alternative names for discovery.

Resolve every local path from the file containing it, including paths in YAML. Link directly to files and headings; IDs identify records and do not require a custom resolver. A path with `#heading-slug` identifies supporting body content. Preserve referenced headings or update their incoming links when changing them.

Keep fields defined as frontmatter in the header; milestone and source-entry fields explicitly belong in the goal body. Put purpose, observations, attribution, uncertainty, and handoff detail in the body instead of repeating header values in prose. When a field is accidentally duplicated, reconcile the prose with its authoritative location. Omit optional fields when unknown or unused; do not fill them with guesses or placeholder values. All example dates and content below are illustrative.

## Learner profile

`learner.md` uses `type: profile` and has no additional required fields. Optional `reported_context` is a list of reports, each with `fact` and `source`; include `reported_at` when known. The source may be a relative path, external URL, or attributed direct report. Optional `preferences` is a list of relative paths to focused preference notes. The body holds relevant context and nuance; distinguish reports, observed evidence, and inference.

```markdown
---
id: learner
type: profile
reported_context:
  - fact: Maintains a service and wants to reason about slow requests.
    source: sessions/networking/2026-10-11-01.md#context
    reported_at: "2026-10-11"
---

# Learner

Use the service context when it helps the current goal.
```

## Goal

`goals/<slug>.md` uses `type: goal`.

| Field | Contract |
|---|---|
| `status` | Required: `active`, `paused`, `completed`, or `retired`. Start at `active`; change it when the learner's goal state changes. A completed goal is distinct from a closed session or a proficiency level. |
| `horizon` | Optional. `Immediate`, `Short-term`, or `Long-term`. Keep a known deadline in the body. |
| `targets` | Optional list. Each item has `scope` and `proficiency`; add `conditions` when known. Use a proficiency label only when the intended capability supports it. An interest alone does not supply one. |
| `proficiency_records` | Optional list of relative paths to relevant topic proficiency records. |
| `latest_session` | Optional relative path to the latest session. Add it only after that session exists. |

The body states the learner's purpose, constraints, current direction, and useful links. During discovery, distinguish known information from unresolved questions and a provisional path. Continuing goals use the [milestone format](#learning-path-and-milestones) below. Targets describe desired capability; the linked proficiency records own current assessments.

```markdown
---
id: goal-networking
type: goal
status: active
horizon: Short-term
targets:
  - scope: Diagnose when retries worsen service overload.
    proficiency: Capable
    conditions: With service metrics and reference documentation available.
proficiency_records:
  - ../knowledge/proficiency/networking.md
latest_session: ../sessions/networking/2026-10-11-01.md
---

# Networking

Prepare to discuss slow requests in the learner's service.
Next, test whether the same reasoning holds when retries use backoff.
```

## Learning path and milestones

Keep the path in the goal body under `## Learning path`. Start with a short account of how the capabilities combine to serve the goal; identify provisional assumptions. Each milestone uses a stable heading such as `### m1`, followed by the fields below as ordinary Markdown. Keep the heading identifier when its wording or position changes. A milestone can span sessions; a session can contribute to several milestones.

| Field | Contract |
|---|---|
| `Capability` | The useful thing the learner will be able to understand, judge, or do. |
| `Status` | `planned`, `active`, `achieved`, or `retired`. Planned means not started; active means work is underway; achieved means linked observations satisfy the completion conditions; retired means removed from this path with a reason. |
| `Complete when` | Observable performance under stated conditions, including permitted assistance. Distant criteria can be provisional; refine them before relying on them for achievement. |
| `Why here` | The agent's rationale connecting this capability and its position to the purpose and relevant learner evidence. Keep inferred dependencies distinct from sourced requirements. |
| `Grounding` | Links to relevant inspected source entries in this goal, or an explicit unverified gap while the milestone remains provisional. |
| `Progress` | Brief account of what has been demonstrated and what remains, with links to session observations and material assistance. Use “Not attempted” when appropriate. |
| `Depends on` | Optional links to milestone headings with a short reason. Ordering alone does not establish a prerequisite. |
| `Materials` | Optional selected learner reading, tools, or activities, with purpose. Sources used only for teacher preparation need not be assigned. |

Save source entries under `## Sources`, with stable headings such as `### s1`. Each entry has a descriptive link to the actual resource (or local material), the section/page inspected, `Checked` date, and `Supports` describing its relevant claim and scope. Record edition, version, or publication/update date when it matters. Reusing previously verified material preserves its actual inspection date. Link these entries from milestone `Grounding`; source authority is separate from learner evidence and planning judgment.

The following is a structural example; inspect the source before recording it in a real learner workspace. Its learner observation and date are illustrative.

```markdown
## Learning path

Develop error judgment, then evaluation design, then a combined trial decision.
Later milestones remain provisional until we see how the first one develops.

### m1

Capability: Judge when a classification result hides costly mistakes.
Status: active
Complete when: Given a results table and business consequences, explain a
misleading accuracy claim and justify what else to check, using AI and references.
Why here: The learner wants to judge routing decisions and initially trusted
overall accuracy. Error consequences are the next useful distinction.
Grounding: [Classification metrics](#s1).
Progress: Distinguished suspicion from proof in a tutor-supplied case
([observation](../sessions/ai-routing/session-02.md#case-judgment));
evaluation-level judgment remains unobserved.

## Sources

### s1

[Google ML Crash Course: classification metrics](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall)
Sections: Accuracy; Choice of metric and tradeoffs.
Checked: 2026-10-11.
Supports: Error costs and class balance affect metric choice for binary
classification. This does not validate our chosen teaching order or a rollout.
```

Save session observations first, then reconcile any affected proficiency and milestone progress. An achieved milestone needs linked evidence and a short explanation of how it meets `Complete when`. Reading material or receiving an explanation alone does not meet a performance criterion. Preserve achievement dates and limitations. If a source correction invalidates the claim, revise its status with a dated reason; revisiting for retention can preserve valid historical evidence. Retiring, replacing, or splitting a milestone keeps its identifier and references traceable. Record meaningful path changes and why in the goal body. The latest session holds the exact unfinished exercise; keep the goal's current direction brief and link to that checkpoint instead of duplicating it. Goal completion still requires review of its actual purpose.

## Session

`sessions/<goal-slug>/<session-id>.md` uses `type: session`. Its `id` uniquely identifies the encounter; use an unused filename when starting another one.

| Field | Contract |
|---|---|
| `goal` | Required relative path to the goal record. |
| `started_at`, `updated_at` | Required timestamps with UTC or an explicit offset. |
| `closed_at` | Required. `null` while no clean ending has been recorded; otherwise the closing timestamp. |
| `previous_session` | Optional relative path to the encounter this one continues. |
| `origin` | Optional mapping with known `host`, `thread_id`, `thread_url`, and `workspace` fields. Chat identifiers and URLs must come from the host or user. `workspace` is the absolute working directory where the encounter started, an explicit exception to relative record paths. Omit unknown fields; preserve the original origin on resume. |
| `pedagogy` | Optional description of teaching actually used. `approaches` is a list drawn from `Explanatory`, `Socratic`, `Experiential`; `methods` is a list of freeform technique names. Include the parts that are useful to retain. |
| `evidence` | Optional list indexing observations in this session's body. Each item has `section`, a local heading fragment such as `#retry-prediction`; `dimensions`, a list of applicable evidence dimensions; and `assistance`, a concise description of help actually supplied. |

Evidence dimensions are `Explain`, `Predict`, `Apply`, `Adapt`, and `Judge`; select only those observed. The body contains the actual learner contribution and situation at each indexed heading. Preserve attribution when a tutor, tool, or collaborator supplied part of the work. Keep the evidence index aligned with corrected body observations; the index does not establish an observation by itself. Keep a resumption checkpoint in the body while the session is open and a handoff when it closes. If continuation happens in a different chat without starting a new encounter, retain its known origin pointer and date in the body; do not replace the original header. An origin pointer locates source context, not proof that it was read or evidence of learner capability.

```markdown
---
id: session-networking-2026-10-11-01
type: session
goal: ../../goals/networking.md
started_at: "2026-10-11T14:00:00-07:00"
updated_at: "2026-10-11T14:18:00-07:00"
closed_at: null
pedagogy:
  approaches: [Socratic]
  methods: [Prediction prompt]
evidence:
  - section: "#retry-prediction"
    dimensions: [Predict]
    assistance: Tutor supplied the arrival and processing rates and prompted comparison.
---

# Networking session

## Context

The learner said they maintain a service and want to reason about slow requests.

## Retry prediction

Given 12 arrivals per second and capacity for 10, the learner predicted that
immediate retries would add load and make the queue grow faster. The tutor
supplied both rates and asked what retries would change. Independent calculation
and backoff reasoning were not observed.

## Where we stopped

The learner asked whether delayed retries would help. A backoff example is a
possible next step; it has not been attempted.
```

## Topic proficiency

`knowledge/proficiency/<topic>.md` uses `type: proficiency`. Required `assessments` is a list of scoped current interpretations of session evidence. The topic filename groups related claims; it does not give the learner one rank across the entire topic.

| Assessment field | Contract |
|---|---|
| `scope` | Required statement of the capability assessed. |
| `current_proficiency` | Required: `Unexplored`, `Familiar`, `Capable`, `Fluent`, or `Expert`, using the vocabulary definitions. |
| `assessed_at` | Required date or timestamp of this assessment. |
| `conditions` | Required for a capability claim: the situation and assistance under which it holds. Omit for `Unexplored` when conditions are unknown. |
| `evidence` | Required for a capability claim: a nonempty list of relative paths with heading fragments to supporting session observations. Omit for an `Unexplored` scope with no evidence. |
| `limits` | Optional list of known limitations or uncertainty about this claim. |

The body explains interpretation when helpful. Keep each current claim aligned with corrected source observations. Session observations are the source of truth for what happened; this record owns the current interpretation. `Unexplored` means insufficient evidence, not demonstrated inability.

```markdown
---
id: proficiency-networking
type: proficiency
assessments:
  - scope: Predict how immediate retries affect an already overloaded queue.
    current_proficiency: Familiar
    assessed_at: "2026-10-11T14:18:00-07:00"
    conditions: Given arrival and processing rates, with a tutor's comparison prompt.
    evidence:
      - ../../sessions/networking/2026-10-11-01.md#retry-prediction
    limits:
      - Independent calculation and transfer to backoff have not been observed.
---

# Networking

The prediction supports an initial model of retry-driven load. Broader diagnosis
remains unassessed.
```

## Focused knowledge notes and summaries

Create these only when they improve continuity. In addition to `id` and `type`, each has required `sources`: a nonempty list of relative paths, preferably to specific headings, or external URLs. Use the plural field consistently even for one source. The body states the retained fact, preference, decision, procedure, or synthesis with its context and uncertainty.

| Location | `type` | Purpose |
|---|---|---|
| `knowledge/facts/<slug>.md` | `fact` | Retain a useful supported fact. |
| `knowledge/preferences/<slug>.md` | `preference` | Retain a relevant stated or provisionally inferred preference. |
| `knowledge/decisions/<slug>.md` | `decision` | Preserve a choice and its rationale. |
| `knowledge/procedures/<slug>.md` | `procedure` | Preserve a useful process and its conditions. |
| `timeline/daily/<period>.md` | `timeline-daily` | Synthesize a day's work with source links. |
| `timeline/weekly/<period>.md` | `timeline-weekly` | Synthesize a week's work with source links. |
| `timeline/monthly/<period>.md` | `timeline-monthly` | Synthesize a month's work with source links. |

Timeline records may include `period_start` and `period_end` dates when useful; both can be the same day. These records remain derived from their cited material. A summary neither replaces session evidence nor owns a current proficiency claim.

`knowledge/facts/retry-load.md`:

```markdown
---
id: fact-retry-load
type: fact
sources:
  - ../../sessions/networking/2026-10-11-01.md#retry-prediction
---

# Retry load in the queue example

In this example, immediate retries add arrivals while processing capacity stays
fixed. This note retains the example's relationship; it does not establish the
learner's ability to diagnose other systems.
```

`timeline/daily/2026-10-11.md`:

```markdown
---
id: summary-daily-2026-10-11
type: timeline-daily
period_start: "2026-10-11"
period_end: "2026-10-11"
sources:
  - ../../sessions/networking/2026-10-11-01.md#retry-prediction
---

# 2026-10-11

The learner predicted the effect of immediate retries with supplied rates and a
comparison prompt. The question of backoff remains open.
```
