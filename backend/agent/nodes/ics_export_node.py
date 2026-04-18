"""
Generates an iCalendar (.ics) file with all opportunity deadlines.
Download button in the React UI lets students add all deadlines to Google Calendar / Apple Calendar.

This is a 20-line feature that creates a massive WOW moment in the demo.
"""
from agent.state import InboxCopilotState
from datetime import datetime

def ics_export_node(state: InboxCopilotState) -> dict:
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Opportunity Inbox Copilot//SOFTEC 2026//EN",
        "CALSCALE:GREGORIAN",
    ]

    for opp in state.get("ranked_opportunities", []):
        if not opp.deadline or not opp.title:
            continue
        try:
            dt = datetime.strptime(opp.deadline, "%Y-%m-%d")
            dtstr = dt.strftime("%Y%m%d")
            uid = f"{opp.email_id}@opportunity-copilot.softec"
            summary = f"DEADLINE: {opp.title}"
            description = (
                f"Priority Rank: #{opp.priority_rank}\\n"
                f"Fit Score: {int((opp.fit_score or 0) * 100)}%\\n"
                f"Organization: {opp.organization or 'N/A'}\\n"
                f"Link: {opp.application_link or 'N/A'}"
            )
            lines += [
                "BEGIN:VEVENT",
                f"UID:{uid}",
                f"DTSTART;VALUE=DATE:{dtstr}",
                f"DTEND;VALUE=DATE:{dtstr}",
                f"SUMMARY:{summary}",
                f"DESCRIPTION:{description}",
                f"CATEGORIES:{opp.opportunity_type or 'OPPORTUNITY'}",
                "END:VEVENT",
            ]
        except Exception:
            continue

    lines.append("END:VCALENDAR")
    ics_content = "\r\n".join(lines)

    return {
        "ics_export": ics_content,
        "reasoning_steps": state.get("reasoning_steps", []) + [
            f"[ics_export] Calendar file generated with {len(state.get('ranked_opportunities', []))} deadlines"
        ]
    }
