"""
Extractor Node — extracts structured fields from all real opportunities in batch.
Runs ONCE after classification.
Uses instructor to guarantee JSON structure.
"""
import instructor
import google.generativeai as genai
from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import date
import os
from agent.state import InboxCopilotState

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

def extract_with_instructor(email_body: str, email_subject: str) -> ExtractionOutput:
    try:
        if os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "invalid":
            # Just grab the default model or whatever is in config
            client = instructor.from_gemini(
                client=genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-2.5-flash-preview-04-17")),
                mode=instructor.Mode.GEMINI_JSON,
            )
            return client.chat.completions.create(
                response_model=ExtractionOutput,
                messages=[{
                    "role": "user",
                    "content": f"Extract structured fields from this opportunity email.\nIf a field is not mentioned, return null.\nDeadline must be ISO format YYYY-MM-DD or null.\n\nSubject: {email_subject}\nBody: {email_body[:3000]}"
                }]
            )
        else:
            return ExtractionOutput()
    except Exception:
        return ExtractionOutput()

def extractor_node(state: InboxCopilotState) -> dict:
    classified_emails = state.get("classified_emails", [])
    raw_email_map = {e.id: e for e in state["raw_emails"]}
    
    real_opps = [e for e in classified_emails if e.is_opportunity]
    noise_count = len(classified_emails) - len(real_opps)
    
    steps = state.get("reasoning_steps", []) + [
        f"[classifier] ✓ Complete — {len(real_opps)} opportunities found, "
        f"{noise_count} noise emails filtered out of {len(classified_emails)} total.",
        f"[extractor] Extracting structured fields from {len(real_opps)} opportunities..."
    ]

    updated_opps = []
    for opp in real_opps:
        email = raw_email_map.get(opp.email_id)
        if not email:
            updated_opps.append(opp)
            continue

        extracted = extract_with_instructor(email.body, email.subject)
        steps.append(
            f"[extractor] '{extracted.title or email.subject[:35]}' — "
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

    return {"real_opportunities": updated_opps, "noise_count": noise_count, "reasoning_steps": steps}
