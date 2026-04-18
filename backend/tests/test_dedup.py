"""Tests for deduplication node."""
import pytest
from models.email_models import RawEmail

def test_exact_duplicate_removed():
    """Two emails with identical subjects → deduplicated to 1."""
    from agent.nodes.dedup_node import dedup_node
    emails = [
        RawEmail(id="e1", subject="HEC Scholarship 2026", sender="hec@gov.pk", body="Apply now..."),
        RawEmail(id="e2", subject="HEC Scholarship 2026", sender="admin@nu.edu.pk", body="FWD: Apply now..."),
    ]
    state = {"raw_emails": emails, "reasoning_steps": []}
    result = dedup_node(state)
    assert len(result["raw_emails"]) == 1
    assert result["dedup_count"] == 1

def test_different_emails_not_deduped():
    """Two completely different emails → both kept."""
    from agent.nodes.dedup_node import dedup_node
    emails = [
        RawEmail(id="e1", subject="HEC Scholarship 2026", sender="hec@gov.pk", body="Scholarship"),
        RawEmail(id="e2", subject="Google Summer of Code", sender="google@google.com", body="GSoC"),
    ]
    state = {"raw_emails": emails, "reasoning_steps": []}
    result = dedup_node(state)
    assert len(result["raw_emails"]) == 2
    assert result["dedup_count"] == 0
