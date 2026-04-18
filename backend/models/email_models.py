from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import date

class RawEmail(BaseModel):
    id: str
    subject: str
    sender: str
    body: str
    received_date: Optional[str] = None

class NearMiss(BaseModel):
    """Opportunity where student is close but not fully eligible."""
    email_id: str
    title: Optional[str]
    organization: Optional[str]
    fit_score: float                  # 0.50–0.79
    deadline: Optional[str]
    gaps: List[str]                   # unmet criteria
    bridge_message: str               # human-readable gap explanation

class ParsedOpportunity(BaseModel):
    email_id: str
    is_opportunity: bool
    classification_confidence: float  # 0.0–1.0 — used to weight final score
    classification_reason: str

    # Extracted (only if is_opportunity=True)
    title: Optional[str] = None
    organization: Optional[str] = None
    opportunity_type: Optional[Literal[
        "SCHOLARSHIP", "INTERNSHIP", "COMPETITION", "FELLOWSHIP",
        "ADMISSION", "JOB", "WORKSHOP", "CONFERENCE", "OTHER"
    ]] = None
    deadline: Optional[str] = None        # ISO "2026-05-01"
    eligibility_criteria: Optional[List[str]] = None
    required_documents: Optional[List[str]] = None
    application_link: Optional[str] = None
    contact_email: Optional[str] = None
    stipend_or_benefit: Optional[str] = None
    location: Optional[str] = None

    # Scoring
    days_remaining: Optional[int] = None
    urgency_score: Optional[float] = None        # deterministic
    fit_score: Optional[float] = None            # LLM + rules
    fit_evidence: Optional[List[str]] = None     # ["Your CGPA 3.53 meets 3.0 min"]
    fit_gaps: Optional[List[str]] = None         # ["Requires US citizenship"]
    completeness_score: Optional[float] = None   # deterministic
    confidence_weight: Optional[float] = None    # = classification_confidence
    priority_score: Optional[float] = None       # confidence-weighted final score
    priority_rank: Optional[int] = None

    # Output
    action_steps: Optional[List[str]] = None
    why_this_matters: Optional[str] = None
