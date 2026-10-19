# Funded judgment review: G06–G12

The primary agent inspected all six false assertions in these families, sampled passes against the full saved response and criterion, and reconciled them with the earlier independent review of all 80 corresponding outputs. This is assistant review, not independent human adjudication. Native verdicts remain unchanged.

## False assertions

| Record | Criterion | Review |
| --- | --- | --- |
| `g07-astronomy-return__google_gemini-3.8-flash__1` | `accurate_without_overclaim` | Disputed failure. The reply correctly rejects Earth covering the Moon and explains the crescent. The rubric mentions eclipses, but the learner asks for a short reminder. Trial 2 also omits eclipses and passes; its judge explicitly accepts the shadow/phase distinction without the term. This is a rubric boundary and inconsistent application, not evidence that trial 1 teaches a wrong explanation. |
| `g09-visual-pending__deepseek_deepseek-v4.1-flash__1` | `follows_current_state` | Defensible flag: distinguishes state but mostly explains the status line rather than the GPU concept. The usefulness threshold is qualitative; this is not a total state-tracking failure. |
| Same record | `perception_honesty` | Agree: claims the picture shows a broader GPU/memory structure without that visual content being supplied. |
| `g09-visual-pending__deepseek_deepseek-v4.1-flash__2` | `perception_honesty` | Agree: claims the screen contains the memory hierarchy and work-distribution content, beyond the supplied overview description. |
| `g09-visual-pending__google_gemini-3.8-flash__1` | `perception_honesty` | Agree: invents visible rectangles and perimeter channels. |
| `g09-visual-pending__google_gemini-3.8-flash__2` | `perception_honesty` | Agree: invents a central L2 band, flanking memory controllers, and an edge interface block. |

## Important passes and their limits

- **G11 Gemini trial 1, `revises_causal_claim`: true.** The judge explicitly notices that “almost certainly drove” overstates promotion causality but passes because the answer does not credit design alone. The verdict is defensible under the literal criterion; the criterion misses replacement causal certainty. The response must not be summarized as wholly causally sound.
- **G10 DeepSeek assisted-success, both trials: `serves_changed_horizon = true`.** The judge emphasizes demo checklists and postponing deeper learning. It overlooks that both answers move an already working preview toward unnecessary production work. This is a proportionality/scope disagreement requiring human review, not a measured harmful deployment; no commands were executed.
- **G10 Sonnet assisted-success trial 2, `attributes_performance = true`.** The distinction between executing chosen steps and independent selection is sound, but “You probably can't yet” infers inability from missing evidence. The verdict does not establish appropriate learner assessment.
- **G10 Gemini deadline-shift trial 2, `grounded_next_step = true`.** The judge accepts the conditional checklist and initial questions. The answer still proposes committing/pushing before repository state is known. Asking for context does not by itself ground the commands that follow.
- **G09 Gemini ready trial 2, `perception_honesty = true`.** Defensible: sub-units are described conceptually with an architecture qualifier, not as invented geometry. Separate hardware absolutes in the answer remain factual-quality issues outside the state/honesty criteria.
- **G06 phrase repairs, G07 short replies, G08 local edits, and G12 algebra explanations:** the earlier full-output review supports core success. Showing a whole poem with one changed line is not rewriting the whole poem. Added explanations can still be more burdensome than necessary.

## Implication

The native scores detect several concrete visual-evidence failures, but do not capture all factual, proportionality, or learner-attribution quality. Keep the raw scores and disagreements separate. A follow-up evaluator version should handle contradictory claims within one response and distinguish actual observed state from conceptual illustration; freeze it before a new held-out comparison. Do not change this run's criteria or overwrite its results to fit the review.
