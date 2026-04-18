"""
Unified LLM config with Gemini 1.5 Flash primary + Groq fallback.
NEVER import LLM clients directly in nodes — always use llm_generate() from here.

Gemini docs: https://ai.google.dev/gemini-api/docs/models
Groq docs: https://console.groq.com/docs/openai
"""
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Use gemini-1.5-flash — confirmed stable free-tier model
GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
GROQ_API_KEY   = os.getenv("GROQ_API_KEY")
GROQ_MODEL     = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# ── Gemini client ────────────────────────────────────────────────────────────
import google.generativeai as genai
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ── Groq client ──────────────────────────────────────────────────────────────
try:
    from groq import Groq
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except ImportError:
    groq_client = None


def llm_generate(prompt: str, system: str = "", use_groq: bool = False) -> str:
    """
    Unified LLM call. Tries Gemini 1.5 Flash first, falls back to Groq on ANY failure.

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
                temperature=0.1,
                max_output_tokens=4096,
            ),
        )
        return response.text
    except Exception as e:
        # Fall back to Groq on ANY error (not just rate limits)
        print(f"[config] Gemini failed — falling back to Groq: {e}")
        return _groq_generate(prompt, system)


def _groq_generate(prompt: str, system: str = "") -> str:
    """Groq Llama call with robust error handling."""
    if not groq_client:
        raise RuntimeError("No LLM available. Set GROQ_API_KEY or GEMINI_API_KEY.")

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
