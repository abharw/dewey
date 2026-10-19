# Dewey

A personal learning skill for AI agents. Dewey teaches the way I want to learn: it starts from what you're curious about, figures out what you already understand from your questions and your work, and keeps a small Markdown record so the next session continues where this one stopped.

> **Work in progress.** The skill and evals are usable; the lesson viewer is an early prototype.

## Why

Aristotle argued that everything has a function, an *ergon*: a knife exists to cut, an eye to see. A thing is good when it does its function well. He thought the human function was to reason. I'd put it as thinking with intention, and I think learning is still the most important skill we have.

With AI, that's getting harder to do. It's easy to get the answer without understanding it. So I built Dewey to help me learn concepts on purpose: it asks what I already know, lets me reason before it explains, and keeps track of what I've actually understood versus what it just handed me. It also draws interactive visuals right inside Claude and ChatGPT using MCP Apps, which I think more people should be building with!

## What's here

| Path | What it is |
| --- | --- |
| [`skills/dewey/`](skills/dewey/SKILL.md) | The skill, in the [Agent Skills](https://agentskills.io) format. [`SOUL.md`](skills/dewey/SOUL.md) holds the teaching principles; `references/` covers discovery, learning paths, teaching, review, and the learner workspace. |
| [`apps/lesson-viewer/`](apps/lesson-viewer) | An [MCP App](https://github.com/modelcontextprotocol/ext-apps). It renders lessons inside the chat (an interactive simulation, or a Manim video followed by a question) and reports what the learner did back to the agent. |
| [`evals/`](evals/golden/README.md) | Model evals built on Pydantic AI and Pydantic Evals: 20 frozen checkpoints of learning conversations, judged against hidden per-case rubrics. |
| [`results/`](results/golden-comparison.md) | One dated run: 160 responses from four models, with 328 automated judgments and a manual review of every response. |
| [`docs/`](docs/golden-interactions.md) | The 12 learning experiences the evals are drawn from, plus the vocabulary Dewey uses for proficiency and evidence. |

## How it works

- **Learning with the agent.** Install the skill in any agent that supports skills. Dewey works with the tools the host already has (files, search, code execution) and keeps its notes in `~/.dewey`: goals, sessions, and evidence-backed proficiency notes. It separates what the learner did from what the agent supplied, so finishing something with AI help doesn't count as understanding it.
- **Showing instead of telling.** When a picture or a simulation explains something better than text, the agent opens a lesson in the MCP App. The learner works with the lesson directly in the conversation, and the viewer sends a snapshot of their state back to the agent so the next step can respond to what they actually did.
- **Measuring the behavior.** The evals check single decisions, such as whether a reply answers a quick question without forcing an onboarding flow, notices a corrected premise, or leaves room to reason when the learner asked for guidance. They measure next-response behavior only. They don't show that anyone learned.

## Run it

```bash
uv sync
uv run pytest -q
uv run dewey models            # model calls go through the Vercel AI Gateway; needs AI_GATEWAY_API_KEY
```

The lesson viewer:

```bash
cd apps/lesson-viewer
npm install
npm run build && npm test
npm start                      # MCP server over stdio
```

See [`evals/golden/README.md`](evals/golden/README.md) for the calibrate, run, and judge commands.

## Credits

The token-bucket lesson was generated with [Anatomy](https://github.com/wheresryan22/anatomy) (MIT, see [its license](apps/lesson-viewer/LICENSE-anatomy)). The viewer restyles the page around it but keeps that lesson's original diagram, colors, and simulation.
