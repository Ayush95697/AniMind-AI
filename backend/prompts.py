# prompts.py
"""
Utilities for building LLM-ready messages based on:
- selected character (goku / vegeta / itachi)
- conversation history
- current user message
"""

from typing import List, Dict, Any

# Support both "backend.characters" and plain "characters" import styles
try:
    from .characters import CHARACTERS  # type: ignore
except ImportError:
    from characters import CHARACTERS  # type: ignore


def _get_character_config(character_id: str) -> Dict[str, Any]:
    """
    Return the config dict for the given character_id.
    If the character_id is unknown, default to 'goku'.
    """
    if character_id not in CHARACTERS:
        character_id = "goku"
    return CHARACTERS[character_id]


def _trim_history(history: List[Dict[str, str]], max_messages: int = 20) -> List[Dict[str, str]]:
    """
    Limit the number of past messages to avoid very long prompts.
    Keeps the most recent `max_messages` entries.
    """
    if history is None:
        return []
    if len(history) <= max_messages:
        return history
    return history[-max_messages:]


def build_chat_messages(
    character_id: str,
    user_message: str,
    history: List[Dict[str, str]] | None = None,
    max_history_messages: int = 20,
) -> List[Dict[str, str]]:
    """
    Build a list of {role, content} messages ready to send to an LLM.

    Inputs:
        character_id:   "goku", "vegeta", or "itachi" (falls back to "goku" if unknown)
        user_message:   the latest user message (string)
        history:        list of past messages, each like {"role": "...", "content": "..."}
        max_history_messages: maximum number of history messages to include

    Output:
        messages: list of dicts in this format:
            [
                {"role": "system", "content": "<character system prompt>"},
                {"role": "user", "content": "..."},
                {"role": "assistant", "content": "..."},
                ...
                {"role": "user", "content": "<latest user message>"}
            ]
    """
    if history is None:
        history = []

    # 1) Get the character configuration
    char_cfg = _get_character_config(character_id)
    system_prompt = (char_cfg.get("system_prompt") or "").strip()

    # 2) Start with the system message (persona definition)
    messages: List[Dict[str, str]] = [{
        "role": "system",
        "content": system_prompt,
    }]

    # 3) Add trimmed conversation history
    trimmed_history = _trim_history(history, max_messages=max_history_messages)

    # Ensure history entries are in the correct shape: {"role": "...", "content": "..."}
    for msg in trimmed_history:
        role = msg.get("role")
        content = msg.get("content")
        if not role or not content:
            # Skip malformed entries
            continue
        messages.append({
            "role": role,
            "content": content,
        })

    # 4) Append the current user message
    messages.append({
        "role": "user",
        "content": user_message,
    })

    return messages
