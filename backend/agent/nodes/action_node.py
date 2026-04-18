"""
Action Node — generates action checklists for ALL opportunities in ONE batched LLM call.
Reduces O LLM calls → 1 call.
"""
from __future__ import annotations
import json, re
from agent.state import InboxCopilotState
from config import llm_generate
from models.profile_models import StudentProfile

BATCH_ACTION_PROMPT = """Generate specific, ordered action checklists for a student to apply to each opportunity below.

STUDENT: {name} | CGPA: {cgpa} | {degree} {program} Semester {semester} at {university}

OPPORTUNITIES:
{opps_text}

For EACH opportunity generate exactly 4 steps. Each step must:
- Start with an action verb (Download, Write, Email, Visit, Submit, Collect)
- Be specific enough to execute without further research
- Reference actual URLs/emails/portals where available
- Be ordered: gather docs → prepare → submit → confirm

Return ONLY a valid JSON array — no markdown:
[
  {{
    "email_id": "<id>",
    "action_steps": [
      "Step 1: specific action",
      "Step 2: specific action",
      "Step 3: specific action",
      "Step 4: specific action"
    ]
  }}
]
Include ALL {n} opportunities."""


def action_node(state: InboxCopilotState) -> dict:
    profile = state["student_profile"]
    opps = state.get("ranked_opportunities", [])
    steps = list(state.get("reasoning_steps", []))
    steps.append(f"[action_generator] Batch-generating action checklists for {len(opps)} opportunities in one LLM call...")

    if not opps:
        return {"ranked_opportunities": opps, "reasoning_steps": steps}

    opps_text = "\n\n".join(
        f"ID: {opp.email_id}\nTitle: {opp.title or 'Opportunity'}\nOrg: {opp.organization or 'Unknown'}\n"
        f"Type: {opp.opportunity_type} | Deadline: {opp.deadline or 'Not specified'}\n"
        f"Docs needed: {', '.join(opp.required_documents or ['Not specified'])}\n"
        f"Apply at: {opp.application_link or 'See email'} | Contact: {opp.contact_email or 'See email'}"
        for opp in opps
    )

    results: dict[str, list] = {}
    try:
        prompt = BATCH_ACTION_PROMPT.format(
            name=profile.name, cgpa=profile.cgpa,
            degree=profile.degree, program=profile.program,
            semester=profile.semester, university=profile.university,
            opps_text=opps_text, n=len(opps),
        )
        response = llm_generate(prompt)
        clean = re.sub(r"```(?:json)?|```", "", response).strip()
        arr_match = re.search(r'\[.*\]', clean, re.DOTALL)
        if arr_match:
            for item in json.loads(arr_match.group()):
                results[item.get("email_id", "")] = item.get("action_steps", [])
    except Exception as e:
        steps.append(f"[action_generator] ⚠️ Batch parse failed ({e}) — using defaults")

    updated = []
    for opp in opps:
        action_steps = results.get(opp.email_id) or [
            f"Download official transcript from FAST student portal",
            f"Prepare a 500-word personal statement highlighting your {opp.opportunity_type or 'opportunity'} goals",
            f"Submit application via {opp.application_link or 'the link provided in the email'} before {opp.deadline or 'stated deadline'}",
            f"Email confirmation to {opp.contact_email or 'the organization'} after submitting",
        ]
        steps.append(f"[action_generator] '{(opp.title or opp.email_id)[:40]}' → {len(action_steps)} steps")
        updated.append(opp.model_copy(update={"action_steps": action_steps}))

    return {"ranked_opportunities": updated, "reasoning_steps": steps}
