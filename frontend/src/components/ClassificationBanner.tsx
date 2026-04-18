import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Clock, Filter, Copy2, Users } from 'lucide-react';

interface Props {
  total: number;
  real: number;
  noise: number;
  dedup: number;
}

const STATS = (total: number, real: number, noise: number, dedup: number) => [
  {
    label: 'Emails Scanned', value: total, icon: '📧',
    color: 'var(--color-primary)', glow: 'var(--color-primary-glow)', border: 'var(--color-primary-border)'
  },
  {
    label: 'Real Opportunities', value: real, icon: '✅',
    color: 'var(--color-success)', glow: 'var(--color-success-glow)', border: 'rgba(52,211,153,0.3)'
  },
  {
    label: 'Noise Filtered', value: noise, icon: '🗑️',
    color: 'var(--color-text-muted)', glow: 'var(--color-surface-2)', border: 'var(--color-border)'
  },
  {
    label: 'Duplicates Removed', value: dedup, icon: '🔁',
    color: 'var(--color-warning)', glow: 'var(--color-warning-glow)', border: 'rgba(251,191,36,0.3)'
  },
];

export function ClassificationBanner({ total, real, noise, dedup }: Props) {
  const stats = STATS(total, real, noise, dedup);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Zap size={15} color="var(--color-primary)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#e8eaf0' }}>Scan Complete</span>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>— AI agent processed {total} emails in parallel</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {stats.map((stat, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              padding: '14px 16px', borderRadius: 12,
              background: stat.glow, border: `1px solid ${stat.border}`,
            }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 5, fontWeight: 500 }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
