"""
Extractor Node — extracts structured fields from ALL opportunities in ONE batched LLM call.
Reduces O LLM calls → 1 call.
"""
import json, re
from agent.state import InboxCopilotState
from config import llm_generate

BATCH_EXTRACT_PROMPT = """Extract structured information from ALL these opportunity emails.
Return ONLY a valid JSON array — no markdown, no extra text.
If a field is missing, use null. Deadline MUST be YYYY-MM-DD or null.

EMAILS:
{emails_text}

Return JSON array with one object per email:
[
  {{
    "email_id": "<id>",
    "title": "opportunity name",
    "organization": "sponsoring org",
    "opportunity_type": "SCHOLARSHIP|INTERNSHIP|COMPETITION|FELLOWSHIP|ADMISSION|JOB|WORKSHOP|CONFERENCE|OTHER",
    "deadline": "YYYY-MM-DD or null",
    "eligibility_criteria": ["criterion 1", "criterion 2"],
    "required_documents": ["doc 1", "doc 2"],
    "application_link": "URL or null",
    "contact_email": "email or null",
    "stipend_or_benefit": "description or null",
    "location": "location or null"
  }}
]
Include ALL {n} opportunities."""


def extractor_node(state: InboxCopilotState) -> dict:
    classified = state.get("classified_emails", [])
    raw_map = {e.id: e for e in state["raw_emails"]}

    real_opps = [e for e in classified if e.is_opportunity]
    noise_count = len(classified) - len(real_opps)

    steps = list(state.get("reasoning_steps", []))
    steps.append(f"[extractor] Batch-extracting fields from {len(real_opps)} opportunities in one LLM call...")

    if not real_opps:
        steps.append("[extractor] No real opportunities to extract.")
        return {"real_opportunities": [], "noise_count": noise_count, "reasoning_steps": steps}

    emails_text = "\n\n".join(
        f"ID: {opp.email_id}\nSubject: {raw_map[opp.email_id].subject if opp.email_id in raw_map else 'N/A'}\n"
        f"Body: {raw_map[opp.email_id].body[:800] if opp.email_id in raw_map else ''}"
        for opp in real_opps
    )

    results: dict[str, dict] = {}
    try:
        prompt = BATCH_EXTRACT_PROMPT.format(emails_text=emails_text, n=len(real_opps))
        response = llm_generate(prompt)
        clean = re.sub(r"```(?:json)?|```", "", response).strip()
        arr_match = re.search(r'\[.*\]', clean, re.DOTALL)
        if arr_match:
            for item in json.loads(arr_match.group()):
                results[item.get("email_id", "")] = item
    except Exception as e:
        steps.append(f"[extractor] ⚠️ Batch parse failed ({e}) — using subject as title")

    updated_opps = []
    for opp in real_opps:
        r = results.get(opp.email_id, {})
        email = raw_map.get(opp.email_id)
        title = r.get("title") or (email.subject if email else opp.email_id)
        steps.append(
            f"[extractor] ✓ '{title[:40]}' — type: {r.get('opportunity_type','?')}, deadline: {r.get('deadline','not found')}"
        )
        updated_opps.append(opp.model_copy(update={
            "title": title,
            "organization": r.get("organization"),
            "opportunity_type": r.get("opportunity_type") or "OTHER",
            "deadline": r.get("deadline"),
            "eligibility_criteria": r.get("eligibility_criteria") or [],
            "required_documents": r.get("required_documents") or [],
            "application_link": r.get("application_link"),
            "contact_email": r.get("contact_email"),
            "stipend_or_benefit": r.get("stipend_or_benefit"),
            "location": r.get("location"),
        }))

    return {"real_opportunities": updated_opps, "noise_count": noise_count, "reasoning_steps": steps}
