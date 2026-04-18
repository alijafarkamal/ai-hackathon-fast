import React from 'react';

interface Props { 
  total: number; 
  real: number; 
  noise: number;
  dedup: number;
}

export function ClassificationBanner({ total, real, noise, dedup }: Props) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <Stat label="Emails Scanned" value={total} color="rgba(255,255,255,0.7)" icon="📬" />
        <Arrow />
        <Stat label="Real Opportunities" value={real} color="#51cf66" icon="✅" />
        <Arrow />
        <Stat label="Duplicates Merged" value={dedup} color="#fcc419" icon="🔗" />
        <Arrow />
        <Stat label="Noise Filtered" value={noise} color="rgba(255,255,255,0.35)" icon="🗑️" />
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        Ranked by profile fit ({'>'}40%), urgency (35%), and information completeness (25%). Confidence weighted. Showing highest priority first.
      </div>
    </div>
  );
}

function Arrow() {
  return <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }}>→</span>;
}

function Stat({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}
