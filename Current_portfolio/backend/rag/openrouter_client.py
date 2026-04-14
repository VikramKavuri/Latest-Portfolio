"""Groq LLM API client."""

import json
import logging
import os
import re

import requests

from rag.config import (
    LLM_API_URL,
    LLM_MODEL,
    LLM_API_KEY_ENV,
    MAX_TOKENS,
    TEMPERATURE,
)

logger = logging.getLogger(__name__)


def call_openrouter(system_message: str, user_message: str) -> dict:
    """Call Groq API and return parsed JSON response."""
    api_key = os.environ.get(LLM_API_KEY_ENV)
    if not api_key:
        raise ValueError(
            f"{LLM_API_KEY_ENV} not set in environment. "
            "Add it to backend/.env"
        )

    response = requests.post(
        LLM_API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "model": LLM_MODEL,
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            "temperature": TEMPERATURE,
            "max_tokens": MAX_TOKENS,
            "response_format": {"type": "json_object"},
        },
        timeout=60,
    )

    if not response.ok:
        error_text = response.text[:300]
        logger.error(
            "Groq API error %d: %s", response.status_code, error_text
        )
        raise Exception(
            f"Groq API error: {response.status_code} - {error_text}"
        )

    data = response.json()
    content = data["choices"][0]["message"]["content"]

    # Robust JSON parsing with fallback strategies
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code block
    match = re.search(r"```(?:json)?\s*(.*?)```", content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Try first { to last }
    first = content.find("{")
    last = content.rfind("}")
    if first != -1 and last != -1:
        try:
            return json.loads(content[first : last + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError("Could not parse JSON from LLM response")
