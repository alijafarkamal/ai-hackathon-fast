import { useState } from 'react';
import { EmailInbox } from './components/EmailInbox';
import { StudentProfileForm } from './components/StudentProfileForm';
import { ProcessingStream } from './components/ProcessingStream';
import { OpportunityCard } from './components/OpportunityCard';
import { ClassificationBanner } from './components/ClassificationBanner';
import { ComparisonTable } from './components/ComparisonTable';
import { NearMissPanel } from './components/NearMissPanel';
import { CalendarExportButton } from './components/CalendarExportButton';
import { api, parseEmailsFromText, formatEmailsToText } from './lib/api';
import type { ProcessResponse, StudentProfile, RawEmail } from './lib/types';

type AppState = 'SETUP' | 'PROCESSING' | 'RESULTS';

export default function App() {
  const [appState, setAppState] = useState<AppState>('SETUP');
  const [emailText, setEmailText] = useState('');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [reasoningSteps, setReasoningSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadDemoEmails = async () => {
    try {
      const data = await api.getDemoEmails();
      setEmailText(formatEmailsToText(data.emails));
    } catch { setError('Could not load demo emails — is the backend running?'); }
  };

  const handleLoadDemoProfile = async () => {
    try {
      const p = await api.getDemoProfile();
      setProfile(p);
    } catch { setError('Could not load demo profile.'); }
  };

  const handleProcess = async () => {
    if (!emailText.trim() || !profile) return;
    setAppState('PROCESSING');
    setError(null);
    setLoading(true);
    setReasoningSteps(['[system] Starting Opportunity Inbox Copilot...', '[system] Connecting to LangGraph pipeline...']);

    try {
      const emails = parseEmailsFromText(emailText);
      if (emails.length === 0) throw new Error('No emails found. Check formatting.');
      const response = await api.process(emails, profile);
      setResult(response);
      setReasoningSteps(response.reasoning_steps);
      // Brief delay to show final stream before transitioning
      setTimeout(() => { setAppState('RESULTS'); setLoading(false); }, 800);
    } catch (e: any) {
      setError(e.message || 'Processing failed. Is the backend running on port 8000?');
      setAppState('SETUP');
      setLoading(false);
    }
  };

  const canProcess = emailText.trim().length > 0 && profile !== null;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d14', color: '#fff', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>📬</span>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>Opportunity Inbox Copilot</h1>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(116,192,252,0.15)',
                color: '#74c0fc', border: '1px solid rgba(116,192,252,0.3)', fontWeight: 600 }}>SOFTEC 2026</span>
            </div>
            <p style={{ margin: '2px 0 0 32px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              AI-powered email scanning · Personalized opportunity ranking · Evidence-backed
            </p>
          </div>
          {appState === 'RESULTS' && (
            <button onClick={() => { setAppState('SETUP'); setResult(null); setEmailText(''); }}
              style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              ← New Scan
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

        {/* SETUP STATE */}
        {appState === 'SETUP' && (
          <>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                The problem: students miss scholarships, fellowships &amp; internships — not because they're ineligible,
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                but because the email was buried in inbox #247 and looked like spam.
              </div>
            </div>

            <EmailInbox value={emailText} onChange={setEmailText} onLoadDemo={handleLoadDemoEmails} />

            <div style={{ marginTop: 16 }}>
              <StudentProfileForm onChange={setProfile} onLoadDemo={handleLoadDemoProfile} initialProfile={profile} />
            </div>

            {error && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,107,107,0.12)',
                border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, fontSize: 13, color: '#ff6b6b' }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleProcess} disabled={!canProcess || loading}
              style={{ marginTop: 20, width: '100%', padding: '16px', borderRadius: 12, cursor: canProcess ? 'pointer' : 'not-allowed',
                background: canProcess ? 'linear-gradient(135deg, rgba(116,192,252,0.3), rgba(116,192,252,0.15))' : 'rgba(255,255,255,0.04)',
                border: canProcess ? '1px solid rgba(116,192,252,0.5)' : '1px solid rgba(255,255,255,0.08)',
                color: canProcess ? '#74c0fc' : 'rgba(255,255,255,0.2)',
                fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', transition: 'all 0.2s ease' }}>
              {loading ? '⏳ Processing...' : '🔍 Scan My Inbox'}
            </button>

            {!canProcess && (
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                {!emailText.trim() ? 'Load or paste emails above' : 'Complete the profile form above'}
              </div>
            )}

            <ComparisonTable />
          </>
        )}

        {/* PROCESSING STATE */}
        {appState === 'PROCESSING' && (
          <ProcessingStream steps={reasoningSteps} />
        )}

        {/* RESULTS STATE */}
        {appState === 'RESULTS' && result && (
          <>
            <ClassificationBanner total={result.total_scanned} real={result.total_real} noise={result.noise_count} dedup={result.dedup_count} />

            {result.ranked_opportunities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'rgba(255,255,255,0.35)' }}>
                No real opportunities found in these emails. Try different emails or check the email format.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {result.ranked_opportunities.map((opp, i) => (
                  <OpportunityCard key={opp.email_id} opportunity={opp} rank={i + 1} />
                ))}
              </div>
            )}

            <NearMissPanel nearMisses={result.near_miss_opportunities} />
            <CalendarExportButton sessionId={result.session_id} />

            {/* Reasoning trace accordion */}
            <details style={{ marginTop: 32, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px' }}>
              <summary style={{ cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                🧠 Agent Reasoning Trace ({result.reasoning_steps.length} steps)
              </summary>
              <div style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7,
                maxHeight: 320, overflowY: 'auto' }}>
                {result.reasoning_steps.map((s, i) => (
                  <div key={i} style={{ color: s.includes('✅') ? '#51cf66' : s.includes('🗑️') ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)', marginBottom: 2 }}>
                    {s}
                  </div>
                ))}
              </div>
            </details>

            <ComparisonTable />
          </>
        )}
      </div>
    </div>
  );
}
