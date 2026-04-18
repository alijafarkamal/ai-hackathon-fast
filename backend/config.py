"""
LLM config: Gemini 2.5 Flash → Groq Llama fallback → mock data (handled in main.py).
All nodes call llm_generate() only — never import clients directly.
"""
import os, time
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GROQ_API_KEY   = os.getenv("GROQ_API_KEY")
GROQ_MODEL     = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# ── Gemini ────────────────────────────────────────────────────────────────────
import google.generativeai as genai
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ── Groq ──────────────────────────────────────────────────────────────────────
try:
    from groq import Groq
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except ImportError:
    groq_client = None


def llm_generate(prompt: str, system: str = "", use_groq: bool = False) -> str:
    """Gemini first → Groq fallback. Raises on total failure (main.py catches for mock)."""
    if not use_groq and GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system or None)
            resp = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(temperature=0.1, max_output_tokens=4096),
            )
            return resp.text
        except Exception as e:
            print(f"[config] Gemini failed → trying Groq: {str(e)[:120]}")

    # Groq fallback — single attempt, no retry loop (keep request count low)
    if groq_client:
        try:
            msgs = []
            if system:
                msgs.append({"role": "system", "content": system})
            msgs.append({"role": "user", "content": prompt})
            completion = groq_client.chat.completions.create(
                model=GROQ_MODEL, messages=msgs, max_tokens=4096, temperature=0.1,
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"[config] Groq also failed: {str(e)[:120]}")
            raise e  # bubble up → main.py returns mock data

    raise RuntimeError("No LLM available — both Gemini and Groq failed")
