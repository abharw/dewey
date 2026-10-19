"""Bounded opening and frozen-history experiments. Rubrics never enter the target agent."""

import asyncio
import hashlib
import importlib.metadata
import json
import os
import random
import time
from dataclasses import asdict
from datetime import UTC, datetime
from pathlib import Path
from typing import Annotated, Literal
from urllib.request import urlopen

from openai import APIError
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, TypeAdapter, model_validator
from pydantic_ai import capture_run_messages
from pydantic_ai.exceptions import AgentRunError
from pydantic_ai.messages import (
    ModelMessage,
    ModelMessagesTypeAdapter,
    ModelRequest,
    ModelResponse,
    TextPart,
    UserPromptPart,
)
from pydantic_ai.usage import UsageLimits

from .ingress import GATEWAY_URL, baseline_agent, gateway_client, gateway_model


class HistoryTurn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    role: Literal["user", "assistant"]
    content: Annotated[str, StringConstraints(pattern=r"\S")]


JudgeCriteria = Annotated[
    dict[
        Annotated[str, StringConstraints(pattern=r"^[a-z][a-z0-9_]*$")],
        Annotated[str, StringConstraints(pattern=r"\S")],
    ],
    Field(min_length=1),
]


class LearningCase(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    domain: str
    horizon: str | None
    prompt: str
    diagnostic_opportunity: str
    rubric: str
    history: list[HistoryTurn] = Field(default_factory=list)
    judge_criteria: JudgeCriteria | None = None

    @model_validator(mode="after")
    def validate_checkpoint(self):
        expected_roles = ["user", "assistant"] * (len(self.history) // 2)
        if [turn.role for turn in self.history] != expected_roles:
            raise ValueError("History must alternate user/assistant and end with assistant.")
        if self.history and self.judge_criteria is None:
            raise ValueError("Frozen checkpoints require case-specific judge_criteria.")
        return self

    def native_history(self) -> list[ModelMessage]:
        """Fresh native SDK messages per trial; never reuse a target model's earlier output."""
        return [
            ModelRequest(parts=[UserPromptPart(content=turn.content)])
            if turn.role == "user"
            else ModelResponse(parts=[TextPart(content=turn.content)])
            for turn in self.history
        ]


def load_cases(path: Path) -> list[LearningCase]:
    cases = TypeAdapter(list[LearningCase]).validate_json(path.read_bytes())
    if not cases or len({case.id for case in cases}) != len(cases):
        raise ValueError("Cases must be nonempty with unique IDs.")
    return cases


def catalog() -> dict:
    with urlopen(f"{GATEWAY_URL}/models", timeout=30) as response:
        return json.load(response)


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


async def run_baseline(
    cases_path: Path,
    model_ids: list[str],
    out: Path,
    *,
    repeats: int = 1,
    concurrency: int = 4,
    max_tokens: int = 6000,
    timeout: float = 90,
    limit: int | None = None,
    seed: int = 17,
    max_estimated_usd: float = 5,
) -> dict:
    if min(repeats, concurrency, max_tokens) < 1 or timeout <= 0:
        raise ValueError("Repeats, concurrency, tokens and timeout must be positive.")
    if limit is not None and limit < 1:
        raise ValueError("Limit must be positive.")
    if not model_ids or len(set(model_ids)) != len(model_ids):
        raise ValueError("Choose distinct model IDs.")
    cases = load_cases(cases_path)[:limit]
    models_catalog = await asyncio.to_thread(catalog)
    available = {m["id"]: m for m in models_catalog["data"]}
    for name in model_ids:
        if name not in available or available[name]["type"] != "language":
            raise ValueError(f"Not a language model in Gateway's current catalog: {name}")
    # Conservative input allowance for these short prompts, plus full output allowance.
    # This is list-price planning, not a billing guarantee or account spending limit.
    estimate = (
        sum(
            sum(
                (
                    len(c.prompt.encode())
                    + sum(len(turn.content.encode()) + 100 for turn in c.history)
                    + 100
                )
                * float(available[m]["pricing"]["input"])
                + max_tokens * float(available[m]["pricing"]["output"])
                for c in cases
            )
            for m in model_ids
        )
        * repeats
    )
    if estimate > max_estimated_usd:
        raise ValueError(f"Planned list-price allowance ${estimate:.2f} exceeds limit.")

    # Check auth configuration before creating an output folder. Each run is immutable.
    client = gateway_client(timeout)
    out.mkdir(parents=True, exist_ok=False)
    serialized_cases = [c.model_dump() for c in cases]
    write_json(out / "cases.json", serialized_cases)
    write_json(out / "catalog.json", models_catalog)
    manifest = {
        "started_at": datetime.now(UTC).isoformat(),
        "condition": "no_system_prompt",
        "system_prompt": None,
        "instructions": None,
        "tools": [],
        "history_policy": "Fixed authored history from each case; no generated turns carried over",
        "case_inputs": {
            case.id: "frozen_checkpoint" if case.history else "opening" for case in cases
        },
        "models": model_ids,
        "api_base": GATEWAY_URL,
        "api": "chat_completions",
        "settings": {"max_tokens": max_tokens, "timeout": timeout},
        "reasoning_effort": "provider_default",
        "temperature": "provider_default",
        "sdk_retries": 0,
        "agent_retries": 0,
        "repeats": repeats,
        "concurrency": concurrency,
        "shuffle_seed": seed,
        "planned_list_price_allowance_usd": estimate,
        "cases_sha256": hashlib.sha256((out / "cases.json").read_bytes()).hexdigest(),
        "code_sha256": {
            p.name: hashlib.sha256(p.read_bytes()).hexdigest()
            for p in Path(__file__).parent.glob("*.py")
        },
        "versions": {
            p: importlib.metadata.version(p)
            for p in ("pydantic-ai-slim", "pydantic-evals", "openai", "dewey")
        },
    }
    write_json(out / "manifest.json", manifest)
    trials = [(c, m, n) for c in cases for m in model_ids for n in range(1, repeats + 1)]
    random.Random(seed).shuffle(trials)
    semaphore = asyncio.Semaphore(concurrency)

    async def run_one(case: LearningCase, model_id: str, trial: int) -> dict:
        async with semaphore:
            started = time.perf_counter()
            record = {
                "id": f"{case.id}__{model_id.replace('/', '_')}__{trial}",
                "case_id": case.id,
                "model": model_id,
                "trial": trial,
                "started_at": datetime.now(UTC).isoformat(),
                "prompt": case.prompt,
                "history": [turn.model_dump() for turn in case.history],
                "input_kind": "frozen_checkpoint" if case.history else "opening",
                "status": "error",
                "output": None,
            }
            with capture_run_messages() as messages:
                try:
                    agent = baseline_agent(gateway_model(client, model_id))
                    async with asyncio.timeout(timeout):
                        result = await agent.run(
                            case.prompt,
                            message_history=case.native_history(),
                            model_settings={"max_tokens": max_tokens, "timeout": timeout},
                            usage_limits=UsageLimits(request_limit=1),
                        )
                    record["output"] = result.output
                    record["usage"] = asdict(result.usage)
                    response = result.response
                    record["finish_reason"] = response.finish_reason
                    record["status"] = (
                        "ok"
                        if result.output.strip() and response.finish_reason == "stop"
                        else "truncated"
                        if response.finish_reason == "length"
                        else "invalid"
                    )
                except (AgentRunError, APIError, TimeoutError) as exc:
                    # Keep a useful error, explicitly redacting the only injected credential.
                    record["error_type"] = type(exc).__name__
                    record["http_status"] = getattr(exc, "status_code", None)
                    record["error"] = str(exc).replace(
                        os.environ.get("AI_GATEWAY_API_KEY", "__no_key__"), "[REDACTED]"
                    )[:1500]
                except Exception as exc:  # noqa: BLE001 -- isolate unexpected SDK/harness failures
                    record["status"] = "harness_error"
                    record["error_type"] = type(exc).__name__
                    record["error"] = str(exc).replace(
                        os.environ.get("AI_GATEWAY_API_KEY", "__no_key__"), "[REDACTED]"
                    )[:1500]
                record["messages"] = json.loads(ModelMessagesTypeAdapter.dump_json(messages))
            record["latency_seconds"] = round(time.perf_counter() - started, 3)
            # Authored assistant messages are input, not provider responses or billable outputs.
            responses = [
                m for m in messages[len(case.history) :] if isinstance(m, ModelResponse)
            ]
            if responses and responses[-1].finish_reason == "length":
                record["status"] = "truncated"
                record["finish_reason"] = "length"
            record["resolved_models"] = [m.model_name for m in responses]
            record["provider_request_ids"] = [m.provider_response_id for m in responses]
            price = available[model_id]["pricing"]
            record["estimated_list_cost_usd"] = sum(
                m.usage.input_tokens * float(price["input"])
                + m.usage.output_tokens * float(price["output"])
                for m in responses
            )
            with (out / "records.jsonl").open("a") as f:
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
            print(
                f"{model_id} {case.id}: {record['status']} ({record['latency_seconds']}s)",
                flush=True,
            )
            return record

    async with client:
        records = await asyncio.gather(*(run_one(*t) for t in trials))
    summary = {
        "finished_at": datetime.now(UTC).isoformat(),
        "trials": len(records),
        "ok": sum(r["status"] == "ok" for r in records),
        "estimated_list_cost_usd": sum(r["estimated_list_cost_usd"] for r in records),
        "failed_or_invalid": [r["id"] for r in records if r["status"] != "ok"],
    }
    write_json(out / "summary.json", summary)
    return summary
