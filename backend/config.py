"""
Unified LLM config with Gemini 2.5 Flash primary + Groq fallback.
NEVER import LLM clients directly in nodes — always use llm_generate() from here.

Gemini 2.5 Flash docs: https://ai.google.dev/gemini-api/docs/models
Groq docs: https://console.groq.com/docs/openai
"""
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-preview-04-17")
GROQ_API_KEY   = os.getenv("GROQ_API_KEY")
GROQ_MODEL     = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# ── Gemini client ────────────────────────────────────────────────────────────
import google.generativeai as genai
genai.configure(api_key=GEMINI_API_KEY)

# ── Groq client ──────────────────────────────────────────────────────────────
try:
    from groq import Groq
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except ImportError:
    groq_client = None


def llm_generate(prompt: str, system: str = "", use_groq: bool = False) -> str:
    """
    Unified LLM call. Tries Gemini 2.5 Flash first, falls back to Groq on rate limit.

    Args:
        prompt:    User message / full prompt
        system:    Optional system instruction
        use_groq:  Force Groq (for testing or after Gemini failure)

    Returns:
        LLM response text
    """
    if use_groq or not GEMINI_API_KEY:
        return _groq_generate(prompt, system)

    try:
        model = genai.GenerativeModel(
            GEMINI_MODEL,
            system_instruction=system or None,
        )
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.1,          # Low temp for extraction accuracy
                max_output_tokens=4096,
            ),
        )
        return response.text
    except Exception as e:
        err = str(e).lower()
        if any(k in err for k in ("quota", "rate", "429", "resource_exhausted")):
            # Graceful fallback to Groq
            print(f"[config] Gemini rate limit — falling back to Groq: {e}")
            return _groq_generate(prompt, system)
        raise


def _groq_generate(prompt: str, system: str = "") -> str:
    """Groq Llama call."""
    if not groq_client:
        raise RuntimeError("Groq client not available. Set GROQ_API_KEY.")

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    completion = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        max_tokens=4096,
        temperature=0.1,
    )
    return completion.choices[0].message.content
