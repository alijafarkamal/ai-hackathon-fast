import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { NearMiss } from '../lib/types';

interface Props {
  nearMisses: NearMiss[];
}

export function NearMissPanel({ nearMisses }: Props) {
  if (!nearMisses || nearMisses.length === 0) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <AlertTriangle size={16} color="var(--color-warning)" />
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e8eaf0', margin: 0 }}>
          Near Misses — {nearMisses.length} opportunities you almost qualify for
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {nearMisses.map((nm, i) => {
          const fitPct = Math.round(nm.fit_score * 100);
          return (
            <motion.div key={nm.email_id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                padding: '16px 18px', borderRadius: 12,
                background: 'var(--color-warning-glow)',
                border: '1px solid rgba(251,191,36,0.25)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>⚠️</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#e8eaf0' }}>
                      {nm.title || 'Unnamed Opportunity'}
                    </span>
                    {nm.organization && (
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>· {nm.organization}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--color-warning)', margin: '0 0 10px', lineHeight: 1.6, fontStyle: 'italic' }}>
                    {nm.bridge_message}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {nm.gaps.map((gap, j) => (
                      <span key={j} style={{
                        fontSize: 11.5, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                        background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)',
                        color: 'var(--color-warning)'
                      }}>
                        ✗ {gap}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)',
                  flexShrink: 0
                }}>
                  <TrendingUp size={14} color="var(--color-warning)" />
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-warning)' }}>{fitPct}%</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>fit match</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
