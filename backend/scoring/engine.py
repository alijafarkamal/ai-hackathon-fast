"""
backend/scoring/engine.py
Deterministic scoring. No LLM allowed here — pure math.
The confidence_weight penalizes opportunities where classification was uncertain.
"""
from datetime import datetime, date

def compute_urgency_score(deadline_str: str | None) -> float:
    """
    Days to deadline → urgency score (0.0–1.0).
    Pure math. No LLM.
    """
    if not deadline_str:
        return 0.3  # unknown deadline = moderate urgency (don't penalize, don't boost)
    try:
        dl = datetime.strptime(deadline_str, "%Y-%m-%d").date()
        days = (dl - date.today()).days
        if days < 0:   return 0.0   # past — filter in validator
        if days <= 3:  return 1.0
        if days <= 7:  return 0.9
        if days <= 14: return 0.75
        if days <= 30: return 0.55
        if days <= 60: return 0.35
        return 0.15
    except ValueError:
        return 0.3

def compute_completeness_score(opp) -> float:
    """
    How much information was extracted? More complete = more trustworthy.
    Rewards well-structured opportunity emails.
    """
    fields = [opp.deadline, opp.eligibility_criteria, opp.required_documents,
              opp.application_link, opp.stipend_or_benefit, opp.location]
    present = sum(1 for f in fields if f)
    return round(present / len(fields), 2)

def compute_priority_score(urgency: float, fit: float, completeness: float,
                           confidence: float) -> float:
    """
    Weighted priority score.
    Multiplied by classification confidence — uncertain classifications rank lower.
    
    Weights (must sum to 1.0):
      urgency     × 0.35  — time sensitivity
      fit         × 0.40  — profile match (most important)
      completeness × 0.25 — how well-defined the opportunity is

    confidence_weight dampens score if classifier was uncertain (< 0.7 confidence).
    """
    URGENCY_W     = 0.35
    FIT_W         = 0.40
    COMPLETENESS_W = 0.25

    raw_score = (urgency * URGENCY_W) + (fit * FIT_W) + (completeness * COMPLETENESS_W)

    # Confidence dampening: if confidence < 0.7, reduce score proportionally
    confidence_weight = max(0.5, confidence)  # floor at 0.5 (never zero)
    return round(raw_score * confidence_weight, 4)
