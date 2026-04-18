"""
Action Node — generates specific 3-5 step action checklist per opportunity.
Uses LLM to create SPECIFIC, ACTIONABLE steps (not vague instructions).

Good: "Download official transcript from FAST student portal (portal.nu.edu.pk)"
Bad:  "Prepare required documents"

Steps are ordered logically: gather → prepare → submit → follow-up
"""
from __future__ import annotations

import json
import re

from agent.state import InboxCopilotState
from config import llm_generate
from models.profile_models import StudentProfile

ACTION_PROMPT = """Generate a specific, ordered action checklist for a student to apply to this opportunity.

OPPORTUNITY:
Title: {title}
Organization: {organization}
Type: {opp_type}
Deadline: {deadline}
Required documents: {documents}
Application link: {link}
Contact email: {contact}

STUDENT CONTEXT:
Name: {name}, CGPA: {cgpa}, Program: {program} Semester {semester}
University: {university}
Past experience: {experience}

Generate exactly 4-5 SPECIFIC actionable steps. Each step must:
- Start with an action verb (Download, Write, Email, Submit, Visit, etc.)
- Be specific enough to execute without further research
- Reference actual URLs, emails, or portals where available
- Be ordered logically (gather docs → prepare application → submit → confirm)

Respond ONLY in valid JSON (no markdown):
{{
  "action_steps": [
    "<Step 1: specific action>",
    "<Step 2: specific action>",
    "<Step 3: specific action>",
    "<Step 4: specific action>"
  ]
}}"""


def action_node(state: InboxCopilotState) -> dict:
    profile = state["student_profile"]
    opps = state.get("ranked_opportunities", [])
    steps = list(state.get("reasoning_steps", []))
    steps.append(f"[action_generator] Generating action checklists for {len(opps)} opportunities...")

    updated = []
    for i, opp in enumerate(opps):
        if i > 0:
            import time
            time.sleep(1.5)  # Stagger to avoid RPM limits
            
        result = _generate_actions(opp, profile)
        action_steps = result.get("action_steps") or [
            "Review the full opportunity details carefully",
            "Gather all required documents listed in the email",
            f"Submit application before {opp.deadline or 'the stated deadline'}",
            f"Contact {opp.contact_email or 'the organization'} for any questions",
        ]
        steps.append(
            f"[action_generator] '{(opp.title or opp.email_id)[:40]}' → "
            f"{len(action_steps)} steps generated"
        )
        updated.append(opp.model_copy(update={"action_steps": action_steps}))

    return {"ranked_opportunities": updated, "reasoning_steps": steps}


def _generate_actions(opp, profile: StudentProfile) -> dict:
    prompt = ACTION_PROMPT.format(
        title=opp.title or "Opportunity",
        organization=opp.organization or "Unknown organization",
        opp_type=opp.opportunity_type or "OTHER",
        deadline=opp.deadline or "Not specified",
        documents=", ".join(opp.required_documents or ["Not specified"]),
        link=opp.application_link or "See email",
        contact=opp.contact_email or "See email",
        name=profile.name,
        cgpa=profile.cgpa,
        program=profile.program,
        semester=profile.semester,
        university=profile.university,
        experience=profile.past_experience[:300],
    )
    response = llm_generate(prompt)
    clean = re.sub(r"```(?:json)?|```", "", response).strip()
    try:
        return json.loads(clean)
    except Exception:
        return {"action_steps": []}
