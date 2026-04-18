import React from 'react';

interface NearMiss {
  email_id: string;
  title: string | null;
  fit_score: number;
  bridge_message: string;
  gaps: string[];
}

interface Props {
  nearMisses: NearMiss[];
}

export function NearMissPanel({ nearMisses }: Props) {
  if (!nearMisses || nearMisses.length === 0) return null;

  return (
    <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
      <h3 style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>🎯</span> Near Misses 
        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 12, color: 'rgba(255,255,255,0.6)' }}>
          Almost qualified
        </span>
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24 }}>
        You don't perfectly match these opportunities yet, but here's how you can bridge the gap.
      </p>

      <div style={{ display: 'grid', gap: 16 }}>
        {nearMisses.map((nm, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: 8,
            padding: 20 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#e5e5e5' }}>
                {nm.title || "Unknown Opportunity"}
              </h4>
              <div style={{ color: '#fcc419', fontWeight: 600, fontSize: 14 }}>
                {Math.round(nm.fit_score * 100)}% Fit
              </div>
            </div>
            
            <div style={{ background: 'rgba(252, 196, 25, 0.1)', color: '#fcc419', padding: '12px 16px', borderRadius: 6, fontSize: 14, marginBottom: 16, borderLeft: '3px solid #fcc419' }}>
              <strong>Bridge the gap:</strong> {nm.bridge_message}
            </div>

            {nm.gaps && nm.gaps.length > 0 && (
              <div>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                  Missing Requirements
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {nm.gaps.map((gap, j) => (
                    <li key={j}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
