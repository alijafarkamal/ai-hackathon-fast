"""
backend/agent/graph.py — Parallel version using LangGraph Send API.
Instead of looping emails one-by-one, all emails are classified simultaneously.

This is the core engineering differentiator vs other teams.
Docs: https://langchain-ai.github.io/langgraph/how-tos/map-reduce/
"""
from langgraph.graph import StateGraph, END, START
from langgraph.types import Send
from agent.state import InboxCopilotState
from agent.nodes.dedup_node import dedup_node
from agent.nodes.classifier_node import classifier_node_single
from agent.nodes.extractor_node import extractor_node
from agent.nodes.validator_node import validator_node
from agent.nodes.urgency_node import urgency_node
from agent.nodes.profile_matcher_node import profile_matcher_node
from agent.nodes.near_miss_node import near_miss_node
from agent.nodes.scorer_node import scorer_node
from agent.nodes.action_node import action_node
from agent.nodes.ics_export_node import ics_export_node
from agent.nodes.report_node import report_node

def fan_out_emails(state: InboxCopilotState):
    """Generate a Send for each email — all classified in parallel."""
    return [
        Send("classify_email", {"email": email, "student_profile": state["student_profile"]})
        for email in state["raw_emails"]
    ]

def build_graph():
    graph = StateGraph(InboxCopilotState)

    graph.add_node("dedup", dedup_node)
    graph.add_node("classify_email", classifier_node_single)  # runs N times in parallel
    graph.add_node("extractor", extractor_node)
    graph.add_node("validator", validator_node)
    graph.add_node("urgency", urgency_node)
    graph.add_node("profile_matcher", profile_matcher_node)
    graph.add_node("near_miss", near_miss_node)
    graph.add_node("scorer", scorer_node)
    graph.add_node("action_generator", action_node)
    graph.add_node("ics_generator", ics_export_node)
    graph.add_node("report", report_node)

    graph.add_edge(START, "dedup")
    graph.add_conditional_edges("dedup", fan_out_emails, ["classify_email"])
    graph.add_edge("classify_email", "extractor")   # merge point
    graph.add_edge("extractor", "validator")
    graph.add_edge("validator", "urgency")
    graph.add_edge("urgency", "profile_matcher")
    graph.add_edge("profile_matcher", "near_miss")
    graph.add_edge("near_miss", "scorer")
    graph.add_edge("scorer", "action_generator")
    graph.add_edge("action_generator", "ics_generator")
    graph.add_edge("ics_generator", "report")
    graph.add_edge("report", END)

    return graph.compile()

copilot_graph = build_graph()
