from agent.state import InboxCopilotState
from scoring.validators import validate_opportunity

def validator_node(state: InboxCopilotState) -> dict:
    real_opps = state["real_opportunities"]
    validated = []
    
    for opp in real_opps:
        validated.append(validate_opportunity(opp))
        
    steps = state["reasoning_steps"] + [
        f"[validator] Validated {len(validated)} opportunities, removed hallucinations."
    ]
    return {"real_opportunities": validated, "reasoning_steps": steps}
