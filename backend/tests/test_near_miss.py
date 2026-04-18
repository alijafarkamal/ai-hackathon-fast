import pytest
from models.email_models import ParsedOpportunity
from models.profile_models import StudentProfile

def test_near_miss_extraction():
    """Opportunities with 0.5 <= fit < 0.8 are flagged as near misses."""
    from agent.nodes.near_miss_node import near_miss_node
    
    profile = StudentProfile(name="Ali", cgpa=3.2, program="CS", semester=6)
    opps = [
        # Near miss
        ParsedOpportunity(email_id="1", is_opportunity=True, classification_confidence=0.9, classification_reason="good", fit_score=0.6, fit_gaps=["Requires 3.5 CGPA"]),
        # Too low fit
        ParsedOpportunity(email_id="2", is_opportunity=True, classification_confidence=0.9, classification_reason="good", fit_score=0.4, fit_gaps=["Only for Master students"]),
        # Good fit
        ParsedOpportunity(email_id="3", is_opportunity=True, classification_confidence=0.9, classification_reason="good", fit_score=0.85, fit_gaps=[])
    ]
    
    state = {
        "student_profile": profile,
        "scored_opportunities": opps,
        "reasoning_steps": [],
        "near_miss_opportunities": []
    }
    
    result = near_miss_node(state)
    
    assert len(result["near_miss_opportunities"]) == 1
    assert result["near_miss_opportunities"][0].email_id == "1"
