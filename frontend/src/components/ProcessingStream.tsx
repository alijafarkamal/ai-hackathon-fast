import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity } from 'lucide-react';

interface Props {
  steps: string[];
}

const NODE_COLORS: Record<string, string> = {
  dedup: '#a78bfa',
  classifier: '#60a5fa',
  classify: '#60a5fa',
  extractor: '#34d399',
  extract: '#34d399',
  validator: '#fbbf24',
  urgency: '#fb923c',
  profile_matcher: '#f472b6',
  near_miss: '#fb7185',
  scorer: '#c084fc',
  action: '#6ee7b7',
  ics: '#38bdf8',
  report: '#a3e635',
  system: '#60a5fa',
};

function getNodeColor(step: string) {
  const lower = step.toLowerCase();
  for (const [key, color] of Object.entries(NODE_COLORS)) {
    if (lower.includes(`[${key}]`) || lower.includes(key)) return color;
  }
  return 'rgba(255,255,255,0.65)';
}

function getNodeName(step: string) {
  const match = step.match(/\[([^\]]+)\]/);
  return match ? match[1].toUpperCase() : 'SYSTEM';
}

export function ProcessingStream({ steps }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps]);

  const PIPELINE_NODES = ['DEDUP', 'CLASSIFY', 'EXTRACTOR', 'VALIDATOR', 'URGENCY', 'PROFILE_MATCHER', 'NEAR_MISS', 'SCORER', 'ACTION', 'ICS', 'REPORT'];
  const activeNodes = steps.map(s => getNodeName(s));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-primary-glow)', border: '1px solid var(--color-primary-border)'
          }}>
            <Cpu size={18} color="var(--color-primary)" />
          </div>
          <div style={{
            position: 'absolute', top: -3, right: -3,
            width: 10, height: 10, borderRadius: '50%', background: 'var(--color-warning)',
            boxShadow: '0 0 8px var(--color-warning)', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite'
          }} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e8eaf0' }}>LangGraph Pipeline Running</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Parallel fan-out via Send API · {steps.length} steps
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={13} color="var(--color-warning)" />
          <span style={{ fontSize: 12, color: 'var(--color-warning)', fontWeight: 600 }}>Processing</span>
        </div>
      </div>

      {/* Pipeline Node Flow */}
      <div style={{
        padding: '14px 16px', borderRadius: 12,
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap'
      }}>
        {PIPELINE_NODES.map((node, i) => {
          const isActive = activeNodes.some(n => n.includes(node));
          return (
            <div key={node} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 10.5, fontWeight: 700, fontFamily: 'monospace',
                background: isActive ? (NODE_COLORS[node.toLowerCase()] + '22') : 'transparent',
                border: `1px solid ${isActive ? (NODE_COLORS[node.toLowerCase()] || 'var(--color-border)') + '55' : 'var(--color-border)'}`,
                color: isActive ? (NODE_COLORS[node.toLowerCase()] || 'var(--color-text-muted)') : 'var(--color-text-faint)',
                transition: 'all 0.3s ease'
              }}>
                {node}
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <span style={{ color: 'var(--color-text-faint)', fontSize: 10 }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal Log */}
      <div style={{
        background: '#050709', border: '1px solid var(--color-border)', borderRadius: 12,
        overflow: 'hidden', minHeight: 320
      }}>
        {/* Terminal bar */}
        <div style={{
          padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#34d399' }} />
          <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--color-text-faint)', fontFamily: 'monospace' }}>
            opportunity-copilot · agent execution trace
          </span>
        </div>
        <div style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.9, maxHeight: 420, overflowY: 'auto' }}>
          <AnimatePresence>
            {steps.map((step, i) => {
              const color = getNodeColor(step);
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', gap: 10, marginBottom: 2, color }}>
                  <span style={{ color: 'var(--color-text-faint)', minWidth: 24, textAlign: 'right' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ opacity: 0.55 }}>›</span>
                  <span>{step}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {steps.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <span style={{ color: 'var(--color-primary)' }}>$</span>
              <span className="animate-blink" style={{ color: 'var(--color-primary)' }}>_</span>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
