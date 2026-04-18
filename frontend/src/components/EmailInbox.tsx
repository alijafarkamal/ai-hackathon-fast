import { useState } from 'react';
import { Mail, Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onLoadDemo: () => void;
}

export function EmailInbox({ value, onChange, onLoadDemo }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const emailCount = value.trim() ? (value.match(/---EMAIL START---/g) || []).length : 0;

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
    }}>
      {/* Card Header */}
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-primary-glow)', border: '1px solid var(--color-primary-border)'
          }}>
            <Mail size={14} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0' }}>Email Inbox</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>
              {emailCount > 0 ? `${emailCount} email${emailCount !== 1 ? 's' : ''} loaded` : 'Paste or load emails'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onLoadDemo} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
            border: '1px solid var(--color-primary-border)',
            background: 'var(--color-primary-glow)', color: 'var(--color-primary)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>
            <Sparkles size={12} /> Load Demo
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            padding: '6px 8px', borderRadius: 8, border: '1px solid var(--color-border)',
            background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer'
          }}>
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div style={{ padding: '10px 14px', background: 'rgba(96,165,250,0.04)', borderBottom: '1px solid var(--color-border)' }}>
            <code style={{ fontSize: 10.5, color: 'var(--color-text-faint)', display: 'block', lineHeight: 1.8 }}>
              Format: <span style={{ color: 'var(--color-primary)' }}>---EMAIL START---</span>{' '}
              Subject: ... {' | '}
              From: ... {' | '}
              Body: ... {' '}
              <span style={{ color: 'var(--color-primary)' }}>---EMAIL END---</span>
            </code>
          </div>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Paste emails here, or click Load Demo above..."
            style={{
              width: '100%', minHeight: 260, padding: '14px 16px', resize: 'vertical',
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--color-text)', fontSize: 12.5, fontFamily: 'monospace',
              lineHeight: 1.7, display: 'block', boxSizing: 'border-box'
            }}
          />
          {emailCount === 0 && value.trim() && (
            <div style={{ padding: '10px 16px', background: 'var(--color-warning-glow)', borderTop: '1px solid rgba(251,191,36,0.2)', fontSize: 12, color: 'var(--color-warning)' }}>
              ⚠️ No emails detected. Use the format shown above with ---EMAIL START--- delimiters.
            </div>
          )}
          {emailCount > 0 && (
            <div style={{ padding: '10px 16px', background: 'var(--color-success-glow)', borderTop: '1px solid rgba(52,211,153,0.2)', fontSize: 12, color: 'var(--color-success)' }}>
              ✅ {emailCount} email{emailCount !== 1 ? 's' : ''} ready to scan
            </div>
          )}
        </>
      )}
    </div>
  );
}
