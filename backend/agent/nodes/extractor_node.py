"""
Extractor Node — extracts structured fields from all real opportunities in batch.
Uses Groq-based JSON extraction with instructor as optional enhancement.
Falls back gracefully at every layer.
"""
import json
import re
import os
from pydantic import BaseModel
from typing import Optional, List, Literal
from agent.state import InboxCopilotState
from config import llm_generate

class ExtractionOutput(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    opportunity_type: Optional[Literal[
        "SCHOLARSHIP", "INTERNSHIP", "COMPETITION", "FELLOWSHIP",
        "ADMISSION", "JOB", "WORKSHOP", "CONFERENCE", "OTHER"
    ]] = None
    deadline: Optional[str] = None  # "YYYY-MM-DD" or null
    eligibility_criteria: Optional[List[str]] = None
    required_documents: Optional[List[str]] = None
    application_link: Optional[str] = None
    contact_email: Optional[str] = None
    stipend_or_benefit: Optional[str] = None
    location: Optional[str] = None

EXTRACT_PROMPT = """Extract structured information from this opportunity email.
Return ONLY valid JSON with no markdown, no code fences.
If a field is not clearly mentioned, use null.
Deadline MUST be in YYYY-MM-DD format or null.

Subject: {subject}
Body: {body}

Return JSON with exactly these fields:
{{
  "title": "opportunity name/title",
  "organization": "sponsoring organization name",
  "opportunity_type": "SCHOLARSHIP|INTERNSHIP|COMPETITION|FELLOWSHIP|ADMISSION|JOB|WORKSHOP|CONFERENCE|OTHER",
  "deadline": "YYYY-MM-DD or null",
  "eligibility_criteria": ["criterion 1", "criterion 2"],
  "required_documents": ["document 1", "document 2"],
  "application_link": "URL or null",
  "contact_email": "email or null",
  "stipend_or_benefit": "description or null",
  "location": "location or null"
}}"""


def extract_opportunity(email_subject: str, email_body: str) -> ExtractionOutput:
    """Extract structured fields using LLM. Multiple fallback layers."""
    # Layer 1: Try instructor with Gemini
    try:
        import instructor
        import google.generativeai as genai
        if os.getenv("GEMINI_API_KEY"):
            client = instructor.from_gemini(
                client=genai.GenerativeModel("gemini-1.5-flash"),
                mode=instructor.Mode.GEMINI_JSON,
            )
            return client.chat.completions.create(
                response_model=ExtractionOutput,
                messages=[{"role": "user", "content": EXTRACT_PROMPT.format(
                    subject=email_subject, body=email_body[:3000]
                )}]
            )
    except Exception:
        pass

    # Layer 2: Use llm_generate (Gemini or Groq) with JSON parsing
    try:
        prompt = EXTRACT_PROMPT.format(subject=email_subject, body=email_body[:3000])
        response = llm_generate(prompt)
        clean = re.sub(r"```(?:json)?|```", "", response).strip()
        # Extract JSON object even if surrounded by text
        match = re.search(r'\{.*\}', clean, re.DOTALL)
        if match:
            data = json.loads(match.group())
            return ExtractionOutput(**{k: v for k, v in data.items() if k in ExtractionOutput.model_fields})
    except Exception as e:
        print(f"[extractor] LLM extraction failed: {e}")

    # Layer 3: Return empty (graceful degradation)
    return ExtractionOutput(title=email_subject)


def extractor_node(state: InboxCopilotState) -> dict:
    classified_emails = state.get("classified_emails", [])
    raw_email_map = {e.id: e for e in state["raw_emails"]}

    real_opps = [e for e in classified_emails if e.is_opportunity]
    noise_count = len(classified_emails) - len(real_opps)

    steps = list(state.get("reasoning_steps", []))
    steps.append(
        f"[classifier] ✓ Complete — {len(real_opps)} opportunities found, "
        f"{noise_count} noise emails filtered out of {len(classified_emails)} total."
    )
    steps.append(f"[extractor] Extracting structured fields from {len(real_opps)} opportunities...")

    updated_opps = []
    for opp in real_opps:
        email = raw_email_map.get(opp.email_id)
        if not email:
            updated_opps.append(opp)
            continue

        try:
            extracted = extract_opportunity(email.subject, email.body)
            steps.append(
                f"[extractor] ✓ '{extracted.title or email.subject[:35]}' — "
                f"type: {extracted.opportunity_type or '?'}, "
                f"deadline: {extracted.deadline or 'not found'}"
            )
            updated = opp.model_copy(update={
                "title": extracted.title or email.subject,
                "organization": extracted.organization,
                "opportunity_type": extracted.opportunity_type or "OTHER",
                "deadline": extracted.deadline,
                "eligibility_criteria": extracted.eligibility_criteria or [],
                "required_documents": extracted.required_documents or [],
                "application_link": extracted.application_link,
                "contact_email": extracted.contact_email,
                "stipend_or_benefit": extracted.stipend_or_benefit,
                "location": extracted.location,
            })
            updated_opps.append(updated)
        except Exception as e:
            steps.append(f"[extractor] ⚠️ Extraction failed for '{opp.email_id}' — using defaults: {e}")
            updated_opps.append(opp.model_copy(update={"title": email.subject, "opportunity_type": "OTHER"}))

    return {"real_opportunities": updated_opps, "noise_count": noise_count, "reasoning_steps": steps}
