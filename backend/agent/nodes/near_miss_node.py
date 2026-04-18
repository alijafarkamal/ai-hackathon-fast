"""
Detects opportunities where the student is close but not fully eligible.
Generates specific gap-to-bridge messages.

This is the unique differentiating feature. No other team will have this.
"""
from agent.state import InboxCopilotState
from models.email_models import NearMiss

NEAR_MISS_LOWER = 0.50
NEAR_MISS_UPPER = 0.79

def near_miss_node(state: InboxCopilotState) -> dict:
    profile = state["student_profile"]
    near_misses = []

    for opp in state["scored_opportunities"]:
        if opp.fit_score is None:
            continue
        if NEAR_MISS_LOWER <= opp.fit_score <= NEAR_MISS_UPPER:
            # Build gap analysis from fit_gaps
            gaps = opp.fit_gaps or []
            gap_messages = []
            for gap in gaps:
                # Detect CGPA gaps and quantify them
                if "CGPA" in gap.upper() and hasattr(profile, 'cgpa'):
                    # Try to extract required CGPA from gap string
                    import re
                    numbers = re.findall(r'\d+\.\d+', gap)
                    if numbers:
                        required = float(numbers[0])
                        delta = round(required - profile.cgpa, 2)
                        if delta > 0:
                            gap_messages.append(
                                f"CGPA: need {required} (yours: {profile.cgpa}, gap: +{delta})"
                            )
                        else:
                            gap_messages.append(gap)
                    else:
                        gap_messages.append(gap)
                else:
                    gap_messages.append(gap)

            near_misses.append(NearMiss(
                email_id=opp.email_id,
                title=opp.title,
                organization=opp.organization,
                fit_score=opp.fit_score,
                deadline=opp.deadline,
                gaps=gap_messages,
                bridge_message=(
                    f"You're {round((NEAR_MISS_UPPER - opp.fit_score) * 100, 0):.0f}% away from qualifying. "
                    f"Address: {', '.join(gap_messages[:2])}."
                )
            ))

    steps = state.get("reasoning_steps", []) + [
        f"[near_miss] Found {len(near_misses)} near-miss opportunities "
        f"(fit score {NEAR_MISS_LOWER*100:.0f}–{NEAR_MISS_UPPER*100:.0f}%)"
    ]
    return {"near_miss_opportunities": near_misses, "reasoning_steps": steps}
