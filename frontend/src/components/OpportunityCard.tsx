import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, Cell, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { ChevronDown, ChevronUp, ExternalLink, Calendar, MapPin, FileText, CheckSquare, Award } from 'lucide-react';
import { UrgencyBadge } from './UrgencyBadge';
import { ActionChecklist } from './ActionChecklist';
import type { ParsedOpportunity } from '../lib/types';

interface Props {
  opportunity: ParsedOpportunity;
  rank: number;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  SCHOLARSHIP: { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  INTERNSHIP: { bg: 'rgba(52,211,153,0.15)', text: '#34d399', border: 'rgba(52,211,153,0.3)' },
  FELLOWSHIP: { bg: 'rgba(167,139,250,0.15)', text: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  COMPETITION: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  JOB: { bg: 'rgba(248,113,113,0.15)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
  WORKSHOP: { bg: 'rgba(110,231,183,0.15)', text: '#6ee7b7', border: 'rgba(110,231,183,0.3)' },
  CONFERENCE: { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  ADMISSION: { bg: 'rgba(244,114,182,0.15)', text: '#f472b6', border: 'rgba(244,114,182,0.3)' },
  OTHER: { bg: 'rgba(255,255,255,0.08)', text: '#9ca3af', border: 'rgba(255,255,255,0.12)' },
};

const RANK_COLORS = ['#fbbf24', '#94a3b8', '#c084fc'];

function FitRing({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171';
  const data = [{ value: pct }, { value: 100 - pct }];
  return (
    <div style={{ position: 'relative', width: 64, height: 64 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius={22} outerRadius={30} data={data} startAngle={90} endAngle={-270} barSize={7}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: 'rgba(255,255,255,0.06)' }} dataKey="value" cornerRadius={6} angleAxisId={0}>
            <Cell fill={color} />
            <Cell fill="transparent" />
          </RadialBar>
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 12, fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 8, color: 'var(--color-text-faint)', lineHeight: 1, marginTop: 1 }}>fit</span>
      </div>
    </div>
  );
}

export function OpportunityCard({ opportunity: opp, rank }: Props) {
  const [expanded, setExpanded] = useState(rank === 1);
  const typeStyle = TYPE_COLORS[opp.opportunity_type || 'OTHER'] || TYPE_COLORS.OTHER;
  const rankColor = rank <= 3 ? RANK_COLORS[rank - 1] : 'var(--color-text-faint)';
  const priorityPct = opp.priority_score != null ? Math.round(opp.priority_score * 100) : 0;

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s ease',
      boxShadow: rank === 1 ? '0 0 0 1px rgba(251,191,36,0.2), 0 8px 32px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.3)',
    }}>
      {/* Header row */}
      <div style={{
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
        background: 'var(--color-surface-2)', cursor: 'pointer', userSelect: 'none'
      }} onClick={() => setExpanded(!expanded)}>
        {/* Rank badge */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: rank <= 3 ? `${rankColor}22` : 'var(--color-surface)',
          border: `1px solid ${rank <= 3 ? rankColor + '55' : 'var(--color-border)'}`,
          fontSize: 14, fontWeight: 800, color: rankColor, flexShrink: 0
        }}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
        </div>

        {/* Title + org */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e8eaf0', margin: 0, lineHeight: 1.3 }}>
              {opp.title || 'Untitled Opportunity'}
            </h3>
            {opp.opportunity_type && (
              <span style={{
                fontSize: 10.5, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
                background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.border}`
              }}>
                {opp.opportunity_type}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
            {opp.organization && (
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Award size={11} /> {opp.organization}
              </span>
            )}
            {opp.location && (
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} /> {opp.location}
              </span>
            )}
          </div>
        </div>

        {/* Right: fit ring + urgency + score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {opp.fit_score != null && <FitRing score={opp.fit_score} />}
          {opp.days_remaining != null && <UrgencyBadge daysRemaining={opp.days_remaining} />}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)' }}>{priorityPct}</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>score</div>
          </div>
          {expanded ? <ChevronUp size={15} color="var(--color-text-faint)" /> : <ChevronDown size={15} color="var(--color-text-faint)" />}
        </div>
      </div>

      {/* Priority bar */}
      <div style={{ height: 3, background: 'var(--color-border)' }}>
        <div style={{
          height: '100%', width: `${priorityPct}%`,
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-violet))',
          transition: 'width 0.8s ease'
        }} />
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Details */}
                  <div style={{
                    padding: '14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 8
                  }}>
                    {opp.deadline && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <Calendar size={13} color="var(--color-warning)" />
                        <span style={{ color: 'var(--color-text-muted)' }}>Deadline:</span>
                        <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{opp.deadline}</span>
                      </div>
                    )}
                    {opp.stipend_or_benefit && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <span style={{ fontSize: 13 }}>💰</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>Benefit:</span>
                        <span style={{ color: '#e8eaf0', fontWeight: 600 }}>{opp.stipend_or_benefit}</span>
                      </div>
                    )}
                    {opp.application_link && (
                      <a href={opp.application_link} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}>
                        <ExternalLink size={13} /> Apply Now
                      </a>
                    )}
                  </div>

                  {/* Fit Evidence */}
                  {opp.fit_evidence && opp.fit_evidence.length > 0 && (
                    <div style={{ padding: '14px', borderRadius: 10, background: 'var(--color-success-glow)', border: '1px solid rgba(52,211,153,0.2)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8, letterSpacing: '0.06em' }}>
                        ✅ WHY YOU QUALIFY
                      </div>
                      {opp.fit_evidence.map((e, i) => (
                        <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4, display: 'flex', gap: 6 }}>
                          <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>•</span> {e}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fit Gaps */}
                  {opp.fit_gaps && opp.fit_gaps.length > 0 && (
                    <div style={{ padding: '14px', borderRadius: 10, background: 'var(--color-danger-glow)', border: '1px solid rgba(248,113,113,0.2)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8, letterSpacing: '0.06em' }}>
                        ⚠️ GAPS TO ADDRESS
                      </div>
                      {opp.fit_gaps.map((g, i) => (
                        <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4, display: 'flex', gap: 6 }}>
                          <span style={{ color: 'var(--color-danger)', flexShrink: 0 }}>✗</span> {g}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Required docs */}
                  {opp.required_documents && opp.required_documents.length > 0 && (
                    <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FileText size={11} /> REQUIRED DOCUMENTS
                      </div>
                      {opp.required_documents.map((doc, i) => (
                        <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4, display: 'flex', gap: 6 }}>
                          <span style={{ color: 'var(--color-primary)' }}>→</span> {doc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {opp.why_this_matters && (
                    <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(167,139,250,0.08)', border: '1px solid var(--color-violet-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-violet)', marginBottom: 8, letterSpacing: '0.06em' }}>
                        🎯 WHY THIS MATTERS
                      </div>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: 0 }}>
                        {opp.why_this_matters}
                      </p>
                    </div>
                  )}
                  {opp.action_steps && opp.action_steps.length > 0 && (
                    <ActionChecklist steps={opp.action_steps} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
