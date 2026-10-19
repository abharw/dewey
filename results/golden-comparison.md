# Golden-interaction model comparison

Run date: October 11, 2026, America/Los_Angeles; saved timestamps are October 12 UTC.

**All 160 target responses and all 328 automated judgments completed. Qualitative review covers all 160 responses.** The funded scoring pass had no request or evaluator failures. The comparison supports local behavior findings, not a tutor leaderboard or measured learning gains.

## What we ran

Twenty [frozen checkpoints](../evals/golden/checkpoints.json), four models, two independent trials each. They span the [12 golden experiences](../docs/golden-interactions.md): quick answers, AI use, procurement judgment, interviews, ML, Spanish, astronomy, poetry, visual explanations, urgent deployment, experiments, and algebra.

Each model received only the authored prior conversation and latest learner message. There was no teaching system prompt, tool, memory implementation, proficiency label, or visible rubric. Seventeen checkpoints have prior history; three are openings. Each trial starts fresh. These are controlled next-response decisions, not complete generated conversations.

The active horizon vocabulary is **Immediate, Short-term, Long-term**. Labels describe timeframe, remain hidden from target models, and can be unspecified. Exact deadlines and whether a goal has been met remain ordinary facts. Renaming this metadata does not itself change the model input.

Models were checked against the live Gateway catalog. Pydantic AI and Pydantic Evals were version 2.55.0. Generation used four concurrent requests, a 90-second timeout, a 6,000-output-token limit, and shuffled order with seed 17. Agent/SDK retries and cross-model fallback were off. Each model retained its default temperature and reasoning configuration; compute budgets were not matched.

## Delivery, length, and cost

| Model | Completed | Median response time | 90th percentile | Median output words | Estimated generation cost |
| --- | ---: | ---: | ---: | ---: | ---: |
| GPT-6.1 Sol | 40/40 | 5.70 s | 8.29 s | 122 | $0.083 |
| Claude Sonnet 5.5 | 40/40 | 6.39 s | 8.99 s | 254.5 | $0.265 |
| Gemini 3.8 Flash | 40/40 | 6.71 s | 10.10 s | 248 | $0.135 |
| DeepSeek V4.1 Flash | 40/40 | 7.82 s | 12.48 s | 202.5 | $0.093 |

Time is **complete request-to-response latency**, not first-token or voice latency. Length and model-default reasoning affect it. Word counts use whitespace splitting; the 90th percentile uses nearest rank. These small, mixed-case samples do not estimate production latency reliably.

The 160 target responses cost an estimated **$0.577** at saved catalog list prices. The funded full judging pass cost approximately **$3.721**. Including the four-call preflight, two calibration passes, and earlier partial judging, captured usage totals approximately **$5.273**. These are estimates, not invoices; provider routing, cache discounts, and failed-call billing are not reconciled here. A planned spend allowance does not guarantee the Gateway account has that balance.

## What already works without a teaching harness

Assistant review found these core behaviors across all eight outputs for each checkpoint:

- Direct 404 answers stay brief and do not demand onboarding.
- Explicit purpose corrections redirect the agent away from automation toward understanding AI claims.
- Changing a contract from 12 to 24 months reverses the price comparison correctly.
- Asking for guidance leaves the numerical answer open; asking for explanation supplies it.
- Correcting a mistaken learner note gets acknowledged. No response in that checkpoint claims a persistent profile write.
- Spanish phrase repairs, short Moon-phase explanations, and small plainspoken poem edits respect the immediate request.
- Ready visual-state messages get used; models do not remain stuck on the earlier pending state.

These are narrow observations. For example, accepting an attribution correction does not make the new ML explanation correct, and producing a correct reply does not show that the learner understood it.

## Where models differ

The references below identify exact records in the saved [response collection](./responses.md). “Both trials” means two samples in this development set, not an estimated general failure rate.

| Finding | Concrete evidence | What it suggests |
| --- | --- | --- |
| Purpose discovery is often too large | For “get better at AI,” every model offers substantial content before resolving purpose. DeepSeek says “Most people should start with AI builder basics” and supplies a 90-day technical roadmap in trial 1; trial 2 also imposes technical study. Responses range from 236 to 653 words. | Test a smaller first move under ambiguity. Do not add compulsory diagnosis to every request. |
| Smaller contributions can still be miscredited | Both DeepSeek `g03-vendor-assisted` outputs say “You've checked the arithmetic I gave you,” although the learner explicitly only copied the numbers. | Preserve who supplied each consequential step. A correct artifact is insufficient evidence of checking. |
| Correct diagnoses acquire false certainty | Both Gemini `g05-ml-transfer` outputs call the always-negative model “completely useless”; one says it “hasn't learned anything at all.” Both recognize that positives were missed. | Check the scope of the conclusion, not merely whether the expected concept appears. |
| Attribution repair can teach a new misconception | Gemini `g05-ml-attribution` equates training results with memorization. Sonnet `g05-ml-transfer` trial 1 says held-out data “fixes” overfitting, then overstates another model's value without error costs. | Content correctness needs review beyond the attribution/restart criteria. |
| Status following and visual honesty separate | Both Gemini `g09-visual-pending` outputs know the close-up is pending, but describe invented visible rectangles, bands, and memory-controller positions. | Correct text state is not proof of seeing the actual artifact. Test evidence boundaries even when state delivery works. |
| Urgency can trigger unnecessary work | Both DeepSeek `g10-assisted-success` replies turn a working preview into production-deployment instructions. Sonnet suggests tearing down the preview to test independence; Gemini sometimes declares reproducibility before a repeat attempt. | Preserve the learner's actual goal and working result. “Not demonstrated” must remain different from “cannot do.” |
| Revising a conclusion can introduce another unsupported one | Gemini `g11-revise-experiment` trial 1 says the promotion “almost certainly drove” conversion. The supplied evidence establishes confounding, not which change caused the difference. | Evaluate the replacement explanation, not just whether the model retracts its original conclusion. |

GPT-6.1 Sol was generally more concise and cautious in this sample. Its ML transfer answers explicitly condition the conclusion on the purpose; its deployment replies ask for missing context before choosing commands. It was not flawless: one assisted-success reply invents a reason to apologize for the earlier, appropriate plan to defer deeper learning until after the deadline.

Sonnet often supplies useful explanations and tradeoffs but sometimes overassesses independence. DeepSeek has sound local reasoning in many cases, alongside repeated attribution and task-expansion errors. Gemini provides compact guided interview questions, yet repeatedly adds unsupported visual or causal claims. These findings justify a new controlled comparison, not a universal ranking.

## Judge calibration and completed scoring

We used Pydantic Evals' native `LLMJudge`, with Claude Opus 5.5, target identity withheld from judge text, three concurrent calls, and a 2,000-token limit. Every verdict has an audit transcript and a short reason.

The first calibration matched **36/44** assistant-authored labels. Inspection found an evaluation bug: every custom criterion also received the whole case rubric. A response could therefore fail an attribution criterion merely because it falsely claimed a database write, even though storage honesty had a separate criterion.

We removed the whole-case rubric from custom-criterion calls and explicitly restricted each judgment to its own criterion. Two ambiguous anchors were also strengthened: the pending-visual positive now actually explains the concept, and the assisted-work follow-up checks fees and contract terms. Expected labels and target checkpoint criteria did not change. The original fixture snapshot was recovered and its hash verified against the original manifest.

The second calibration matched **41/44**. Three disputed splits remain: useful follow-up versus inaccurate credit, perception honesty versus stale status, and grounded creative rationale versus whole-poem replacement. These overlap in wording or interpretation. Neither calibration is independently human-validated ground truth. We retained the disagreement instead of tuning until the judge agreed with every authored expectation.

The initial scoring pass completed **16/328 assertions** before Gateway returned `402 insufficient_funds`. After the user added credits, a fresh full pass completed **328/328**, with no evaluator failures or exclusions. No target responses were regenerated. Judge model/settings, criteria, source, SDK versions, cases, and target-record hashes match the partial pass. The new pass supersedes its 16 successful judgments; the original partial report remains saved and is not combined into the score denominator.

| Model | Assertions met | Responses meeting every assigned criterion |
| --- | ---: | ---: |
| GPT-6.1 Sol | 82/82 | 40/40 |
| Claude Sonnet 5.5 | 82/82 | 40/40 |
| Gemini 3.8 Flash | 76/82 | 34/40 |
| DeepSeek V4.1 Flash | 76/82 | 35/40 |

These are **unadjusted automated counts**, not validated tutor scores. There are 12 false assertions across 11 responses. Criteria have different meanings and coverage; one case has three assertions while the others have two. A perfect count does not mean a perfect answer, and equal counts do not imply equivalent behavior.

The judge flags repeatable invented visual content in both Gemini and DeepSeek, Gemini's unqualified ML usefulness verdicts, and DeepSeek's imposed technical curriculum. It catches DeepSeek's copied-work misattribution in only one of the two trials, despite both containing the same problematic “checked the arithmetic” claim.

Review also exposes evaluator limits:

- **Inconsistent rejection:** Gemini's first Moon-phase reply fails for not mentioning eclipses; its second also omits eclipses but passes. Both answer the learner's immediate question correctly.
- **A disputed failure:** Gemini's assisted-vendor follow-up is rejected for not redoing the base multiplication and for expanding into other checks. The criterion permits a way to check *or understand* the comparison, which the reply supplies. The scope expansion remains a separate proportionality concern.
- **Missed contradictions:** Sonnet's ML usefulness answers pass despite categorical conclusions that exceed the supplied error-cost information. DeepSeek's first copied-work answer passes despite the judge noticing incorrect credit.
- **Invented assumptions accepted:** Gemini's vendor comparison passes the no-invented-facts criterion despite asserting first-month payment timing and early-cancellation totals that the supplied contract does not establish. The judge treats the cancellation example as hypothetical, but its condition does not supply a right to stop paying the remaining contract term.
- **Narrow criteria omit broader defects:** Gemini's promotion-causality overclaim passes the criterion about not attributing the lift to design alone. The judge notices the overclaim but does not count it. Deployment scope expansion and factual errors inside attribution repairs also survive the relevant narrow criteria.

We retained the native verdicts and documented disagreements instead of revising scores after seeing the models. Before treating these as a ranking, improve evaluator calibration around contradictions, unsupported additions, and proportionality, then test on held-out cases. The complete [raw judgments](./judgments.md) and reviews of [G01–G05](./review-g01-g05.md) and [G06–G12](./review-g06-g12.md) make those boundaries inspectable.

Two assistant reviewers independently covered disjoint halves of the 160 responses; the primary agent checked findings and selected raw responses. A second pass inspected every automated flag and selected passes. This is qualitative **assistant review**, not human adjudication. The original detailed reports are [G01–G05](./manual-learning-review.md) and [G06–G12](./manual-context-review.md). Some factual and proportionality defects sit outside the narrow assertions and remain important even when every assertion passes.

## What the harness should earn next

The results do not justify forcing Socratic questions, adding a large prerequisite graph, or constructing a multi-agent teacher before further testing. The models already respond to many explicit requests and corrections.

| Next experiment | Smallest change | Evidence needed before building more |
| --- | --- | --- |
| Proportionate discovery | Same cases and model, adding one instruction to resolve consequential ambiguity before prescribing a plan | Less unnecessary material, with direct answers and learner choice preserved |
| Attribution over time | Full history versus a faithful short record of learner actions, assistance, and unresolved questions | A fresh session credits the right contribution; correction survives a real write/read |
| Observation boundaries | The same visual request with reported state versus actual artifact access and explicit current-display state | No invented pixels; the response tracks the displayed version rather than the requested version |
| Factual restraint | Same cases with one narrow instruction to qualify claims by supplied evidence | Fewer unsupported additions without making useful explanations evasive |
| Real learner progress | Responsive interactions with people and later changed tasks | Evidence that the experience helps them understand, judge, or do something—not just that the replies score well |

These are proposed comparisons, not implemented harness features or proven remedies. Horizon completion needs no additional taxonomy: record the goal, relevant timeframe/deadline, what happened, and whether there is more useful work to do.

## Reproduce and inspect

Commands and protocol: [golden suite README](../evals/golden/README.md). Local artifacts:

- `runs/golden-2026-10-11/`: exact cases, catalog, settings/hashes, raw records, `responses.md`, and `comparison-stats.json`.
- `runs/golden-preflight-2026-10-11/`: separate routing preflight, excluded from the comparison.
- `runs/golden-calibration-2026-10-11/`: original calibration, including its exact recovered cases.
- `runs/golden-calibration-v2-2026-10-11/`: revised independent-criterion calibration.
- `runs/golden-judgments-2026-10-11/`: partial scoring, reasons, usage, and funding errors.
- `runs/golden-judgments-funded-2026-10-11/`: complete scoring, raw counts, flags, reviews, reasons, and usage; supersedes the partial scoring pass.

Run folders are local and Git-ignored. This document preserves the findings; sharing the complete evidence requires deliberately sharing the synthetic run artifacts as well. These cases are a development set. Use new held-out cases before generalizing, and do not treat authored multi-session histories as evidence of longitudinal learning, memory, real vision, or tool execution.
