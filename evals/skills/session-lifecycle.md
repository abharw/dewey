# Core skill: session lifecycle acceptance

This is a behavioral test protocol. The distributed product is the Markdown directory at `skills/dewey`; it has no evaluation dependency. Use synthetic learner data, isolated directories, and the host's existing file tools. These checks evaluate file navigation and continuity, not learning gains or a skill's automatic discovery.

## Execution

Copy the whole skill directory to a temporary location outside the development repository. Give each acting agent only the copied `SKILL.md` path, its learner directory, the permitted local tools, and the learner message. Start recovery agents with no prior conversation history. Keep expected outcomes below outside their context. Do not grant access to personal learner data or the development repository.

Capture before/after files and learner-facing replies. Review actual goal selection, saved attribution, unfinished question, and pointer resolution. The format validator and link checks supplement this review; matching exact headings or wording is not evidence of correct behavior.

## Scenarios

| Scenario | Input / setup | What to inspect |
|---|---|---|
| First visit | Empty learner directory. “I want to get better at reasoning about slow requests in networking. I also want to learn ML evaluation later. Let's start networking today. A service gets 12 requests a second and can handle 8. Can you explain what happens? I have ten minutes.” | Useful explanation without an intake inventory; two navigable interests, selected networking goal, open session, tutor arithmetic attributed to the tutor. |
| Attribution checkpoint | Follow that turn with: “Four per second, but my coworker gave me that answer, so please don't count it as my calculation. My own guess is retries make the queue worse because they add more requests. Could we explore what to do when retries are unavoidable next?” | Numeric answer stays coworker-supplied; learner retry hypothesis is recorded within its scope. A concrete unfinished question survives in a checkpoint. |
| Interrupted resume | Preserve files after the above reply, without a closing turn. Give a fresh agent only those files and “I'm back; the app closed on me. Let's continue where we left off.” | It follows the root README → goal note → session pointers, resumes the actual pending question, retains attribution, and does not invent intervening work or a clean ending. |
| Stale pointer | Clone the checkpoint. Add a later networking session linking its predecessor and recording a learner-requested switch to how idempotency keys prevent duplicate charges. Include a linked two-attempt payment example. Leave the goal note pointing to the older session. Fresh learner message: “Continue my networking goal, please.” | It finds the later record, uses the new direction and example, repairs latest_session, retains older evidence, and leaves ML unchanged. |
| Ambiguous goal | Root README lists networking and ML, with no current goal. Both have open sessions. Say “Let's pick up where we left off.” Then choose ML. | It asks a short informed choice, then follows ML's own checkpoint; file recency is not treated as intent. Networking remains unchanged. |
| Close and reopen | In a clone of the real open checkpoint, say “That's enough for today. Let's leave that question for next time.” Then start a fresh agent with “Let's continue.” | Closure time and handoff are saved; the learning goal stays in progress. A new session links the closed predecessor and resumes the pending work. |
| Immediate answer | Empty directory. “What does HTTP stand for? Just the expansion, please.” | Correct direct answer; no compulsory project setup, proficiency inference, or extra exercise. |

## Canonical record format checks

Run after changes to folder layout, frontmatter, or vocabulary routing:

| Scenario | Input / setup | What to inspect |
|---|---|---|
| First-use records | Empty learner directory. Ask for a short-term networking goal, aiming to choose and check a retry policy with AI help. Supply one narrow learner prediction with explicit assistance; do not claim a demonstrated policy choice. | Root README has no frontmatter and includes vocabulary; a flat goal note owns targets; session owns sourced observations; any current proficiency claim has scope, conditions, and evidence. Optional categories remain absent until useful. |
| Correct and resume | Give a fresh agent the saved files and a learner correction that the earlier prediction came from a coworker. Ask to continue the unresolved question. | It resumes the actual checkpoint, corrects attribution, revises any dependent current assessment without changing the desired target, and keeps unrelated goals intact. |

## Discovery, teaching, and review walkthrough

Use one multi-session goal and a real sequence of generated replies, rather than a single prompt that supplies a finished intake. Start with an empty learner directory and a rough interest in using AI to classify support tickets. Let the tutor help clarify the purpose. Supply the learner's time, intended use of AI, and relevant judgments as the conversation develops. Retain the exact messages, package hashes, and file snapshots in the private run directory.

Give the acting agent only the copied skill, isolated workspace, ordinary tools, and learner turns. Host-origin metadata may be supplied as explicitly synthetic fixtures. Keep acceptance expectations out of its context. Inspect whether the tutor:

- Provides useful help while establishing purpose, target conditions, time, observed baseline, and a first milestone.
- Saves a provisional goal and open session before waiting for a complete plan or goodbye.
- Uses observed learner contributions to refine milestones and progress, preserving what the tutor supplied.
- Captures the supplied originating chat/workspace pointer without relocating the learner records or inventing host identifiers.

After a material checkpoint, end the test agent's conversation without a learner goodbye. Preserve that unclosed record. Start a fresh agent with only the skill, saved learner directory, fresh origin metadata, and a learner message identifying a distinct return encounter. Continue with a new variation and a correction of earlier attribution. Inspect whether it recovers the actual checkpoint, links the new session to its predecessor, avoids repeating settled intake, retains unknowns, corrects dependent claims, and records new contributions without completing the whole goal prematurely.

Include a small separate Immediate-answer control. A user asking only for a factual expansion should still get that answer without mandatory goal creation.

Also try a separate vague-intent control: a learner asks for a machine-learning plan without knowing their purpose, then remains unsure of depth and coding interest. Inspect whether the agent helps them explore through a concrete activity while keeping the wider path and missing constraints provisional. When no thread identifier is supplied, verify that none is invented.

Origin metadata tests preservation of pointers, not real host-history access. Testing transcript retrieval requires a separate supported host integration and authorized chat. Do not infer successful history reads from the existence of a thread ID.

## Source-grounded multi-session path

Use a fresh learner and a domain different from the skill's worked example. Give the tutor a rough purpose spanning several encounters, relevant constraints, and one plausible initial misconception. Supply only the copied skill, isolated learner directory, ordinary file/research tools, and learner message. Keep this protocol and expected outcomes outside its context.

Retain the package snapshot, exact dialogue, before/after learner files, and retrieval telemetry outside the learner directory. Capture actual resource requests and responses where available, including which sections were read. Independently compare the saved source claims with the retrieved passages. A generated bibliography or the agent saying it researched is insufficient evidence of grounding. Distinguish harness telemetry from the learner's own records.

Continue in response to the actual tutor question. Include an initial judgment and a later variation so progress can be recorded. Interrupt after completed writes without a goodbye; give a fresh tutor only the saved learner workspace and a return message. Continue the pending work and include a reasonable change in purpose or constraints. Inspect:

- Actual inspected subject resources before the route is treated as established, with accurate scope, locators, dates, and distinct planning rationale.
- Stable milestone headings with completion conditions, states, dependencies when useful, and progress linked to learner observations and assistance.
- Meaningful within-milestone progress, and evidence-based achievement only when conditions have actually been met.
- Recovery of the path and unfinished activity without inventing prior work, repeating settled discovery, or losing source provenance.
- Justified path revision without breaking existing source/evidence links or silently changing the desired proficiency to match current performance.
- Separate goal purpose, path progress, current proficiency, and session closure.

Use deterministic execution or calculation to check generated worked examples when applicable. Report which behaviors were actually observed; no achievement transition, delayed retention, or access-failure behavior is established unless the run exercises it.

## Mechanical checks

- Run the installed skill-creator's `quick_validate.py` against the package.
- Check that package-relative references resolve after copying the package by itself.
- Parse YAML headers; check the field contract and allowed labels from records/vocabulary references. The root README has no header.
- Resolve both local Markdown links and YAML paths, including evidence section anchors, in each learner workspace.
- Compare unrelated goal files before and after each goal-specific run.
- Inspect metadata and evidence directly; session closure must not imply goal completion.

## Limits

Stopping between turns and discarding conversation context simulates interruption after a saved checkpoint. It does not prove crash-safe writes, reliable capture during abrupt termination, multi-writer coordination, host lifecycle hooks, automatic compaction restoration, or performance across models. If a checkpoint was never written, this convention cannot recover it. Any broader claim requires a separate test of the actual host integration.
