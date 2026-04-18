"""
Profile Matcher Node — matches ALL opportunities against student profile in ONE batched LLM call.
Reduces O LLM calls → 1 call.
"""
from __future__ import annotations
import json, re
from agent.state import InboxCopilotState
from config import llm_generate
from models.profile_models import StudentProfile

BATCH_MATCH_PROMPT = """You are evaluating how well a student matches multiple opportunities.
Be precise and reference actual profile values in every analysis.

STUDENT PROFILE:
Name: {name} | Degree: {degree} in {program} | Semester: {semester} | CGPA: {cgpa}
Skills: {skills}
Interests: {interests}
Preferred types: {preferred_types}
Financial need: {financial_need} | Location pref: {location_pref}
Nationality: {nationality} | Graduation: {grad_year}
Past experience: {experience}

OPPORTUNITIES TO EVALUATE:
{opps_text}

For each opportunity, generate fit analysis. fit_score rules:
- 0.90+  = excellent match (CGPA fits, skills match, type preferred, no citizenship barriers)
- 0.70-0.89 = good match (mostly fits, minor gaps)
- 0.50-0.69 = moderate (significant gaps but eligible)
- <0.50 = poor (major barriers like citizenship, wrong degree)

Return ONLY a valid JSON array — no markdown:
[
  {{
    "email_id": "<id>",
    "fit_score": 0.87,
    "fit_evidence": ["Your CGPA 3.53 exceeds the 3.0 minimum", "Python and ML skills directly match requirements"],
    "fit_gaps": ["Requires 2 years experience — you have internship-level only"],
    "why_this_matters": "<1-2 personal sentences using student's specific background>"
  }}
]
Include ALL {n} opportunities."""


def profile_matcher_node(state: InboxCopilotState) -> dict:
    profile = state["student_profile"]
    opps = state.get("real_opportunities", [])
    steps = list(state.get("reasoning_steps", []))
    steps.append(
        f"[profile_matcher] Batch-matching {len(opps)} opportunities against {profile.name}'s profile in one LLM call..."
    )

    if not opps:
        return {**state, "real_opportunities": [], "reasoning_steps": steps}

    opps_text = "\n\n".join(
        f"ID: {opp.email_id}\nTitle: {opp.title or 'N/A'}\nType: {opp.opportunity_type}\n"
        f"Eligibility: {', '.join(opp.eligibility_criteria or []) or 'Not specified'}\n"
        f"Location: {opp.location or 'Not specified'} | Benefit: {opp.stipend_or_benefit or 'N/A'}"
        for opp in opps
    )

    results: dict[str, dict] = {}
    try:
        prompt = BATCH_MATCH_PROMPT.format(
            name=profile.name, degree=profile.degree, program=profile.program,
            semester=profile.semester, cgpa=profile.cgpa,
            skills=", ".join(profile.skills),
            interests=", ".join(profile.interests),
            preferred_types=", ".join(profile.preferred_types),
            financial_need="Yes" if profile.financial_need else "No",
            location_pref=profile.location_preference,
            nationality=profile.nationality,
            grad_year=profile.graduation_year,
            experience=profile.past_experience[:400],
            opps_text=opps_text,
            n=len(opps),
        )
        response = llm_generate(prompt)
        clean = re.sub(r"```(?:json)?|```", "", response).strip()
        arr_match = re.search(r'\[.*\]', clean, re.DOTALL)
        if arr_match:
            for item in json.loads(arr_match.group()):
                results[item.get("email_id", "")] = item
    except Exception as e:
        steps.append(f"[profile_matcher] ⚠️ Batch parse failed ({e}) — defaulting fit_score to 0.5")

    updated = []
    for opp in opps:
        r = results.get(opp.email_id, {})
        fit = float(r.get("fit_score", 0.5))
        evidence = r.get("fit_evidence", [])
        gaps = r.get("fit_gaps", [])
        steps.append(
            f"[profile_matcher] '{(opp.title or opp.email_id)[:40]}' → "
            f"fit: {fit:.0%} ({len(evidence)} matches, {len(gaps)} gaps)"
        )
        updated.append(opp.model_copy(update={
            "fit_score": fit,
            "fit_evidence": evidence,
            "fit_gaps": gaps,
            "why_this_matters": r.get("why_this_matters", ""),
        }))

    return {**state, "real_opportunities": updated, "reasoning_steps": steps}
