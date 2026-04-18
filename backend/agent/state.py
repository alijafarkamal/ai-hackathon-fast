from typing import TypedDict, List, Optional
from models.email_models import RawEmail, ParsedOpportunity, NearMiss
from models.profile_models import StudentProfile
import operator
from typing import Annotated

class InboxCopilotState(TypedDict):
    # Input
    raw_emails: List[RawEmail]
    student_profile: StudentProfile

    # Pre-processing
    dedup_count: int                             # NEW: how many duplicates removed

    # Processing
    reasoning_steps: Annotated[List[str], operator.add]
    current_email_index: int

    # Intermediate
    classified_emails: Annotated[List[ParsedOpportunity], operator.add]
    real_opportunities: List[ParsedOpportunity]
    noise_count: int

    # Scored + ranked
    scored_opportunities: List[ParsedOpportunity]
    ranked_opportunities: List[ParsedOpportunity]
    near_miss_opportunities: List[NearMiss]      # NEW

    # Exports
    ics_export: Optional[str]                    # NEW: .ics file content

    # Summary
    total_scanned: int
    total_real: int
    processing_complete: bool
    error: Optional[str]
    session_id: str                              # NEW: for Langfuse tracing
