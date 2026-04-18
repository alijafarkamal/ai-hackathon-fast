import { useEffect, useRef, useState } from 'react';

interface Props { steps: string[]; }

export function ProcessingStream({ steps }: Props) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    setDisplayed([]);
    const interval = setInterval(() => {
      if (i < steps.length) {
        setDisplayed(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [steps]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayed]);

  const getColor = (step: string) => {
    if (step.includes('✅')) return '#51cf66';
    if (step.includes('🗑️')) return 'rgba(255,255,255,0.3)';
    if (step.includes('[classifier]')) return '#74c0fc';
    if (step.includes('[extractor]')) return '#da77f2';
    if (step.includes('[urgency]')) return '#ffa94d';
    if (step.includes('[profile_matcher]')) return '#63e6be';
    if (step.includes('[scorer]')) return '#ffd43b';
    if (step.includes('[action_generator]')) return '#f783ac';
    if (step.includes('[report]')) return '#69db7c';
    return 'rgba(255,255,255,0.7)';
  };

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#51cf66',
          boxShadow: '0 0 8px #51cf66', animation: displayed.length < steps.length ? 'pulse 1s infinite' : 'none' }} />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
          {displayed.length < steps.length ? 'Analyzing your inbox...' : '✓ Analysis complete'}
        </h2>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
        padding: '16px', fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: 12.5, maxHeight: 420, overflowY: 'auto', lineHeight: 1.7 }}>
        {displayed.map((step, i) => (
          <div key={i} style={{ color: getColor(step), marginBottom: 2 }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
            {step}
          </div>
        ))}
        {displayed.length < steps.length && (
          <div style={{ color: '#74c0fc' }}>▌</div>
        )}
        <div ref={bottomRef} />
      </div>

      {displayed.length < steps.length && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          {['Classifying', 'Extracting', 'Scoring', 'Ranking'].map((label, i) => (
            <div key={label} style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {label}
              {i < 3 && <span style={{ color: 'rgba(255,255,255,0.1)' }}>→</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
