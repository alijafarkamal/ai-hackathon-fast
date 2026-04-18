"""
Classifier Node — classifies ONE email per invocation as OPPORTUNITY or NOISE.
Runs in parallel for all emails via Send API.
"""
from __future__ import annotations

import json
import re

from config import llm_generate
from models.email_models import ParsedOpportunity

CLASSIFY_PROMPT = """You are an email classifier for a university student opportunity tracker.

Classify this email as OPPORTUNITY or NOISE.

OPPORTUNITY = scholarship, internship, competition, fellowship, admission, job offer,
              workshop, conference, research position, grant — something a student can apply to.
NOISE = promotional emails, newsletters, social media notifications, payment receipts,
        general announcements with no application, spam, peer messages.

EMAIL:
Subject: {subject}
From: {sender}
Body: {body}

Respond ONLY in valid JSON (no markdown, no extra text):
{{
  "classification": "OPPORTUNITY" | "NOISE",
  "confidence": <float 0.0-1.0>,
  "reason": "<one sentence explaining the classification>"
}}"""


def classifier_node_single(state: dict) -> dict:
    email = state["email"]
    steps = [
        f"[classifier] '{email.subject[:50]}' — classifying..."
    ]

    result = _classify_email(email)
    is_opp = result.get("classification") == "OPPORTUNITY"

    parsed = ParsedOpportunity(
        email_id=email.id,
        is_opportunity=is_opp,
        classification_confidence=float(result.get("confidence", 0.5)),
        classification_reason=result.get("reason", ""),
    )

    emoji = "✅" if is_opp else "🗑️"
    steps.append(
        f"[classifier] {emoji} '{email.subject[:45]}' → "
        f"{result.get('classification', 'NOISE')} "
        f"({parsed.classification_confidence:.0%}) — {parsed.classification_reason}"
    )

    return {
        "classified_emails": [parsed],
        "reasoning_steps": steps,
    }


import random
import time

def _classify_email(email) -> dict:
    prompt = CLASSIFY_PROMPT.format(
        subject=email.subject,
        sender=email.sender,
        body=email.body[:800],  # Reduced to avoid hitting Tokens Per Minute (TPM) limits on free tier
    )
    # Add random jitter to stagger the 21 parallel requests
    time.sleep(random.uniform(0.1, 1.5))
    
    response = llm_generate(prompt)
    clean = re.sub(r"```(?:json)?|```", "", response).strip()
    try:
        return json.loads(clean)
    except Exception:
        # Conservative fallback
        return {"classification": "NOISE", "confidence": 0.5, "reason": "Parse error — defaulting to NOISE"}
