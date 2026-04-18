import React from 'react';

interface Props {
  sessionId: string;
}

export function CalendarExportButton({ sessionId }: Props) {
  if (!sessionId) return null;

  return (
    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
      <a 
        href={`http://localhost:8000/export-ics/${sessionId}`}
        download="opportunities.ics"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 8,
          color: '#fff',
          textDecoration: 'none',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        <span style={{ fontSize: 20 }}>📅</span>
        Export All Deadlines to Calendar
      </a>
    </div>
  );
}
