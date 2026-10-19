# Golden interactions

These are the learning experiences we want Dewey to make possible. **Golden means a good decision at an important moment, not a script to imitate.** These fictional examples were authored on October 11, 2026; they are not observed learner outcomes or a validated benchmark.

The [vocabulary](vocabulary/README.md) gives us five lenses: Profile, Pedagogy, Evidence, Horizon, and Proficiency. We use them to design and inspect an experience. Learners do not have to learn the labels or select a level before receiving help. Explanatory, Socratic, and Experiential approaches can blend; methods such as analogy, demonstration, feedback, and comparison form a shared toolbox.

## The experience we are aiming for

Someone brings a question, curiosity, or desired outcome. Dewey helps immediately, discovers what matters through the person's reasoning and work, and finds the smallest useful next step. It can show something, investigate a source, observe a task, explain a missing relationship, or help the person try again. Across sessions it remembers the goal, work, and assistance accurately, without confusing having covered something with having understood it.

The value might be a satisfying two-minute answer or months of growing independence and judgment. We should be able to point to what became possible for the learner, rather than just how much content the agent produced.

## Coverage

| Case | Use case | Horizon | Important moment |
| --- | --- | --- | --- |
| G01 | A quick conceptual answer | Immediate | Help without turning the request into a lesson |
| G02 | “Get better at AI” | Initially unspecified → Immediate or Short-term as purpose emerges | Discover purpose without a knowledge inventory |
| G03 | Check AI-assisted vendor comparisons | Short-term | Separate AI execution from the learner's judgment |
| G04 | System-design interview preparation | Short-term | Change the approach when the learner asks |
| G05 | Understand ML evaluation | Long-term | Revisit, transfer, and correct remembered attribution |
| G06 | Spanish with family | Long-term → Short-term deadline | Practice, repair, and stay honest about modality |
| G07 | Astronomy for pleasure | Immediate; broader timeframe unspecified | Revisit an interest without curricular pressure |
| G08 | Develop a writing voice | Immediate; broader timeframe unspecified | Support intention instead of imposing the agent's taste |
| G09 | Understand a GPU through a visual | Immediate; broader timeframe unspecified | Work with an actual changing object |
| G10 | Learn deployment, then face a deadline | Short-term deadline; Immediate help | Help deliver while preserving what remains to learn |
| G11 | Experienced designer interprets data | Immediate; broader timeframe unspecified | Respect adjacent expertise and revise assumptions |
| G12 | Understand an algebraic relationship | Immediate; broader timeframe unspecified | Discover the useful foundation and return to the task |

This is a deliberately varied starting set, not every possible domain–horizon combination. Horizon means timeframe only: Immediate, Short-term, or Long-term. Actual deadlines stay explicit, and the absence of a deadline does not establish a Long-term horizon. Whether the goal has been met is a practical fact rather than a separate taxonomy. A horizon does not dictate an approach or proficiency. Familiar can be enough for a long-running interest; an expert can want a quick explanation in an unfamiliar area.

## G01 — A quick answer can be the entire experience

**Learner:** “What does HTTP 404 mean? I just want a quick answer.”

**Dewey:** “The server couldn't find the requested resource. The address may be wrong, or the resource may have moved or been removed.”

**Learner:** “That's all I needed.”

The interaction ends. A technical background questionnaire, practice exercise, or proficiency declaration would add friction. If the learner instead asks how to fix their own broken link, Dewey can start troubleshooting.

**Value and evidence:** a useful answer at the requested depth. Receiving an explanation does not demonstrate understanding. No durable profile is necessary.

**Test:** `g01-quick-answer`. A concise direct answer passes without a question, learning plan, or profile update.

## G02 — Find a direction by trying something

**Learner:** “I want to get better at AI, but I don't know where to start.”

**Dewey:** “We can start with something you actually do. Is there a recent piece of work you wished took less effort? If nothing comes to mind, we could try comparing two proposals.”

**Learner, one direction:** “I compare vendor proposals. I can get a polished table, but I don't know if I should trust it.”

**Dewey:** Offers a small fictional comparison or works with an appropriate example the learner supplies. It helps examine what supports a recommendation. This can become G03.

**Learner, another direction:** “I meant understanding the news. I'm not trying to code or automate my work. I have five minutes: does an AI explaining its answer prove it's right?”

**Dewey:** Changes direction and answers the concrete question. A convincing explanation is not sufficient verification; its claims and support still need checking. It does not defend its original work example or impose a technical curriculum.

A short menu of concrete possibilities is also a valid opening. The learner should not have to design the curriculum or list all their prerequisites.

**Profile:** emerging purpose and available time, based on what the learner said. Actual verification ability is still Unexplored. Occupation or confidence would not settle it.

**Tests:** `g02-find-purpose` / `g02-purpose-pivot`. Distinguish offering a diagnostic activity from actually starting one. Both can be useful; neither proves that diagnosis happened.

## G03 — Become able to check the AI's work

**Goal:** by next Friday, make a defensible proposal comparison with AI available. The bounded target could be Capable at checking this kind of comparison, rather than “expert at AI.”

**First session.** Fictional proposals say A costs $100/month plus $600 setup; B costs $140/month with no setup. For a 12-month contract, an AI table recommends A based only on monthly charges.

**Learner:** “A looks cheaper.”

**Dewey:** “Let's check what the table counted. What costs apply over the whole contract?”

**Learner:** “It missed setup. A is $1,800 and B is $1,680. On price alone B is cheaper.”

**Dewey:** Confirms the calculation and its scope, then helps identify non-price requirements. It can demonstrate immediately if the learner cannot start.

**Later session.** A new comparison has the lower price but insufficient support coverage. The learner checks the service requirement, rejects the cheapest option for that reason, and asks AI to revise its comparison with supporting passages. Another variation changes the contract to 24 months: the earlier price ranking should be revisited, not memorized.

**Value and evidence:** the learner directs and challenges AI around consequential criteria while delegating table construction or arithmetic. Judge and Apply become observable; a genuinely new, learner-led adjustment supplies evidence of Adapt. Preserve whether the tutor supplied the missing fee, arithmetic, or decisive comparison. In the text fixture, the omission detection and calculation are visible, but checking original documents is self-reported, not an observed tool action.

**Matched tests:** `g03-vendor-judgment` / `g03-vendor-assisted` show identical correct totals. In one, the learner finds and checks the omission; in the other, the assistant supplies everything and the learner repeats it. Neither one exchange nor a polished table establishes broad proficiency or retention. `g03-vendor-term-change` tests whether the earlier price conclusion is revisited when the contract doubles.

**Harness question:** if models distinguish these with the full transcript but fail with our summary, fix retained attribution before adding a teaching rule.

## G04 — Practice for real conditions, with permission to change course

**Learner:** “My system-design interview is in three weeks. I build APIs, but whole-system questions throw me.”

**Dewey:** Starts a small design situation. It can clarify the interview format when that changes the practice; it does not require a self-selected level. The interview is later confirmed to be a whiteboard discussion without AI. Explanations and AI help remain available during preparation.

The exercise has an app tier capable of 1,000 requests/second and a shared database capable of 100 operations/second. Every request needs one database operation; there are no caches or alternate paths.

**Learner, branch A:** “I think doubling the app servers doubles throughput. Keep guiding me; don't give me the whole answer yet.”

**Dewey:** Offers a focused hint or asks which work still reaches the same database, leaving the consequential inference to the learner.

**Learner, branch B:** “I'm stuck. Please just explain this one, then we can resume the mock.”

**Dewey:** Explains why the database still limits this simplified setup to 100 requests/second. It offers a variation afterward, without implying that databases are always the bottleneck.

Both are good teaching. Refusing branch B to maintain a Socratic style fails; giving away everything in branch A also misses the request.

**Profile:** interview goal, actual conditions, and a local observation with help supplied. This difficulty does not erase API experience. Assisted preparation does not prove unaided interview performance, and a temporary request does not establish a permanent preference.

**Matched tests:** `g04-interview-guide` / `g04-interview-explain`. Only the latest request changes.

## G05 — Carry understanding across sessions, not just completed topics

**Learner:** “Over the next few months, I want to understand whether ML results at work are convincing. I don't need to build models yet.”

**First session.** The learner assumes high training accuracy guarantees performance on new examples. Dewey explains held-out evaluation and supplies a comparison. The learner says, “Okay.” This is exposure, not a demonstration.

**Next session.** A retained note overstates what happened.

**Learner:** “You did that comparison last time. I didn't really follow it.”

**Dewey:** Accepts the correction and offers a smaller useful example. If a memory store exists, the inaccurate attribution must actually be corrected there too.

**Later variation.** A test set has 1,000 examples: 990 negative and 10 positive. A model always predicts negative and scores 99% accuracy.

**Learner:** “It's held-out data, so isn't 99% enough?”

**Dewey:** Helps inspect the missed positives and the decision the model supports. Direct explanation or a short revealing question can work. Accuracy alone cannot decide whether the model is useful.

**Learner:** “It catches none of the positives. We need to know how costly those misses are.”

**Profile:** record this particular contribution toward Judge, with the preceding help. A later real task on a different dataset can test transfer; a delayed attempt can test retention. Neither is supplied by our fictional continuation.

**Tests:** `g05-ml-attribution` / `g05-ml-transfer`. Text tests use and revision of available context. Durable correction requires an actual write and fresh-session read; “I've saved that” is not proof.

## G06 — Learn through conversation, and repair without derailing it

**Learner:** “I want to talk with my partner's family in Spanish over the next six months.”

**Dewey:** Begins a manageable exchange. If the learner cannot answer, it supplies a useful phrase and lets them try another turn. A written greeting, copied phrase, and independently spoken response are different observations.

**Later:** “The visit moved forward. I'm going in four days. Can we practice arriving?”

Dewey shifts toward useful arrival exchanges while preserving the larger conversational goal. It does not promise fluency in four days.

**Learner:** “Ayer voy a visitar a mi abuela. How do I say I went yesterday? Just tell me this one.”

**Dewey:** “Ayer fui a visitar a mi abuela.” It briefly explains the change if useful and resumes the exchange. The explanation serves the activity; it does not define a learner type.

**Profile:** changed deadline, a local tense repair, and help supplied. Typed interaction provides no pronunciation or listening evidence. An audio session could supply that later.

**Tests:** `g06-spanish-deadline` tests the change of activity; `g06-spanish-repair` tests help within it. Actual speech practice needs audio and evidence of what the learner heard and said.

## G07 — Let a long-running interest stay enjoyable

**Learner:** “I like talking about space now and then. I'm not working toward a qualification.”

In an earlier session, Dewey explained ordinary lunar phases through illumination and viewing geometry, rather than Earth covering the Moon. The learner said it helped.

**Learner, later:** “I saw a crescent again. Remind me: is that Earth covering part of it? Just a short explanation tonight.”

**Dewey:** Re-explains the distinction without “we already covered this.” A lamp-and-ball analogy might help. It does not assign homework or turn curiosity into a compulsory sequence.

If the learner later predicts illumination from another viewpoint, that contribution can be recorded. If they simply enjoy the explanation and leave, the interaction still serves its purpose.

**Profile:** interest in astronomy and tonight's requested depth. The immediate request supplies no broader timeframe or Expert target. Earlier exposure does not establish forgetting or regression.

**Test:** `g07-astronomy-return`. A concise explanation passes; compulsory assessment fails.

## G08 — Support creative intention with a real artifact

**Learner:** “I want this poem to feel unsettling, but plainspoken: ‘The kettle clicks. / Your cup stays dry. / I set the table / for one more night.’ What could I change?”

**Dewey:** Discusses a particular choice in the supplied lines and offers a reversible experiment connected to the intended effect. It can ask about ambiguity without requiring a complete artistic manifesto.

**Learner:** “Your rewrite makes it too dramatic. Keep the ordinary language and don't rewrite the whole thing.”

**Dewey:** Narrows its suggestion to a local word, break, or image. It explains the possible effect and leaves the choice with the learner.

**Later:** The learner supplies a revision and compares its effect with the original. That judgment and revision can reveal something; accepting the agent's polished rewrite by itself cannot.

**Profile:** this poem's intended effect and constraint, plus observed choices. Disagreement with the agent's taste is not a deficit. Do not infer a permanent style preference from one poem.

**Test:** `g08-poem-intent`. The runner supplies the actual text artifact. Drawing critique needs an actual image; a description cannot prove visual inspection.

## G09 — Make the visual something the learner can work with

**Learner:** “Show me how a GPU handles lots of work at once.”

Dewey chooses a useful representation, requests it, and receives a readiness event. Once the view is available, it explains visible objects and relationships. A failed render gets a useful fallback, not invented narration.

**Learner:** “Expand that part.”

If a selected object identifies the part, Dewey uses that selection. Otherwise it resolves the reference. The learner chooses one streaming multiprocessor; the renderer is still generating the close-up.

Dewey can explain the concept while waiting, but describes the old view as the old view. It discusses the new view after confirmation and does not confuse its own narration with the learner's reasoning.

**Learner:** Predicts what changing the workload would do, manipulates a supplied simulation, then compares the result. Dewey uses the discrepancy to select the next explanation, within the simulation's stated simplifications.

**Matched tests:** `g09-visual-pending` / `g09-visual-ready` change only the reported presentation state. These test reasoning about supplied text state. They do not test pixels, timing, selection, tool execution, or a renderer. Those need an environment test.

**Harness question:** the model cannot infer an undelivered screen update. Providing current artifact state and readiness is a runtime responsibility; respecting that information is then a model test.

## G10 — Let a deadline change the help, not rewrite ability

**Learner:** “We've been learning deployment, but the demo is tomorrow. Today I need a walkthrough to get it running.”

**Dewey:** Switches to demonstration and assisted work, keeping necessary checks. It preserves where the learning paused and can offer to revisit the reasoning after the demo.

**Learner:** “The AI wrote the config and you chose the commands. The preview works. Does that mean I can deploy this myself now?”

**Dewey:** Recognizes the working preview and distinguishes what the learner observed from what they selected or executed. It offers a bounded next attempt when useful, without blocking delivery to enforce a lesson.

**Profile:** deadline and temporary approach change; successful assisted preview; independent deployment unobserved. Assistance is not failure. A working preview does not establish production readiness.

**Tests:** `g10-deadline-shift` tests whether the agent changes its help; `g10-assisted-success` tests how it interprets the resulting assisted delivery. Actual execution, rollback, and permissions belong to an environment test.

## G11 — Respect expertise while discovering a local gap

**Learner:** “I've led product design for years. The AI says variant B is definitely better: 25 purchases from 100 visits versus A's 20 from 100.”

**Dewey:** Treats the difference as useful information without adopting “definitely.” It investigates how the comparison was made, rather than assuming statistical expertise from seniority.

**Learner:** “Actually A ran last week and B ran during this week's promotion. They weren't randomly assigned.”

**Dewey:** Revises the interpretation: design, promotion, and time differences are mixed together. It helps plan a better comparison or a qualified decision, instead of calculating significance as though the groups were comparable.

**Learner:** “Then we can't attribute that lift to the design. We need a comparison under comparable conditions.”

**Profile:** that reasoning with the help received; design experience remains separate. This supplies local evidence toward Judge/Adapt, not experimentation expertise. An expert can be locally Unexplored without becoming a beginner everywhere.

**Test:** `g11-revise-experiment`. Counts and assignment facts are supplied. Inspecting real analytics requires actual access.

## G12 — Teach the missing relationship, not every prerequisite

**Learner:** “I keep getting 2(x + 3) = 2x + 3. Why is mine wrong?”

**Dewey:** Shows two copies of the entire group with a small example, sketch, or direct explanation. It makes the relationship visible without requiring an arithmetic placement test.

**Learner:** “So if there are three bags, each with x red counters and two blue counters, there are 3x red and six blue?”

**Dewey:** Confirms the reasoning and, if the learner wants to continue, returns to the original problem or a useful variation.

If notation itself is the obstacle, Dewey explains it before diagnosing arithmetic. The wrong expression alone does not identify every underlying cause.

**Profile:** the error, assistance, and later applied relationship if the learner actually contributes it. One new answer after demonstration does not establish retention or general algebra proficiency.

**Test:** `g12-algebra-bridge`. A good explanation can pass without a diagnostic question. An unrelated prerequisite path or a global ability judgment fails.

## What we can test now

[The checkpoint suite](../evals/golden/README.md) turns these into identical visible contexts plus a next learner message. Exact inputs and hidden judging criteria live there. The golden replies above are illustrations; the model is not asked to imitate them. No teaching system prompt, proficiency labels, or judge feedback reaches the target.

The first comparison asks: **given relevant context, does the model choose a useful next move?** It does not establish whole-conversation adaptability, working memory storage, functioning presentation tools, retention, or learning gains. Profile notes above are proposed records; an ordinary reply cannot prove a hidden profile was updated.

After finding repeated errors, compare one change at a time with the same model and cases: truthful runtime context, better retrieval, assistance attribution, or one narrow teaching instruction. Keep the direct-answer and changed-preference controls. If a model already handles a decision well, the harness should not impose a ritual around it.

## Grounding and limits

Understanding and discovery motivates specific, revisable interpretations, adjusting help, and changed situations. AI-assisted evidence separates learner contributions from tool output. The dataset review identifies useful outside material and its limits.

Those sources support these questions, not the exact scripts or a universal proficiency scale. Review real learner experiences and artifacts before treating these draft expectations as product truth. The older profile-evidence probes ask a different question—what claim the evidence supports—and remain separate from these next-response tests.
