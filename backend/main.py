"""
FastAPI application.
Endpoints:
  GET  /health         — liveness check
  GET  /demo-emails    — return 15 mock emails for demo
  GET  /demo-profile   — return demo StudentProfile
  POST /process        — run full pipeline, return ranked results
  GET  /stream/{id}    — SSE stream of reasoning_steps for a session
  GET  /export-ics/{id} — download .ics file for a completed session
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from sse_starlette.sse import EventSourceResponse
import asyncio, uuid, json
from models.email_models import RawEmail
from models.profile_models import StudentProfile
from agent.graph import copilot_graph
from agent.state import InboxCopilotState
from pydantic import BaseModel
from typing import List
from data.mock_emails import MOCK_EMAILS

DEMO_PROFILE = StudentProfile(
    name="Ali Hassan",
    university="FAST-NUCES Lahore",
    degree="BS",
    program="Computer Science",
    semester=6,
    cgpa=3.53,
    skills=["Python", "ML"],
    interests=["AI/ML"],
    preferred_types=["SCHOLARSHIP"],
    financial_need=False,
    location_preference="ANY",
    nationality="Pakistani",
    gender="Male",
    past_experience="Hackathon winner",
    graduation_year=2027
)
from datetime import datetime

app = FastAPI(title="Opportunity Inbox Copilot", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# In-memory session store (sufficient for 6-hour hackathon)
sessions: dict = {}

class ProcessRequest(BaseModel):
    emails: List[RawEmail]
    profile: StudentProfile

@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0", "timestamp": datetime.utcnow().isoformat()}

@app.get("/demo-emails")
def demo_emails():
    return {"emails": [e.model_dump() for e in MOCK_EMAILS]}

@app.get("/demo-profile")
def demo_profile():
    return DEMO_PROFILE

@app.post("/process")
async def process(req: ProcessRequest):
    session_id = str(uuid.uuid4())
    initial_state: InboxCopilotState = {
        "raw_emails": req.emails,
        "student_profile": req.profile,
        "dedup_count": 0,
        "reasoning_steps": [],
        "current_email_index": 0,
        "classified_emails": [],
        "real_opportunities": [],
        "noise_count": 0,
        "scored_opportunities": [],
        "ranked_opportunities": [],
        "near_miss_opportunities": [],
        "ics_export": None,
        "total_scanned": len(req.emails),
        "total_real": 0,
        "processing_complete": False,
        "error": None,
        "session_id": session_id,
    }

    try:
        # Run graph
        result = copilot_graph.invoke(initial_state)
        sessions[session_id] = result
        
        # Determine counts
        total_scanned = len(req.emails)
        total_real = len(result.get("real_opportunities", []))
        
        return {
            "session_id": session_id,
            "total_scanned": total_scanned,
            "total_real": total_real,
            "noise_count": result.get("noise_count", 0),
            "dedup_count": result.get("dedup_count", 0),
            "ranked_opportunities": [o.model_dump() for o in result.get("ranked_opportunities", [])],
            "near_miss_opportunities": [nm.model_dump() for nm in result.get("near_miss_opportunities", [])],
            "reasoning_steps": result.get("reasoning_steps", []),
            "processing_complete": True,
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e), "session_id": session_id}

@app.get("/export-ics/{session_id}")
def export_ics(session_id: str):
    """Download .ics calendar file for a completed session."""
    session = sessions.get(session_id)
    if not session or not session.get("ics_export"):
        return Response(status_code=404)
    return Response(
        content=session["ics_export"],
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=opportunities.ics"}
    )

@app.get("/stream/{session_id}")
async def stream(session_id: str):
    """
    SSE endpoint — streams reasoning steps for a completed session.
    Frontend connects via EventSource('/stream/<session_id>') after /process.
    Steps are replayed with 120ms delay for the "live" effect.
    """
    session = sessions.get(session_id, {})
    steps = session.get("reasoning_steps", [])

    async def generate():
        for step in steps:
            yield {"data": json.dumps({"type": "step", "text": step})}
            await asyncio.sleep(0.12)
        yield {"data": json.dumps({"type": "done"})}

    return EventSourceResponse(generate())

if __name__ == "__main__":
    import os
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("BACKEND_PORT", 8000)),
        reload=True,
    )
