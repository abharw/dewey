# Workspace and sessions

Use Markdown and the agent's existing file tools. This reference owns layout, setup, navigation, and lifecycle. [Record formats](records.md) owns frontmatter fields and examples; [Vocabulary](vocabulary.md) owns the meaning of learning terms. Read the relevant format before writing a record. These are agent-followed conventions, not a storage service or enforced schema.

## Layout

```text
<learner-directory>/
  README.md                         entry point; no frontmatter
  learner.md                        relevant person-level context
  goals/
    networking.md                   purpose, targets, latest-session pointer
  sessions/
    networking/
      2026-10-11-01.md               observations, assistance, checkpoint
  knowledge/
    proficiency/
      networking.md                 current scoped assessments
    facts/
    preferences/
    decisions/
    procedures/
  timeline/
    daily/
    weekly/
    monthly/
  artifacts/
    networking/                     activities and work, when needed
```

Create only files and directories that contain useful information. The tree is a set of places to use, not a mandatory scaffold. Keep goal slugs and record paths stable when display titles change. Resolve local paths relative to the containing file, including paths in frontmatter. IDs identify records; reading a linked file does not require an ID or alias resolver. The learner directory is separate from the installed skill and the development repository.

## First use: setup within the teaching skill

Start useful help from the learner's question or rough purpose. An Immediate factual question may need no saved files. When continuity becomes useful:

1. Read the record formats and vocabulary. Create a small provisional goal note and open session, with known facts only. Save during discovery rather than waiting for a finished plan. The learner need not supply an intake inventory, choose a proficiency label, or decide a horizon before learning can begin.
2. Create the root README after its linked records exist. Use the navigation example below and append the contents of `vocabulary.md` beneath a `## Vocabulary` heading, omitting that source file's top heading. This makes the learner workspace understandable on its own. Add a short conventions paragraph: goals own targets; sessions own observations; proficiency records own current interpretations; paths are relative to their containing file.
3. Create `learner.md`, proficiency, other knowledge, artifacts, and timeline records only when there is something useful to preserve. An interest saved for later, without an active learning encounter, can remain a small goal note without a session or assessment.
4. Read back the files and check fields and pointers using the checks below. There is no initialization command or separate setup skill.

The copied vocabulary is orientation, not a second independently maintained definition. The installed skill's vocabulary is canonical. When applying a revised definition, refresh that section without replacing the learner's goal index or personal content; explain any consequential reinterpretation of their records.

## Root README: find the goal

Use ordinary Markdown, without frontmatter. Keep a short linked goal list and, when the learner explicitly chooses an ongoing focus, an optional current-goal link. Link `learner.md` only if it exists. A navigation excerpt:

```markdown
# Learning

## Goals
- [Networking](goals/networking.md): reason about slow requests.
- [Machine learning](goals/machine-learning.md): understand model evaluation.

Current goal: [Networking](goals/networking.md).
```

Keep paused and completed goals discoverable. Goal metadata owns their status and current details; the root is a map. Avoid maintaining a second authoritative status or proficiency table here. Vocabulary and conventions follow the navigation.

## Ownership and everyday reads

The usual path is root README → selected goal note → latest session → relevant proficiency record or linked work. Read only material that serves the active purpose. A named goal takes precedence over an old current-goal pointer. If several goals fit a request to continue and no current choice is established, offer a short informed choice; recency alone is not intent.

- **Learner:** relevant personal context, reports, and preferences with source and date. The overall profile includes linked goals and assessments; `learner.md` need not duplicate them.
- **Goal:** purpose, timeframe, scoped targets, milestone path with sources and evidence-linked progress, current direction, and latest session. Targets express desired capability, not observed attainment. The session owns the exact unfinished activity.
- **Session:** what actually happened, including the learner's contribution, assistance, artifacts, and unresolved work. Pedagogy records actual approaches and methods when useful; evidence dimensions refer to learner contributions.
- **Proficiency:** current interpretations of evidence within a stated scope and conditions. A topic can have several assessments. Two goals can link the same topic record while aiming at different targets. Retain source links and uncertainty; Unexplored is not inability.
- **Other knowledge:** reusable facts, preferences, decisions, or procedures. A saved procedure is reference material, not evidence that the learner can perform it.
- **Timeline:** optional source-linked summaries across sessions or goals. Add daily, weekly, or monthly summaries when they aid navigation; no rollup is required at every turn or calendar boundary. Summaries do not own current goal state or proficiency.

## Session lifecycle

**Start.** Read the selected goal and its relevant records. Resume an open session when continuing that encounter, including after interruption or context reduction. After a closed session, create a new record with `previous_session` pointing to it. If a distinct encounter begins while the predecessor is unclosed, create a new linked record and preserve the uncertainty about the old ending. A different chat alone need not mean a new encounter; follow the learner's intent and recorded context. Use real timestamps and unused filenames, never example dates or an overwritten old session.

**Origin.** At creation, record the host, exact chat identifier or URL, and absolute working directory when supplied by the host or user, using `origin` in the session header. Keep the session in the selected learner directory; the starting working directory is a pointer, not a reason to relocate learner state. Omit unavailable origin fields instead of guessing identifiers or scanning host databases. Keep the original origin stable; if the same encounter continues in another chat, record that available pointer and date in the session body.

On return, read the saved checkpoint first. If resolving an omission or disputed attribution requires the original conversation, use the host's supported history tool for that recorded chat within the user's authorized scope. A pointer is not permission to inspect unrelated history. If the chat is inaccessible, continue from the checkpoint and ask only about a consequential missing detail. Thread history supplements the learning record; it does not replace saving it.

**Checkpoint.** After a consequential contribution, correction, artifact, or direction change, update the observations and “Where we stopped” in the session body. Preserve attribution and assistance, separate proposed work from completed work, and link actual artifacts. Save before yielding when material needed for resumption has changed. A mistaken observation is corrected in place with a brief explanation of what changed. If it supported a linked proficiency claim, reconsider that claim in the same update rather than leaving an unsupported label current. Targets change only when purpose changes, not merely because current proficiency changes.

**Close.** On a genuine pause or ending, save a short handoff and set `closed_at`. An ordinary reply or tool completion is not a session ending. Closure does not mark the goal completed or establish a proficiency level. Keep the latest-session pointer on the closed record so the next session can read its handoff.

## Write checks and recovery

Write observations and artifacts first, then affected knowledge or proficiency records, then the goal's pointers, then the root index if its entries or current-goal choice changed. Read back material writes. Check that:

- The root README has no frontmatter; records use the field contract for their type.
- Required fields exist, vocabulary labels are valid, optional unknowns are omitted, and current claims carry evidence and conditions rather than inferred scores.
- YAML paths and Markdown links resolve, including evidence sections. A field or pointer has one authoritative location; avoid conflicting copies in prose.
- The goal owns the target, session observations justify the current assessment, and an ending has not silently become completion.

These checks are performed by the agent with existing file tools. They are not deterministic enforcement or a multi-file transaction. A future validator could check syntax, allowed labels, and links; it could not decide whether the learner actually understands something.

On resume, list metadata in `sessions/<selected-goal>/` before trusting `latest_session`. Usually only the pointed session needs a full read. If a newer session exists, a link is missing, or records disagree, inspect recorded times, `goal`, `previous_session`, and checkpoints. Repair a stale pointer when a clear continuation exists. Keep unrelated goals and older sessions intact. If competing continuations are ambiguous, ask a short clarification. Modification time is a hint, not proof of ordering or intent.

An unclosed record means no clean ending was saved. Resume from the last durable checkpoint without inventing progress. Unsaved observations cannot be recovered; a partially written file is uncertain. Concurrent agents should use separate session records and fresh reads before changing shared pointers or assessments; this package supplies no locks. Session records retain dated, attributed observations and corrections; the proficiency note presents their current interpretation. No scan of every goal or every historical session is required on each turn.
