import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, BarChart3, Network, Zap, ChevronRight,
  RefreshCw, Terminal, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { SkillGraphViz } from './components/SkillGraphViz';
import { EmailInbox } from './components/EmailInbox';
import { StudentProfileForm } from './components/StudentProfileForm';
import { ProcessingStream } from './components/ProcessingStream';
import { OpportunityCard } from './components/OpportunityCard';
import { ClassificationBanner } from './components/ClassificationBanner';
import { ComparisonTable } from './components/ComparisonTable';
import { NearMissPanel } from './components/NearMissPanel';
import { CalendarExportButton } from './components/CalendarExportButton';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LandingPage } from './components/LandingPage';
import { api, parseEmailsFromText, formatEmailsToText } from './lib/api';
import type { ProcessResponse, StudentProfile } from './lib/types';

type AppState = 'SETUP' | 'PROCESSING' | 'RESULTS';
type SidebarTab = 'scanner' | 'results' | 'trace' | 'skills';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [appState, setAppState] = useState<AppState>('SETUP');
  const [activeTab, setActiveTab] = useState<SidebarTab>('scanner');
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
    } catch { setError('Could not load demo emails — is the backend running on port 8000?'); }
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
    setReasoningSteps([
      '[system] 🚀 Starting Opportunity Inbox Copilot...',
      '[system] 🔗 Connecting to LangGraph pipeline...',
    ]);
    try {
      const emails = parseEmailsFromText(emailText);
      if (emails.length === 0) throw new Error('No emails found. Check formatting.');
      const response = await api.process(emails, profile);
      setResult(response);
      setReasoningSteps(response.reasoning_steps);
      setTimeout(() => {
        setAppState('RESULTS');
        setActiveTab('results');
        setLoading(false);
      }, 800);
    } catch (e: any) {
      setError(e.message || 'Processing failed. Is the backend running on port 8000?');
      setAppState('SETUP');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAppState('SETUP');
    setActiveTab('scanner');
    setResult(null);
    setEmailText('');
    setError(null);
  };

  const canProcess = emailText.trim().length > 0 && profile !== null;

  const navItems = [
    { id: 'scanner' as SidebarTab, label: 'Inbox Scanner', icon: Inbox, available: true },
    { id: 'results' as SidebarTab, label: 'Results', icon: BarChart3, available: appState === 'RESULTS' },
    { id: 'trace' as SidebarTab, label: 'Agent Trace', icon: Terminal, available: appState === 'RESULTS' },
    { id: 'skills' as SidebarTab, label: '3D Skill Graph', icon: Network, available: appState === 'RESULTS' },
  ];

  if (showLanding) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="landing" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <LandingPage onEnter={() => setShowLanding(false)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, minWidth: 220, height: '100vh', display: 'flex', flexDirection: 'column',
        background: 'var(--color-bg2)', borderRight: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(96,165,250,0.25), rgba(167,139,250,0.25))',
              border: '1px solid rgba(96,165,250,0.3)'
            }}>
              <Zap size={17} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.01em' }}>InboxCopilot</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-faint)', marginTop: 1 }}>SOFTEC 2026</div>
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px',
            borderRadius: 8, background: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: appState === 'PROCESSING' ? 'var(--color-warning)' : appState === 'RESULTS' ? 'var(--color-success)' : '#60a5fa',
              boxShadow: appState === 'PROCESSING' ? '0 0 6px var(--color-warning)' : appState === 'RESULTS' ? '0 0 6px var(--color-success)' : '0 0 6px #60a5fa'
            }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {appState === 'PROCESSING' ? 'Processing...' : appState === 'RESULTS' ? 'Complete' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id}
                onClick={() => item.available && setActiveTab(item.id)}
                disabled={!item.available}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                  borderRadius: 8, border: 'none', cursor: item.available ? 'pointer' : 'not-allowed',
                  background: active ? 'rgba(96,165,250,0.12)' : 'transparent',
                  color: active ? '#60a5fa' : item.available ? 'var(--color-text-muted)' : 'var(--color-text-faint)',
                  fontSize: 13, fontWeight: active ? 600 : 400, transition: 'all 0.15s ease',
                  textAlign: 'left', width: '100%',
                  borderLeft: active ? '2px solid #60a5fa' : '2px solid transparent',
                }}
              >
                <Icon size={15} />
                {item.label}
                {active && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
          {appState === 'RESULTS' && (
            <button onClick={handleReset} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px',
              borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent',
              color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer'
            }}>
              <RefreshCw size={13} /> New Scan
            </button>
          )}
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--color-text-faint)', textAlign: 'center' }}>
            LangGraph · FastAPI · React
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          height: 56, minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', borderBottom: '1px solid var(--color-border)',
          background: 'rgba(13,15,26,0.9)', backdropFilter: 'blur(8px)', zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-faint)' }}>
              {activeTab === 'scanner' ? 'Inbox Scanner' : activeTab === 'results' ? 'Results Dashboard' : 'Agent Trace'}
            </span>
            {appState === 'RESULTS' && result && (
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 20,
                background: 'var(--color-success-glow)', border: '1px solid rgba(52,211,153,0.3)',
                color: 'var(--color-success)', fontWeight: 600
              }}>
                {result.total_real} opportunities found
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: 'rgba(167,139,250,0.1)', border: '1px solid var(--color-violet-border)',
              color: 'var(--color-violet)', fontWeight: 600, letterSpacing: '0.04em'
            }}>LangGraph</span>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: 'rgba(96,165,250,0.1)', border: '1px solid var(--color-primary-border)',
              color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.04em'
            }}>FastAPI</span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '28px' }}>
          <AnimatePresence mode="wait">

            {/* SCANNER TAB */}
            {activeTab === 'scanner' && appState !== 'PROCESSING' && (
              <motion.div key="scanner"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Hero text */}
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e8eaf0', marginBottom: 6 }}>
                    Scan Your Opportunity Inbox
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 520, lineHeight: 1.6 }}>
                    Students miss full scholarships not because they're ineligible — but because the email was buried in inbox #247.
                    Paste your emails, set your profile, and let the AI agent rank everything in seconds.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <EmailInbox value={emailText} onChange={setEmailText} onLoadDemo={handleLoadDemoEmails} />
                  <StudentProfileForm onChange={setProfile} onLoadDemo={handleLoadDemoProfile} initialProfile={profile} />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                      padding: '12px 16px', borderRadius: 10,
                      background: 'var(--color-danger-glow)', border: '1px solid rgba(248,113,113,0.3)',
                      fontSize: 13, color: 'var(--color-danger)'
                    }}>
                    <AlertTriangle size={15} /> {error}
                  </motion.div>
                )}

                <button onClick={handleProcess} disabled={!canProcess || loading}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                    cursor: canProcess && !loading ? 'pointer' : 'not-allowed',
                    background: canProcess
                      ? 'linear-gradient(135deg, rgba(96,165,250,0.22), rgba(167,139,250,0.22))'
                      : 'var(--color-surface)',
                    color: canProcess ? '#e8eaf0' : 'var(--color-text-faint)',
                    fontSize: 15, fontWeight: 700, letterSpacing: '0.02em',
                    boxShadow: canProcess ? '0 0 0 1px rgba(96,165,250,0.35), 0 4px 20px rgba(96,165,250,0.12)' : '0 0 0 1px var(--color-border)',
                    transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                  }}>
                  <Zap size={17} />
                  {loading ? 'Processing...' : 'Scan My Inbox with AI'}
                </button>
                {!canProcess && (
                  <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-faint)', marginTop: 8 }}>
                    {!emailText.trim() ? 'Load or paste emails above' : 'Complete the profile form'}
                  </p>
                )}

                <div style={{ marginTop: 32 }}>
                  <ComparisonTable />
                </div>
              </motion.div>
            )}

            {/* PROCESSING STATE */}
            {appState === 'PROCESSING' && (
              <motion.div key="processing"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProcessingStream steps={reasoningSteps} isProcessing={loading} />
              </motion.div>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && appState === 'RESULTS' && result && (
              <motion.div key="results"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ClassificationBanner
                  total={result.total_scanned} real={result.total_real}
                  noise={result.noise_count} dedup={result.dedup_count}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, gap: 10 }}>
                  <CalendarExportButton sessionId={result.session_id} />
                </div>

                {result.ranked_opportunities.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--color-text-faint)' }}>
                    No real opportunities found. Try different emails.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {result.ranked_opportunities.map((opp, i) => (
                      <motion.div key={opp.email_id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}>
                        <OpportunityCard opportunity={opp} rank={i + 1} />
                      </motion.div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 24 }}>
                  <NearMissPanel nearMisses={result.near_miss_opportunities} />
                </div>

                <AnalyticsDashboard opportunities={result.ranked_opportunities} />
              </motion.div>
            )}

            {/* TRACE TAB */}
            {activeTab === 'trace' && appState === 'RESULTS' && result && (
              <motion.div key="trace"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e8eaf0' }}>Agent Reasoning Trace</h2>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {result.reasoning_steps.length} steps executed by the LangGraph pipeline
                  </p>
                </div>
                <div style={{
                  background: '#060810', border: '1px solid var(--color-border)', borderRadius: 12,
                  padding: '20px', fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.9,
                  maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'
                }}>
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
                    <span style={{ marginLeft: 8, color: 'var(--color-text-faint)', fontSize: 11 }}>
                      opportunity-copilot — LangGraph trace
                    </span>
                  </div>
                  {result.reasoning_steps.map((step, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      style={{
                        color: step.includes('✅') || step.includes('Complete')
                          ? 'var(--color-success)'
                          : step.includes('🗑️') || step.includes('noise')
                          ? 'var(--color-text-faint)'
                          : step.includes('⚠️')
                          ? 'var(--color-warning)'
                          : step.includes('[system]')
                          ? 'var(--color-primary)'
                          : 'rgba(255,255,255,0.7)',
                        marginBottom: 2,
                        paddingLeft: 4
                      }}>
                      <span style={{ color: 'var(--color-text-faint)', marginRight: 10 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {step}
                    </motion.div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', marginTop: 6 }}>
                    <CheckCircle2 size={12} />
                    <span>Pipeline complete</span>
                    <span className="animate-blink" style={{ marginLeft: 4 }}>_</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

            {/* SKILLS GRAPH TAB — outside AnimatePresence to avoid Canvas remount */}
            {activeTab === 'skills' && appState === 'RESULTS' && result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SkillGraphViz opportunities={result.ranked_opportunities} profile={profile} />
              </motion.div>
            )}
        </main>
      </div>
    </div>
  );
}
