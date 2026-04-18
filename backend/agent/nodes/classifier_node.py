"""
Classifier Node — classifies ALL emails in ONE batched LLM call.
Reduces N LLM calls → 1 call regardless of inbox size.
"""
from __future__ import annotations
import json, re
from config import llm_generate
from models.email_models import ParsedOpportunity

BATCH_CLASSIFY_PROMPT = """You are an email classifier for a university student opportunity tracker.

Classify EVERY email below as OPPORTUNITY or NOISE.

OPPORTUNITY = scholarship, internship, competition, fellowship, admission, job offer, workshop, conference, research position, grant — something a student can apply to.
NOISE = promotional emails, newsletters, social media notifications, payment receipts, general announcements with no application, spam, peer messages.

EMAILS:
{emails_text}

Return ONLY a valid JSON array — no markdown, no extra text, no explanation:
[
  {{"id": "<email_id>", "classification": "OPPORTUNITY", "confidence": 0.95, "reason": "<one sentence>"}},
  {{"id": "<email_id>", "classification": "NOISE", "confidence": 0.90, "reason": "<one sentence>"}}
]
Include ALL {n} emails in your response."""


def classifier_node(state: dict) -> dict:
    emails = state.get("raw_emails", [])
    steps = list(state.get("reasoning_steps", []))
    steps.append(f"[classifier] Batch-classifying all {len(emails)} emails in a single LLM call...")

    if not emails:
        return {"classified_emails": [], "reasoning_steps": steps}

    emails_text = "\n\n".join(
        f"ID: {e.id}\nSubject: {e.subject}\nFrom: {e.sender}\nBody: {e.body[:600]}"
        for e in emails
    )

    results: dict[str, dict] = {}
    try:
        prompt = BATCH_CLASSIFY_PROMPT.format(emails_text=emails_text, n=len(emails))
        response = llm_generate(prompt)
        clean = re.sub(r"```(?:json)?|```", "", response).strip()
        arr_match = re.search(r'\[.*\]', clean, re.DOTALL)
        if arr_match:
            parsed = json.loads(arr_match.group())
            for item in parsed:
                results[item["id"]] = item
    except Exception as e:
        steps.append(f"[classifier] ⚠️ Batch parse failed ({e}) — defaulting all to NOISE")

    classified = []
    for email in emails:
        r = results.get(email.id, {})
        is_opp = r.get("classification", "NOISE") == "OPPORTUNITY"
        confidence = float(r.get("confidence", 0.5))
        reason = r.get("reason", "Classification unavailable")
        emoji = "✅" if is_opp else "🗑️"
        steps.append(
            f"[classifier] {emoji} '{email.subject[:45]}' → "
            f"{'OPPORTUNITY' if is_opp else 'NOISE'} ({confidence:.0%}) — {reason}"
        )
        classified.append(ParsedOpportunity(
            email_id=email.id,
            is_opportunity=is_opp,
            classification_confidence=confidence,
            classification_reason=reason,
        ))

    opp_count = sum(1 for c in classified if c.is_opportunity)
    steps.append(f"[classifier] ✓ Complete — {opp_count} opportunities, {len(classified)-opp_count} noise")
    return {"classified_emails": classified, "reasoning_steps": steps}
