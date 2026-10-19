import json

import pytest
from pydantic_ai.models.test import TestModel

from dewey.judging import calibrate, judge_run


@pytest.mark.asyncio
async def test_judge_is_blind_and_keeps_saved_outputs_distinct(tmp_path):
    source = tmp_path / "source"
    source.mkdir()
    (source / "cases.json").write_text(
        json.dumps(
            [
                {
                    "id": "question",
                    "prompt": "What does 404 mean?",
                    "horizon": "immediate",
                    "rubric": "Answer the question directly.",
                }
            ]
        )
    )
    records = [
        {
            "id": "private-record-a",
            "case_id": "question",
            "model": "private-model-a",
            "status": "ok",
            "output": "Response alpha.",
        },
        {
            "id": "private-record-b",
            "case_id": "question",
            "model": "private-model-b",
            "status": "ok",
            "output": "Response beta.",
        },
        {
            "id": "private-error-c",
            "case_id": "question",
            "model": "private-model-c",
            "status": "error",
            "output": None,
        },
    ]
    (source / "records.jsonl").write_text("\n".join(json.dumps(r) for r in records))
    output = tmp_path / "judgment"
    summary = await judge_run(source, TestModel(), "test-judge", output)
    assert summary["judged_responses"] == 2
    assert summary["judge_calls"] == 6
    assert summary["evaluator_failures"] == 0
    assert summary["excluded"] == [{"id": "private-error-c", "status": "error"}]
    for path in (output / "audits").glob("*.json"):
        audit = json.loads(path.read_text())
        messages = json.dumps(audit["messages"])
        assert "private-model" not in messages
        assert "private-record" not in messages
        assert "saved_output" not in messages
        assert "What does 404 mean?" in messages
        assert ("Response alpha." in messages) != ("Response beta." in messages)
        assert audit["captured_response_count"] == 1
    with pytest.raises(FileExistsError):
        await judge_run(source, TestModel(), "test-judge", output)


@pytest.mark.asyncio
async def test_checkpoint_judge_sees_history_and_only_case_specific_criteria(tmp_path):
    fixtures = [
        {
            "id": "private-checkpoint",
            "prompt": "The model got 99% on its practice examples.",
            "history": [
                {"role": "user", "content": "I want to judge a business claim, not write code."},
                {"role": "assistant", "content": "Which result supports the claim?"},
            ],
            "rubric": "Judge the current answer using the learner's stated purpose.",
            "judge_criteria": {
                "uses_purpose": "Respects the business evaluation purpose.",
                "checks_generalization": "Distinguishes practice results from new examples.",
            },
            "response": "Evaluate it on new examples representative of your business use.",
            "expected": {"uses_purpose": True, "checks_generalization": True},
        },
        {
            "id": "private-opening",
            "prompt": "Just tell me what 404 means.",
            "history": [],
            "rubric": "A direct answer is sufficient.",
            "judge_criteria": {"answers_directly": "Explains the missing resource briefly."},
            "response": "The server could not find the requested resource.",
            "expected": {"answers_directly": True},
        },
    ]
    fixture_path = tmp_path / "fixtures.json"
    fixture_path.write_text(json.dumps(fixtures))
    output = tmp_path / "calibration"
    summary = await calibrate(TestModel(), "test-judge", output, fixtures_path=fixture_path)
    assert summary["judge_calls"] == 3
    assert summary["calibration"]["total"] == 3
    for path in (output / "audits").glob("*.json"):
        messages = json.dumps(json.loads(path.read_text())["messages"])
        assert "private-checkpoint" not in messages
        assert "private-opening" not in messages
        assert "saved_output" not in messages
        assert "appropriate_opening" not in messages
        assert "inventory_burden" not in messages
        if "private-checkpoint" in path.name:
            assert "I want to judge a business claim, not write code." in messages
            assert "Which result supports the claim?" in messages
            assert "The model got 99% on its practice examples." in messages
            assert "Judge the current answer using the learner's stated purpose." not in messages
            assert ("Respects the business evaluation purpose." in messages) != (
                "Distinguishes practice results from new examples." in messages
            )
        else:
            assert "Explains the missing resource briefly." in messages
            assert "I want to judge a business claim" not in messages


@pytest.mark.asyncio
async def test_calibration_rejects_unchecked_expectations_before_creating_output(tmp_path):
    fixtures = tmp_path / "fixtures.json"
    fixtures.write_text(
        json.dumps(
            [
                {
                    "id": "incomplete",
                    "judge_criteria": {"actual_criterion": "Some rule."},
                    "expected": {"different_criterion": True},
                }
            ]
        )
    )
    out = tmp_path / "calibration"
    with pytest.raises(ValueError, match="must match"):
        await calibrate(TestModel(), "test-judge", out, fixtures_path=fixtures)
    assert not out.exists()
