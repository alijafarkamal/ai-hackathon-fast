import { useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onLoadDemo: () => void;
}

export function EmailInbox({ value, onChange, onLoadDemo }: Props) {
  const emailCount = value.trim() ? value.split('\n---\n').filter(Boolean).length : 0;

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>📬 Email Inbox</h3>
          {emailCount > 0 && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{emailCount} emails loaded</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onLoadDemo} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
            fontWeight: 600, background: 'rgba(116,192,252,0.15)', border: '1px solid rgba(116,192,252,0.35)', color: '#74c0fc' }}>
            ⚡ Load Demo (15 emails)
          </button>
          {emailCount > 0 && <button onClick={() => onChange('')} style={{ fontSize: 12, padding: '7px 12px',
            borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', color: '#ff6b6b' }}>Clear</button>}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>
        Separate emails with <code style={{ color: 'rgba(255,255,255,0.4)' }}>---</code> on its own line. Format: Subject: / From: / blank line / body
      </div>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        placeholder={"Subject: HEC Scholarship 2026\nFrom: scholarships@hec.gov.pk\n\nDear student...\n---\nSubject: Google Scholarship\nFrom: google@google.com\n\nHello..."}
        style={{ width: '100%', boxSizing: 'border-box', minHeight: 220, background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(255,255,255,0.8)',
          fontSize: 13, padding: '12px 14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
    </div>
  );
}
