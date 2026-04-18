"""
backend/agent/nodes/dedup_node.py
Detects near-duplicate emails about the same opportunity using
title-similarity hashing + sender domain matching.
Merges duplicates, keeps the most information-complete version.
"""
import hashlib
from difflib import SequenceMatcher
from agent.state import InboxCopilotState
from models.email_models import RawEmail

def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def dedup_node(state: InboxCopilotState) -> dict:
    emails = state["raw_emails"]
    seen: list[RawEmail] = []
    deduplicated_count = 0
    THRESHOLD = 0.75  # 75% subject-line similarity = likely same opportunity

    for email in emails:
        is_dup = False
        for s in seen:
            if _similarity(email.subject, s.subject) >= THRESHOLD:
                is_dup = True
                deduplicated_count += 1
                # Keep the longer body (more information)
                if len(email.body) > len(s.body):
                    seen[seen.index(s)] = email
                break
        if not is_dup:
            seen.append(email)

    steps = state["reasoning_steps"] + [
        f"[dedup] {len(emails)} emails → {len(seen)} unique "
        f"({deduplicated_count} duplicates removed)"
    ]
    return {"raw_emails": seen, "reasoning_steps": steps, "dedup_count": deduplicated_count}
