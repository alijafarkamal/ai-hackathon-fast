import pytest
from datetime import date, timedelta
from models.email_models import ParsedOpportunity
from scoring.validators import validate_opportunity

def test_validate_opportunity_deadline_past():
    """Past deadlines should return None."""
    past_date = (date.today() - timedelta(days=5)).isoformat()
    opp = ParsedOpportunity(email_id="1", is_opportunity=True, classification_confidence=1.0, classification_reason="test", deadline=past_date)
    result = validate_opportunity(opp)
    assert result.deadline is None

def test_validate_opportunity_deadline_future():
    """Future deadlines should be kept."""
    future_date = (date.today() + timedelta(days=10)).isoformat()
    opp = ParsedOpportunity(email_id="1", is_opportunity=True, classification_confidence=1.0, classification_reason="test", deadline=future_date)
    result = validate_opportunity(opp)
    assert result.deadline == future_date

def test_validate_opportunity_invalid_date():
    """Invalid strings should return None."""
    opp = ParsedOpportunity(email_id="1", is_opportunity=True, classification_confidence=1.0, classification_reason="test", deadline="sometime next week")
    result = validate_opportunity(opp)
    assert result.deadline is None

def test_validate_opportunity_application_link():
    """URLs should be validated, text stripped out."""
    opp = ParsedOpportunity(email_id="1", is_opportunity=True, classification_confidence=1.0, classification_reason="test", application_link="https://example.com")
    assert validate_opportunity(opp).application_link == "https://example.com"
    
    opp2 = ParsedOpportunity(email_id="2", is_opportunity=True, classification_confidence=1.0, classification_reason="test", application_link="Apply here: http://example.org")
    assert validate_opportunity(opp2).application_link is None

    opp3 = ParsedOpportunity(email_id="3", is_opportunity=True, classification_confidence=1.0, classification_reason="test", application_link="Please email us")
    assert validate_opportunity(opp3).application_link is None
