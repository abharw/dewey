import argparse
import asyncio
import json
from pathlib import Path

from .ingress import gateway_client, gateway_model
from .runner import catalog, run_baseline


def main() -> None:
    parser = argparse.ArgumentParser(description="Dewey model behavior experiments")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("models", help="List current Gateway model IDs and token prices")
    run = commands.add_parser("run", help="Generate unprompted openings or frozen checkpoints")
    run.add_argument("--model", action="append", required=True)
    run.add_argument("--cases", type=Path, default=Path("evals/baseline.json"))
    run.add_argument("--out", type=Path, required=True)
    run.add_argument("--repeats", type=int, default=1)
    run.add_argument("--concurrency", type=int, default=4)
    run.add_argument("--max-tokens", type=int, default=6000)
    run.add_argument("--timeout", type=float, default=90)
    run.add_argument("--limit", type=int)
    run.add_argument("--seed", type=int, default=17)
    run.add_argument("--max-estimated-usd", type=float, default=5)
    for name in ("judge", "calibrate"):
        p = commands.add_parser(name)
        if name == "judge":
            p.add_argument("run_dir", type=Path)
        else:
            p.add_argument("--fixtures", type=Path, default=Path("evals/calibration.json"))
        p.add_argument("--model", required=True)
        p.add_argument("--out", type=Path, required=True)
        p.add_argument("--max-tokens", type=int, default=4000)
        p.add_argument("--timeout", type=float, default=90)
    args = parser.parse_args()
    if args.command == "models":
        for model in catalog()["data"]:
            if model["type"] == "language":
                print(model["id"], json.dumps(model.get("pricing", {})))
        return
    if args.command == "run":
        result = asyncio.run(
            run_baseline(
                args.cases,
                args.model,
                args.out,
                repeats=args.repeats,
                concurrency=args.concurrency,
                max_tokens=args.max_tokens,
                timeout=args.timeout,
                limit=args.limit,
                seed=args.seed,
                max_estimated_usd=args.max_estimated_usd,
            )
        )
    else:
        from .judging import calibrate, judge_run

        async def evaluate():
            async with gateway_client(args.timeout) as client:
                model = gateway_model(client, args.model)
                kwargs = {
                    "model": model,
                    "judge_id": args.model,
                    "output_dir": args.out,
                    "max_tokens": args.max_tokens,
                    "timeout": args.timeout,
                }
                if args.command == "judge":
                    return await judge_run(args.run_dir, **kwargs)
                return await calibrate(fixtures_path=args.fixtures, **kwargs)

        result = asyncio.run(evaluate())
    print(json.dumps(result, indent=2))
    incomplete = (
        result.get("failed_or_invalid")
        or result.get("evaluator_failures")
        or result.get("task_failures")
    )
    calibration = result.get("calibration")
    if incomplete or (calibration and calibration["matched"] != calibration["total"]):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
