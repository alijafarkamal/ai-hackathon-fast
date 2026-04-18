"""
Report Node — final assembly. Sorts, assigns ranks, computes summary stats.
Sets processing_complete = True to signal the frontend.
"""
from __future__ import annotations

from agent.state import InboxCopilotState


def report_node(state: InboxCopilotState) -> InboxCopilotState:
    opps = state.get("real_opportunities", [])
    steps = list(state.get("reasoning_steps", []))

    total = state.get("total_scanned", len(state["raw_emails"]))
    real = len(opps)
    noise = state.get("noise_count", total - real)

    steps.append(
        f"[report] ✓ Pipeline complete — "
        f"{total} emails scanned → {real} real opportunities → {noise} noise filtered."
    )
    steps.append("[report] Final priority ranking:")
    for opp in opps:
        steps.append(
            f"[report]   #{opp.priority_rank or 0}: '{(opp.title or opp.email_id)[:45]}' "
            f"— score: {opp.priority_score or 0.0:.2f} | "
            f"fit: {opp.fit_score or 0.0:.0%} | urgency: {opp.urgency_score or 0.0:.2f}"
        )

    return {
        **state,
        "ranked_opportunities": opps,
        "total_scanned": total,
        "total_real": real,
        "noise_count": noise,
        "processing_complete": True,
        "reasoning_steps": steps,
    }
