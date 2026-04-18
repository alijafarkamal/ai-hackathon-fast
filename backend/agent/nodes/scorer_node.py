"""
Scorer Node — DETERMINISTIC final priority scoring. No LLM.
Uses backend/scoring/engine.py for pure math.
"""
from agent.state import InboxCopilotState
from scoring.engine import compute_completeness_score, compute_priority_score

def scorer_node(state: InboxCopilotState) -> dict:
    opps = state.get("real_opportunities", [])
    steps = state.get("reasoning_steps", []) + [
        "[scorer] Computing confidence-weighted priority scores..."
    ]

    scored = []
    for opp in opps:
        completeness = compute_completeness_score(opp)
        urgency = opp.urgency_score if opp.urgency_score is not None else 0.30
        fit = opp.fit_score if opp.fit_score is not None else 0.50
        confidence = opp.classification_confidence if opp.classification_confidence is not None else 0.5

        priority = compute_priority_score(
            urgency=urgency,
            fit=fit,
            completeness=completeness,
            confidence=confidence
        )

        steps.append(
            f"[scorer] '{(opp.title or opp.email_id)[:35]}' → "
            f"score: {priority:.2f} "
            f"(fit:{fit:.2f} urgency:{urgency:.2f} complete:{completeness:.2f} conf_wt:{max(0.5, confidence):.2f})"
        )
        scored.append(opp.model_copy(update={
            "completeness_score": completeness,
            "confidence_weight": max(0.5, confidence),
            "priority_score": priority,
        }))

    # Sort descending and assign ranks
    scored.sort(key=lambda x: x.priority_score or 0, reverse=True)
    ranked = []
    for rank, opp in enumerate(scored, 1):
        ranked.append(opp.model_copy(update={"priority_rank": rank}))

    steps.append(f"[scorer] Ranked {len(ranked)} opportunities by priority score.")
    return {
        "scored_opportunities": ranked,
        "ranked_opportunities": ranked,
        "reasoning_steps": steps,
    }
