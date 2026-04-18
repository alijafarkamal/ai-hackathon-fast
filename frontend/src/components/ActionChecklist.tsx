import { useState } from 'react';

interface Props { steps: string[]; opportunityId: string; }

export function ActionChecklist({ steps, opportunityId }: Props) {
  const [checked, setChecked] = useState<boolean[]>(new Array(steps.length).fill(false));
  const toggle = (i: number) => { const n = [...checked]; n[i] = !n[i]; setChecked(n); };
  const done = checked.filter(Boolean).length;

  return (
    <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
      borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          ACTION CHECKLIST
        </span>
        <span style={{ fontSize: 11, color: done === steps.length ? '#51cf66' : 'rgba(255,255,255,0.4)' }}>
          {done}/{steps.length} done
        </span>
      </div>
      {steps.map((step, i) => (
        <label key={`${opportunityId}-step-${i}`} style={{ display: 'flex', gap: 10, marginBottom: 8,
          cursor: 'pointer', alignItems: 'flex-start' }}>
          <div onClick={() => toggle(i)} style={{
            width: 16, height: 16, borderRadius: 4, border: checked[i] ? '2px solid #51cf66' : '2px solid rgba(255,255,255,0.2)',
            background: checked[i] ? '#51cf66' : 'transparent', flexShrink: 0, marginTop: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}>
            {checked[i] && <svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5L3.5 6L8 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
          </div>
          <span style={{ fontSize: 13, lineHeight: 1.6, color: checked[i] ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
            textDecoration: checked[i] ? 'line-through' : 'none', transition: 'all 0.15s' }}>
            {step}
          </span>
        </label>
      ))}
    </div>
  );
}
