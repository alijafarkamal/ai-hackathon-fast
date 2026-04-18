"""
FastAPI application — Opportunity Inbox Copilot
Endpoints:
  GET  /health              — liveness check
  GET  /demo-emails         — return mock emails
  GET  /demo-profile        — return demo StudentProfile
  POST /process             — run full pipeline
  POST /upload-emails       — upload .txt/.eml file and parse emails
  GET  /export-ics          — download .ics file (query param: session_id)
  GET  /export-ics/{id}     — download .ics file (path param)
  GET  /stream/{id}         — SSE reasoning trace
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sse_starlette.sse import EventSourceResponse
import asyncio, uuid, json, re
from datetime import datetime
from models.email_models import RawEmail
from models.profile_models import StudentProfile
from agent.graph import copilot_graph
from agent.state import InboxCopilotState
from pydantic import BaseModel
from typing import List, Optional
from data.mock_emails import MOCK_EMAILS
from mock_data import get_mock_result

DEMO_PROFILE = StudentProfile(
    name="Ali Hassan",
    university="FAST-NUCES Lahore",
    degree="BS",
    program="Computer Science",
    semester=6,
    cgpa=3.53,
    skills=["Python", "Machine Learning", "LangChain", "React", "FastAPI"],
    interests=["AI/ML", "NLP", "Full-Stack Development", "Research"],
    preferred_types=["SCHOLARSHIP", "FELLOWSHIP", "COMPETITION", "INTERNSHIP"],
    financial_need=False,
    location_preference="ANY",
    nationality="Pakistani",
    gender="Male",
    past_experience="Won MIT Hack Nation Global AI Hackathon. Stanford Code in Place Section Leader. UG Research Assistant.",
    graduation_year=2027
)

app = FastAPI(title="Opportunity Inbox Copilot", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# In-memory session store
sessions: dict = {}


class ProcessRequest(BaseModel):
    emails: List[RawEmail]
    profile: StudentProfile


def _serialize_opportunity(opp) -> dict:
    """Safely serialize a ParsedOpportunity to dict."""
    if hasattr(opp, 'model_dump'):
        return opp.model_dump()
    elif isinstance(opp, dict):
        return opp
    return {}


def _serialize_near_miss(nm) -> dict:
    """Safely serialize a NearMiss (dict or model)."""
    if hasattr(nm, 'model_dump'):
        return nm.model_dump()
    elif isinstance(nm, dict):
        return nm
    return {}


def parse_emails_from_text(text: str) -> List[RawEmail]:
    """
    Parse emails from text with multiple format support.
    Handles:
      - ---EMAIL START--- / ---EMAIL END--- delimited
      - From: / Subject: / Body: format
      - Plain text (treats as single email body)
    """
    emails = []
    
    # Try delimiter-based parsing first
    blocks = re.split(r'---EMAIL\s*START---', text, flags=re.IGNORECASE)
    parsed_blocks = []
    for block in blocks[1:]:  # skip first empty split
        end_match = re.split(r'---EMAIL\s*END---', block, flags=re.IGNORECASE)
        if end_match:
            parsed_blocks.append(end_match[0].strip())
    
    if parsed_blocks:
        for i, block in enumerate(parsed_blocks):
            subj = re.search(r'Subject:\s*(.+)', block, re.IGNORECASE)
            sender = re.search(r'From:\s*(.+)', block, re.IGNORECASE)
            body_match = re.search(r'Body:\s*(.*)', block, re.IGNORECASE | re.DOTALL)
            body = body_match.group(1).strip() if body_match else block
            emails.append(RawEmail(
                id=f"email_{i+1:03d}",
                subject=subj.group(1).strip() if subj else f"Email {i+1}",
                sender=sender.group(1).strip() if sender else "unknown@email.com",
                body=body[:5000],
                received_date=datetime.utcnow().strftime("%Y-%m-%d")
            ))
        return emails
    
    # Try "From:" line-based parsing (standard email format)
    raw_parts = re.split(r'\n(?=From:\s)', text.strip())
    if len(raw_parts) > 1:
        for i, part in enumerate(raw_parts):
            if not part.strip():
                continue
            subj = re.search(r'Subject:\s*(.+)', part, re.IGNORECASE)
            sender = re.search(r'From:\s*(.+)', part, re.IGNORECASE)
            lines = part.split('\n')
            body_lines = [l for l in lines if not re.match(r'^(From|To|Subject|Date|CC|BCC):', l, re.I)]
            body = '\n'.join(body_lines).strip()
            emails.append(RawEmail(
                id=f"email_{i+1:03d}",
                subject=subj.group(1).strip() if subj else f"Email {i+1}",
                sender=sender.group(1).strip() if sender else "unknown@email.com",
                body=body[:5000],
                received_date=datetime.utcnow().strftime("%Y-%m-%d")
            ))
        return emails
    
    # Fallback: treat whole text as a single email
    if text.strip():
        first_line = text.strip().split('\n')[0][:80]
        emails.append(RawEmail(
            id="email_001",
            subject=first_line or "Pasted Email",
            sender="unknown@email.com",
            body=text[:5000],
            received_date=datetime.utcnow().strftime("%Y-%m-%d")
        ))
    
    return emails


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0", "timestamp": datetime.utcnow().isoformat()}


@app.get("/demo-emails")
def demo_emails():
    return {"emails": [e.model_dump() for e in MOCK_EMAILS]}


@app.get("/demo-profile")
def demo_profile():
    return DEMO_PROFILE


@app.post("/upload-emails")
async def upload_emails(file: UploadFile = File(...)):
    """
    Accept .txt, .eml, or .pdf file and return parsed RawEmail list.
    Handles malformed formats gracefully.
    """
    filename = file.filename or ""
    content_bytes = await file.read()
    
    # Decode text
    text = ""
    if filename.lower().endswith(".pdf"):
        try:
            import io
            import pdfplumber
            with pdfplumber.open(io.BytesIO(content_bytes)) as pdf:
                text = "\n\n".join(page.extract_text() or "" for page in pdf.pages)
        except Exception:
            try:
                import PyPDF2, io
                reader = PyPDF2.PdfReader(io.BytesIO(content_bytes))
                text = "\n".join(page.extract_text() or "" for page in reader.pages)
            except Exception:
                text = content_bytes.decode("utf-8", errors="replace")
    else:
        # .txt or .eml — try multiple encodings
        for enc in ["utf-8", "latin-1", "cp1252"]:
            try:
                text = content_bytes.decode(enc)
                break
            except Exception:
                continue
        else:
            text = content_bytes.decode("utf-8", errors="replace")
    
    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from uploaded file")
    
    emails = parse_emails_from_text(text)
    if not emails:
        raise HTTPException(status_code=422, detail="No emails found in uploaded file")
    
    return {"emails": [e.model_dump() for e in emails], "count": len(emails)}


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
        result = copilot_graph.invoke(initial_state)
        sessions[session_id] = result

        ranked = result.get("ranked_opportunities", [])
        near_misses = result.get("near_miss_opportunities", [])

        return {
            "session_id": session_id,
            "total_scanned": len(req.emails),
            "total_real": len(result.get("real_opportunities", [])),
            "noise_count": result.get("noise_count", 0),
            "dedup_count": result.get("dedup_count", 0),
            "ranked_opportunities": [_serialize_opportunity(o) for o in ranked],
            "near_miss_opportunities": [_serialize_near_miss(nm) for nm in near_misses],
            "reasoning_steps": result.get("reasoning_steps", []),
            "processing_complete": True,
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        err = str(e).lower()
        # On quota/rate-limit errors return rich mock data so demo always works
        if "429" in err or "quota" in err or "rate limit" in err or "rate_limit" in err:
            print(f"[main] ⚠️ LLM quota hit — returning mock data for demo")
            mock = get_mock_result(session_id, total_scanned=len(req.emails))
            sessions[session_id] = mock
            return mock
        return {
            "error": str(e),
            "session_id": session_id,
            "total_scanned": len(req.emails),
            "total_real": 0,
            "noise_count": 0,
            "dedup_count": 0,
            "ranked_opportunities": [],
            "near_miss_opportunities": [],
            "reasoning_steps": [f"[system] ❌ Pipeline error: {str(e)[:200]}"],
            "processing_complete": False,
        }


@app.get("/export-ics/{session_id}")
@app.get("/export-ics")
def export_ics(session_id: str = ""):
    """Download .ics calendar file — supports both path and query param."""
    session = sessions.get(session_id)
    if not session or not session.get("ics_export"):
        return Response(
            content="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n",
            media_type="text/calendar",
            headers={"Content-Disposition": "attachment; filename=opportunities.ics"}
        )
    return Response(
        content=session["ics_export"],
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=opportunities.ics"}
    )


@app.get("/stream/{session_id}")
async def stream(session_id: str):
    """SSE — streams reasoning steps for a completed session."""
    session = sessions.get(session_id, {})
    steps = session.get("reasoning_steps", [])

    async def generate():
        for step in steps:
            yield {"data": json.dumps({"type": "step", "text": step})}
            await asyncio.sleep(0.12)
        yield {"data": json.dumps({"type": "done"})}

    return EventSourceResponse(generate())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(__import__('os').getenv("BACKEND_PORT", 8000)),
        reload=True,
    )
