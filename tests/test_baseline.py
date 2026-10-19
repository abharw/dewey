import json

import httpx2 as httpx
import pytest
from openai import AsyncOpenAI

from dewey.ingress import baseline_agent, gateway_model
from dewey.runner import load_cases, run_baseline


@pytest.mark.asyncio
async def test_only_learner_prompt_reaches_gateway():
    """Inspect the actual SDK request, not merely Agent constructor settings."""
    requests = []

    def respond(request):
        requests.append(json.loads(request.content))
        return httpx.Response(
            200,
            json={
                "id": "test-response",
                "object": "chat.completion",
                "created": 0,
                "model": "test/model",
                "choices": [
                    {
                        "index": 0,
                        "finish_reason": "stop",
                        "message": {"role": "assistant", "content": "A useful answer."},
                    }
                ],
                "usage": {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10},
            },
        )

    async with (
        httpx.AsyncClient(transport=httpx.MockTransport(respond)) as http,
        AsyncOpenAI(
            api_key="test-only", base_url="https://example.test/v1", http_client=http, max_retries=0
        ) as client,
    ):
        agent = baseline_agent(gateway_model(client, "test/model"))
        for prompt in ("What does 404 mean?", "Help me learn Spanish."):
            result = await agent.run(prompt)
            assert result.output == "A useful answer."
    assert requests[0]["messages"] == [{"role": "user", "content": "What does 404 mean?"}]
    assert requests[1]["messages"] == [{"role": "user", "content": "Help me learn Spanish."}]
    for request in requests:
        assert not request.get("tools")
        assert "response_format" not in request


def test_cases_have_unique_ids_and_no_silent_extra_fields(tmp_path):
    from pathlib import Path

    cases = load_cases(Path("evals/baseline.json"))
    assert len(cases) == 8
    duplicate = tmp_path / "duplicate.json"
    duplicate.write_text(json.dumps([cases[0].model_dump()] * 2))
    with pytest.raises(ValueError, match="unique"):
        load_cases(duplicate)


@pytest.mark.asyncio
async def test_invalid_run_parameters_do_not_call_gateway(tmp_path):
    with pytest.raises(ValueError, match="positive"):
        await run_baseline(tmp_path / "missing.json", ["anything"], tmp_path / "run", repeats=0)
    assert not (tmp_path / "run").exists()


@pytest.mark.asyncio
async def test_runner_persists_success_and_provider_failure(tmp_path, monkeypatch):
    from pathlib import Path

    from dewey import runner

    def respond(request):
        body = json.loads(request.content)
        if body["model"] == "test/error":
            return httpx.Response(
                429, json={"error": {"message": "rate limited", "type": "rate_limit"}}
            )
        if body["model"] == "test/malformed":
            return httpx.Response(
                200,
                json={
                    "id": "bad-response",
                    "object": "chat.completion",
                    "created": 0,
                    "model": "test/malformed",
                    "choices": [],
                },
            )
        return httpx.Response(
            200,
            json={
                "id": "saved-response",
                "object": "chat.completion",
                "created": 0,
                "model": body["model"],
                "choices": [
                    {
                        "index": 0,
                        "finish_reason": "length" if body["model"] == "test/truncated" else "stop",
                        "message": {
                            "role": "assistant",
                            "content": (
                                ""
                                if body["model"] == "test/truncated"
                                else "The resource was not found."
                            ),
                        },
                    }
                ],
                "usage": {"prompt_tokens": 10, "completion_tokens": 8, "total_tokens": 18},
            },
        )

    http = httpx.AsyncClient(transport=httpx.MockTransport(respond))
    monkeypatch.setattr(
        runner,
        "gateway_client",
        lambda timeout: AsyncOpenAI(
            api_key="test-only", http_client=http, base_url="https://example.test/v1", max_retries=0
        ),
    )
    monkeypatch.setattr(
        runner,
        "catalog",
        lambda: {
            "data": [
                {
                    "id": m,
                    "type": "language",
                    "pricing": {"input": "0.000001", "output": "0.000002"},
                }
                for m in ("test/ok", "test/error", "test/malformed", "test/truncated")
            ]
        },
    )
    out = tmp_path / "run"
    summary = await run_baseline(
        Path("evals/baseline.json"),
        ["test/ok", "test/error", "test/malformed", "test/truncated"],
        out,
        limit=1,
    )
    assert summary["ok"] == 1
    assert summary["trials"] == 4
    records = [json.loads(line) for line in (out / "records.jsonl").read_text().splitlines()]
    by_model = {r["model"]: r for r in records}
    assert by_model["test/ok"]["usage"]["input_tokens"] == 10
    assert by_model["test/ok"]["resolved_models"] == ["test/ok"]
    assert by_model["test/error"]["status"] == "error"
    assert by_model["test/error"]["http_status"] == 429
    assert by_model["test/malformed"]["status"] == "harness_error"
    assert by_model["test/truncated"]["status"] == "truncated"
    assert all(r["messages"][0]["parts"][0]["part_kind"] == "user-prompt" for r in records)


@pytest.mark.asyncio
async def test_frozen_history_reaches_gateway_without_hidden_criteria_or_trial_leakage(
    tmp_path, monkeypatch
):
    from dewey import runner

    history = [
        {"role": "user", "content": "I want to compare AI vendors."},
        {"role": "assistant", "content": "What would make a vendor useful to your team?"},
    ]
    checkpoint = {
        "id": "checkpoint",
        "domain": "hidden_domain",
        "horizon": "hidden_horizon",
        "prompt": "The generated comparison looks polished, so it must be right.",
        "diagnostic_opportunity": "hidden_opportunity",
        "rubric": "hidden_rubric",
        "history": history,
        "judge_criteria": {"checks_claim": "hidden_judge_rule"},
    }
    opening = {**checkpoint, "id": "opening", "history": [], "prompt": "Just define 404."}
    cases_path = tmp_path / "cases.json"
    cases_path.write_text(json.dumps([checkpoint, opening]))
    requests = []

    def respond(request):
        requests.append(json.loads(request.content))
        return httpx.Response(
            200,
            json={
                "id": "new-response",
                "object": "chat.completion",
                "created": 0,
                "model": "test/model",
                "choices": [
                    {
                        "index": 0,
                        "finish_reason": "stop",
                        "message": {"role": "assistant", "content": "new_generated_response"},
                    }
                ],
                "usage": {"prompt_tokens": 20, "completion_tokens": 5, "total_tokens": 25},
            },
        )

    http = httpx.AsyncClient(transport=httpx.MockTransport(respond))
    monkeypatch.setattr(
        runner,
        "gateway_client",
        lambda timeout: AsyncOpenAI(
            api_key="test-only", http_client=http, base_url="https://example.test/v1", max_retries=0
        ),
    )
    monkeypatch.setattr(
        runner,
        "catalog",
        lambda: {
            "data": [
                {
                    "id": "test/model",
                    "type": "language",
                    "pricing": {"input": "0.000001", "output": "0.000002"},
                }
            ]
        },
    )
    out = tmp_path / "run"
    summary = await run_baseline(cases_path, ["test/model"], out, repeats=2)
    assert summary["ok"] == 4
    for request in requests:
        prompt = request["messages"][-1]["content"]
        expected_history = history if prompt == checkpoint["prompt"] else []
        assert request["messages"] == expected_history + [{"role": "user", "content": prompt}]
        assert "hidden_" not in json.dumps(request)
        assert "new_generated_response" not in json.dumps(request)
        assert not request.get("tools")
        assert "response_format" not in request
    records = [json.loads(line) for line in (out / "records.jsonl").read_text().splitlines()]
    for record in records:
        assert record["resolved_models"] == ["test/model"]
        assert record["provider_request_ids"] == ["new-response"]
        assert record["estimated_list_cost_usd"] == pytest.approx(0.00003)
        assert record["history"] == (history if record["case_id"] == "checkpoint" else [])
    manifest = json.loads((out / "manifest.json").read_text())
    assert manifest["case_inputs"] == {"checkpoint": "frozen_checkpoint", "opening": "opening"}
    expected_input = sum(
        len(case["prompt"].encode())
        + 100
        + sum(len(turn["content"].encode()) + 100 for turn in case["history"])
        for case in (checkpoint, opening)
    )
    assert manifest["planned_list_price_allowance_usd"] == pytest.approx(
        2 * (expected_input * 0.000001 + 2 * 6000 * 0.000002)
    )


@pytest.mark.parametrize(
    "history,criteria",
    [
        ([{"role": "user", "content": "Unanswered turn"}], {"valid": "Rule"}),
        (
            [{"role": "assistant", "content": "Wrong first"}, {"role": "user", "content": "X"}],
            {"valid": "Rule"},
        ),
        (
            [{"role": "user", "content": "A"}, {"role": "assistant", "content": "B"}],
            None,
        ),
        ([], {}),
        ([], {"valid": " "}),
    ],
)
def test_checkpoint_validation_rejects_ambiguous_history_or_empty_judges(history, criteria):
    from dewey.runner import LearningCase

    with pytest.raises(ValueError):
        LearningCase(
            id="test",
            domain="test",
            horizon="short-term",
            prompt="Latest learner message",
            diagnostic_opportunity="Hidden",
            rubric="Hidden",
            history=history,
            judge_criteria=criteria,
        )
