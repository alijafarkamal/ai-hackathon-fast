import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface Props {
  steps: string[];
}

export function ActionChecklist({ steps }: Props) {
  const [checked, setChecked] = useState<boolean[]>(steps.map(() => false));

  const toggle = (i: number) => {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const doneCount = checked.filter(Boolean).length;

  return (
    <div style={{
      padding: '14px', borderRadius: 10,
      background: 'rgba(96,165,250,0.06)', border: '1px solid var(--color-primary-border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.06em' }}>
          📋 ACTION CHECKLIST
        </div>
        <span style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>{doneCount}/{steps.length}</span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--color-border)', borderRadius: 2, marginBottom: 10 }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${steps.length ? (doneCount / steps.length) * 100 : 0}%`,
          background: 'var(--color-primary)', transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {steps.map((step, i) => (
          <button key={i} onClick={() => toggle(i)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'
            }}>
            {checked[i]
              ? <CheckSquare size={14} color="var(--color-success)" style={{ marginTop: 1, flexShrink: 0 }} />
              : <Square size={14} color="var(--color-text-faint)" style={{ marginTop: 1, flexShrink: 0 }} />}
            <span style={{
              fontSize: 12, lineHeight: 1.55,
              color: checked[i] ? 'var(--color-text-faint)' : 'rgba(255,255,255,0.7)',
              textDecoration: checked[i] ? 'line-through' : 'none',
              transition: 'all 0.15s ease'
            }}>
              {step}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
