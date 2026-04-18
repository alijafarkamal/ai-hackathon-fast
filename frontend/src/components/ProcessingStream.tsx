import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, CheckCircle2, Loader } from 'lucide-react';

interface Props {
  steps: string[];
  isProcessing: boolean;
}

const PIPELINE_STAGES = [
  { key: 'DEDUP',           color: '#a78bfa', log: '[dedup] Scanning for duplicate subjects...' },
  { key: 'CLASSIFY',        color: '#60a5fa', log: '[classifier] Classifying emails in parallel via Send API...' },
  { key: 'EXTRACTOR',       color: '#34d399', log: '[extractor] Extracting title, deadline, eligibility...' },
  { key: 'VALIDATOR',       color: '#fbbf24', log: '[validator] Removing hallucinations and bad dates...' },
  { key: 'URGENCY',         color: '#fb923c', log: '[urgency] Scoring deadlines with exponential decay...' },
  { key: 'PROFILE_MATCHER', color: '#f472b6', log: '[profile_matcher] Matching opportunities to your profile...' },
  { key: 'NEAR_MISS',       color: '#fb7185', log: '[near_miss] Detecting 0.50–0.79 fit opportunities...' },
  { key: 'SCORER',          color: '#c084fc', log: '[scorer] Computing weighted priority scores...' },
  { key: 'ACTION',          color: '#6ee7b7', log: '[action] Generating step-by-step action checklists...' },
  { key: 'ICS',             color: '#38bdf8', log: '[ics] Building .ics calendar export...' },
  { key: 'REPORT',          color: '#a3e635', log: '[report] Ranking and finalising results...' },
];

// ms per stage — slightly randomised at runtime
const STAGE_DURATION = () => 3500 + Math.random() * 1500;

export function ProcessingStream({ steps, isProcessing }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [doneIdx, setDoneIdx] = useState<number>(-1);
  const [liveLines, setLiveLines] = useState<string[]>([
    '[system] 🚀 Starting Opportunity Inbox Copilot...',
    '[system] 🔗 Connecting to LangGraph pipeline...',
  ]);

  // Advance stages while processing
  useEffect(() => {
    if (!isProcessing) return;
    setActiveIdx(0);
    setDoneIdx(-1);
    setLiveLines([
      '[system] 🚀 Starting Opportunity Inbox Copilot...',
      '[system] 🔗 Connecting to LangGraph pipeline...',
    ]);

    const timers: ReturnType<typeof setTimeout>[] = [];
    let accumulated = 0;

    PIPELINE_STAGES.forEach((stage, i) => {
      const delay = accumulated;
      accumulated += STAGE_DURATION();

      timers.push(setTimeout(() => {
        if (!isProcessing) return;
        setActiveIdx(i);
        setDoneIdx(i - 1);
        setLiveLines(prev => [...prev, stage.log]);
      }, delay));
    });

    return () => timers.forEach(clearTimeout);
  }, [isProcessing]);

  // When backend responds, snap to done + show real steps
  useEffect(() => {
    if (!isProcessing && steps.length > 2) {
      setActiveIdx(-1);
      setDoneIdx(PIPELINE_STAGES.length - 1);
      setLiveLines(steps);
    }
  }, [isProcessing, steps]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveLines]);

  const displayLines = isProcessing ? liveLines : steps.length > 2 ? steps : liveLines;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-primary-glow)', border: '1px solid var(--color-primary-border)'
          }}>
            <Cpu size={18} color="var(--color-primary)" />
          </div>
          {isProcessing && (
            <div style={{
              position: 'absolute', top: -3, right: -3,
              width: 10, height: 10, borderRadius: '50%', background: 'var(--color-warning)',
              boxShadow: '0 0 8px var(--color-warning)', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite'
            }} />
          )}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e8eaf0' }}>LangGraph Pipeline Running</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Parallel fan-out via Send API · {displayLines.length} steps
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {isProcessing ? (
            <>
              <Activity size={13} color="var(--color-warning)" />
              <span style={{ fontSize: 12, color: 'var(--color-warning)', fontWeight: 600 }}>Processing</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={13} color="var(--color-success)" />
              <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>Complete</span>
            </>
          )}
        </div>
      </div>

      {/* Pipeline Stage Pills */}
      <div style={{
        padding: '16px', borderRadius: 12,
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap'
      }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const isDone    = i <= doneIdx;
          const isActive  = i === activeIdx;
          const isPending = !isDone && !isActive;

          return (
            <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.div
                animate={isActive ? { boxShadow: [`0 0 0px ${stage.color}55`, `0 0 10px ${stage.color}99`, `0 0 0px ${stage.color}55`] } : {}}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{
                  padding: '5px 11px', borderRadius: 6, fontSize: 10.5, fontWeight: 700, fontFamily: 'monospace',
                  display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.35s ease',
                  background: isDone
                    ? 'rgba(52,211,153,0.15)'
                    : isActive
                    ? `${stage.color}22`
                    : 'transparent',
                  border: `1px solid ${
                    isDone    ? 'rgba(52,211,153,0.5)'
                    : isActive ? stage.color
                    : 'var(--color-border)'
                  }`,
                  color: isDone
                    ? '#34d399'
                    : isActive
                    ? stage.color
                    : 'var(--color-text-faint)',
                  opacity: isPending ? 0.45 : 1,
                }}
              >
                {isDone && <CheckCircle2 size={9} />}
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ display: 'flex' }}
                  >
                    <Loader size={9} />
                  </motion.div>
                )}
                {stage.key}
              </motion.div>
              {i < PIPELINE_STAGES.length - 1 && (
                <span style={{ color: 'var(--color-text-faint)', fontSize: 10 }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal Log */}
      <div style={{
        background: '#050709', border: '1px solid var(--color-border)', borderRadius: 12,
        overflow: 'hidden', minHeight: 320
      }}>
        <div style={{
          padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#34d399' }} />
          <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--color-text-faint)', fontFamily: 'monospace' }}>
            opportunity-copilot · agent execution trace
          </span>
        </div>
        <div style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.9, maxHeight: 420, overflowY: 'auto' }}>
          <AnimatePresence>
            {displayLines.map((line, i) => {
              const stage = PIPELINE_STAGES.find(s => line.toLowerCase().includes(s.key.toLowerCase().replace('_', '_')));
              const color = stage ? stage.color
                : line.includes('✅') ? '#34d399'
                : line.includes('🗑️') ? 'rgba(255,255,255,0.3)'
                : line.includes('⚠️') ? '#fbbf24'
                : line.includes('[system]') ? '#60a5fa'
                : 'rgba(255,255,255,0.65)';
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', gap: 10, marginBottom: 2, color }}>
                  <span style={{ color: 'var(--color-text-faint)', minWidth: 24, textAlign: 'right' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ opacity: 0.5 }}>›</span>
                  <span>{line}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <span style={{ color: 'var(--color-primary)' }}>$</span>
            <span className="animate-blink" style={{ color: 'var(--color-primary)' }}>_</span>
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
