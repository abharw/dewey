"""One SDK path to Gateway; the baseline has no teaching instructions."""

import os

from openai import AsyncOpenAI
from pydantic_ai import Agent
from pydantic_ai.models import Model
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider

GATEWAY_URL = "https://ai-gateway.vercel.sh/v1"


def gateway_client(timeout: float = 90) -> AsyncOpenAI:
    key = os.environ.get("AI_GATEWAY_API_KEY")
    if not key:
        raise ValueError("Set AI_GATEWAY_API_KEY to run model calls.")
    return AsyncOpenAI(base_url=GATEWAY_URL, api_key=key, timeout=timeout, max_retries=0)


def gateway_model(client: AsyncOpenAI, model_id: str) -> OpenAIChatModel:
    return OpenAIChatModel(model_id, provider=OpenAIProvider(openai_client=client))


def baseline_agent(model: Model) -> Agent:
    # No instructions, system prompt, tools, memory, output schema, or automatic retry.
    return Agent(model, name="dewey_baseline", retries=0)
