"""
Student profile model — STRUCTURED form, NOT free text.
As explicitly specified in the problem statement:
  "a compact student profile, NOT free-text, including fields such as
   degree/program, semester, CGPA, skills/interests, preferred opportunity
   types, financial need, location preference, and past experience."

All fields have sensible defaults so the demo works out of the box.
"""
from __future__ import annotations

from typing import List, Literal

from pydantic import BaseModel


class StudentProfile(BaseModel):
    # ── Academic ──────────────────────────────────────────────────────────────
    name: str = "Ali Hassan"
    university: str = "FAST-NUCES Lahore"
    degree: Literal["BS", "MS", "PhD", "MBA"] = "BS"
    program: str = "Computer Science"
    semester: int = 6
    cgpa: float = 3.53
    graduation_year: int = 2027

    # ── Skills & interests ────────────────────────────────────────────────────
    skills: List[str] = ["Python", "Machine Learning", "LangChain", "React", "FastAPI"]
    interests: List[str] = ["AI/ML", "NLP", "Full-Stack Development", "Research"]

    # ── Opportunity preferences ───────────────────────────────────────────────
    preferred_types: List[Literal[
        "SCHOLARSHIP", "INTERNSHIP", "COMPETITION", "FELLOWSHIP",
        "ADMISSION", "JOB", "WORKSHOP", "CONFERENCE"
    ]] = ["SCHOLARSHIP", "FELLOWSHIP", "COMPETITION", "INTERNSHIP"]

    # ── Context ───────────────────────────────────────────────────────────────
    financial_need: bool = False
    location_preference: Literal["LOCAL", "REMOTE", "INTERNATIONAL", "ANY"] = "ANY"
    nationality: str = "Pakistani"
    gender: Literal["Male", "Female", "Other", "Prefer not to say"] = "Male"

    # ── Experience ────────────────────────────────────────────────────────────
    past_experience: str = (
        "Won MIT Hack Nation Global AI Hackathon. "
        "Stanford Code in Place Section Leader. "
        "UG Research Assistant in NLP lab."
    )
