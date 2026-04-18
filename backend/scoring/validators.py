"""
backend/scoring/validators.py
Validate extracted fields to catch LLM hallucinations before they reach the UI.
Run after extractor_node, before urgency_node.
"""
import re
from datetime import datetime, date
from models.email_models import ParsedOpportunity

def validate_opportunity(opp: ParsedOpportunity) -> ParsedOpportunity:
    """Sanitize and validate extracted fields. Returns corrected opportunity."""

    # 1. Deadline must be a future date
    if opp.deadline:
        try:
            dl = datetime.strptime(opp.deadline, "%Y-%m-%d").date()
            if dl < date.today():
                opp.deadline = None  # Past deadline = likely hallucination
        except ValueError:
            opp.deadline = None  # Unparseable date

    # 2. URL must look like a real URL
    if opp.application_link:
        if not re.match(r"https?://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}", opp.application_link):
            opp.application_link = None

    # 3. Contact email must have @ and valid TLD
    if opp.contact_email:
        if not re.match(r"[^@]+@[^@]+\.[^@]{2,}", opp.contact_email):
            opp.contact_email = None

    # 4. Title should not be generic
    GENERIC_TITLES = ["opportunity", "email", "message", "notification", "update"]
    if opp.title and opp.title.lower().strip() in GENERIC_TITLES:
        opp.title = None  # Force re-extraction or leave blank

    return opp
