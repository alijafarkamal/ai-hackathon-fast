"""
Profile Matcher Node — matches each opportunity against the student profile.

Produces: fit_score (0-1), fit_evidence (what matches), fit_gaps (what doesn't).

Strategy: LLM for nuanced understanding + deterministic CGPA/degree checks.
fit_evidence MUST reference actual profile values, e.g.:
  "Your CGPA 3.53 exceeds the minimum requirement of 3.0"
  "Your skills (Python, LangChain) match the required technical stack"
  "Fellowship type matches your preferred opportunity types"

fit_gaps must be honest about real barriers:
  "Requires US citizenship — you are a Pakistani national"
  "Requires completed Bachelor's degree — you graduate in 2027"

why_this_matters: 1-2 personal sentences using THIS student's specific background.
"""
from __future__ import annotations

import json
import re

from agent.state import InboxCopilotState
from config import llm_generate
from models.profile_models import StudentProfile

MATCH_PROMPT = """You are evaluating how well a student profile matches a specific opportunity.
Be precise and reference actual profile values in your analysis.

OPPORTUNITY:
Title: {title}
Type: {opp_type}
Eligibility requirements: {eligibility}
Location: {location}
Deadline: {deadline}
Stipend/Benefit: {benefit}

STUDENT PROFILE:
Name: {name}
Degree: {degree} in {program}, Semester {semester}, CGPA: {cgpa}
Skills: {skills}
Interests: {interests}
Preferred opportunity types: {preferred_types}
Financial need: {financial_need}
Location preference: {location_pref}
Nationality: {nationality}
Past experience: {experience}
Graduation year: {grad_year}

Generate a detailed fit analysis in valid JSON (no markdown, no extra text):
{{
  "fit_score": <float 0.0-1.0>,
  "fit_evidence": [
    "<specific match reason citing actual profile data, e.g. 'Your CGPA 3.53 exceeds minimum 3.0'>",
    "<another specific match>"
  ],
  "fit_gaps": [
    "<specific barrier, e.g. 'Requires US citizenship but you are Pakistani'>",
    "<another gap if any>"
  ],
  "why_this_matters": "<1-2 sentences explaining why THIS opportunity is personally relevant to THIS student using their specific background and goals>"
}}

Rules:
- fit_evidence MUST reference actual profile values (CGPA number, skill names, etc.)
- fit_score: 0.9+ = excellent match, 0.7-0.9 = good match, 0.5-0.7 = moderate, <0.5 = poor
- If fit_gaps is empty, use []
- why_this_matters must be SPECIFIC and PERSONAL, not generic boilerplate
- Consider: degree match, CGPA match, skills match, nationality, location, opportunity type preference
"""


def profile_matcher_node(state: InboxCopilotState) -> InboxCopilotState:
    profile = state["student_profile"]
    opps = state.get("real_opportunities", [])
    steps = list(state.get("reasoning_steps", []))
    steps.append(
        f"[profile_matcher] Matching {len(opps)} opportunities against student profile "
        f"({profile.name}, CGPA {profile.cgpa}, {profile.degree} {profile.program})..."
    )

    updated = []
    for opp in opps:
        result = _match(opp, profile)
        fit = result.get("fit_score", 0.5)
        evidence_count = len(result.get("fit_evidence", []))
        gap_count = len(result.get("fit_gaps", []))
        steps.append(
            f"[profile_matcher] '{(opp.title or opp.email_id)[:40]}' → "
            f"fit: {fit:.0%} ({evidence_count} matches, {gap_count} gaps)"
        )
        updated.append(opp.model_copy(update={
            "fit_score": float(fit),
            "fit_evidence": result.get("fit_evidence", []),
            "fit_gaps": result.get("fit_gaps", []),
            "why_this_matters": result.get("why_this_matters", ""),
        }))

    return {**state, "real_opportunities": updated, "reasoning_steps": steps}


def _match(opp, profile: StudentProfile) -> dict:
    prompt = MATCH_PROMPT.format(
        title=opp.title or "Unknown",
        opp_type=opp.opportunity_type or "OTHER",
        eligibility=", ".join(opp.eligibility_criteria or []) or "Not specified",
        location=opp.location or "Not specified",
        deadline=opp.deadline or "Not specified",
        benefit=opp.stipend_or_benefit or "Not specified",
        name=profile.name,
        degree=profile.degree,
        program=profile.program,
        semester=profile.semester,
        cgpa=profile.cgpa,
        skills=", ".join(profile.skills),
        interests=", ".join(profile.interests),
        preferred_types=", ".join(profile.preferred_types),
        financial_need="Yes" if profile.financial_need else "No",
        location_pref=profile.location_preference,
        nationality=profile.nationality,
        experience=profile.past_experience[:400],
        grad_year=profile.graduation_year,
    )
    response = llm_generate(prompt)
    clean = re.sub(r"```(?:json)?|```", "", response).strip()
    try:
        return json.loads(clean)
    except Exception:
        return {"fit_score": 0.5, "fit_evidence": [], "fit_gaps": [], "why_this_matters": ""}
