# InboxCopilot — SOFTEC 2026 AI Hackathon

> *Students miss full scholarships not because they're ineligible — but because the email was buried in inbox #247. This changes that.*

An AI-powered system that scans a student's opportunity emails, classifies them, extracts structured fields, and ranks them by personalized urgency and profile fit — with evidence-backed reasoning and a step-by-step action checklist.

---

## Demo Flow (30 seconds)

1. Click **Load Demo Emails** — loads 21 mixed emails (spam, promos, real opportunities)
2. Click **Load Demo Profile** — fills Ali Hassan's FAST-NUCES CS profile
3. Click **Scan My Inbox with AI**
4. Watch the 11-node LangGraph pipeline classify, extract, match, score, and rank
5. See ranked opportunities with fit scores, urgency badges, evidence trail, and action checklists

---

## Architecture

```
INPUT
  ├── Email paste / .txt / .eml / .pdf upload
  └── Form-based student profile (degree, CGPA, skills, interests, etc.)

LANGGRAPH PIPELINE (11 nodes, 4 LLM calls total)
  ├── dedup          — removes near-duplicate emails (75% subject similarity)
  ├── classify       — OPPORTUNITY vs NOISE (batch, 1 LLM call for all emails)
  ├── extractor      — deadline, eligibility, docs, link, contact (1 LLM call)
  ├── validator      — removes hallucinated dates / broken URLs
  ├── urgency        — exponential decay scoring (deterministic)
  ├── profile_matcher— fit_score, evidence, gaps (1 LLM call)
  ├── near_miss      — flags 0.50–0.79 fit opportunities
  ├── scorer         — urgency×0.35 + fit×0.40 + completeness×0.25 (deterministic)
  ├── action         — 4-step checklist per opportunity (1 LLM call)
  ├── ics_generator  — .ics calendar file with deadlines
  └── report         — final ranked output

OUTPUT (React)
  ├── Ranked opportunity cards — fit score ring, urgency badge, evidence trail
  ├── Near-miss panel — what to fix to qualify
  ├── Analytics dashboard — priority bar, type pie, fit×urgency scatter, deadline chart
  ├── Agent trace — full 70+ step reasoning log
  ├── 3D skill graph — Neo4j-style skill-opportunity visualization
  └── Calendar export — .ics download for Google/Apple Calendar
```

---

## Stack

| Layer | Technology |
|---|---|
| Pipeline | LangGraph (StateGraph, Send API for parallel fan-out) |
| Backend | FastAPI + Python |
| LLM | Gemini 2.5 Flash → Groq Llama 3.3 70B fallback → rich mock data |
| Frontend | React 18 + TypeScript + Vite |
| Charts | Recharts |
| 3D Graph | React Three Fiber + Three.js |
| Animation | Framer Motion |

---

## Quick Start

### 1. Clone
```bash
git clone https://github.com/alijafarkamal/ai-hackathon-fast.git
cd ai-hackathon-fast
```

### 2. Backend
```bash
cd backend
cp .env.example .env          # Add your API keys
pip install -r requirements.txt
python3 main.py               # Runs on http://localhost:8000
```

### 3. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev                   # Runs on http://localhost:5173
```

### 4. Open browser
```
http://localhost:5173
```

---

## API Keys (`.env`)

```env
GEMINI_API_KEY=your_gemini_api_key   # https://aistudio.google.com
GROQ_API_KEY=your_groq_api_key       # https://console.groq.com (free)
```

**No keys?** The system automatically falls back to rich mock demo data — all 3 tabs (Results, Agent Trace, 3D Graph) still populate fully.

---

## Key Engineering Decisions

- **Batch LLM calls**: All N emails classified in 1 prompt, not N prompts. Total = 4 LLM calls regardless of inbox size.
- **Deterministic scoring**: Urgency and priority scores use math, not vibes. Reproducible and explainable.
- **Near-miss detection**: Opportunities at 50–79% fit are shown with a "bridge message" — what to fix to qualify.
- **Graceful degradation**: Gemini quota hit → Groq fallback → mock data. Demo never breaks.

---

## Profile Fields

| Field | Type |
|---|---|
| Name, University | Text |
| Degree (BS/MS/PhD/MBA) | Select |
| Program, Semester, CGPA | Form fields |
| Skills, Interests | Tag input |
| Preferred opportunity types | Multi-select |
| Financial need | Yes/No |
| Location preference | Select |
| Nationality, Gender | Text |
| Past experience | Textarea |
| Graduation year | Number |

---

*Built for SOFTEC 2026 AI Hackathon — InvoZone sponsored track*
