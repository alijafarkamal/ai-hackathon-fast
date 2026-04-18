import { useState } from 'react';
import { UrgencyBadge } from './UrgencyBadge';
import { FitScoreRing } from './FitScoreRing';
import { ActionChecklist } from './ActionChecklist';
import type { RankedOpportunity } from '../lib/types';

interface Props { opportunity: RankedOpportunity; rank: number; }

const TYPE_META: Record<string, { color: string; bg: string; icon: string }> = {
  SCHOLARSHIP: { color: '#74c0fc', bg: 'rgba(116,192,252,0.12)', icon: '🎓' },
  FELLOWSHIP: { color: '#da77f2', bg: 'rgba(218,119,242,0.12)', icon: '🔬' },
  COMPETITION: { color: '#ffa94d', bg: 'rgba(255,169,77,0.12)', icon: '🏆' },
  INTERNSHIP: { color: '#63e6be', bg: 'rgba(99,230,190,0.12)', icon: '💼' },
  ADMISSION: { color: '#ffd43b', bg: 'rgba(255,212,59,0.12)', icon: '🏫' },
  JOB: { color: '#a9e34b', bg: 'rgba(169,227,75,0.12)', icon: '💻' },
  WORKSHOP: { color: '#f783ac', bg: 'rgba(247,131,172,0.12)', icon: '🎯' },
  CONFERENCE: { color: '#69db7c', bg: 'rgba(105,219,124,0.12)', icon: '📣' },
  OTHER: { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)', icon: '📌' },
};

export function OpportunityCard({ opportunity: opp, rank }: Props) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [showActions, setShowActions] = useState(rank <= 2);
  const typeMeta = TYPE_META[opp.opportunity_type || 'OTHER'] || TYPE_META['OTHER'];
  const isTop = rank === 1;

  return (
    <div style={{
      background: isTop ? 'rgba(116,192,252,0.05)' : 'rgba(255,255,255,0.03)',
      border: isTop ? '1px solid rgba(116,192,252,0.3)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '20px 24px',
      boxShadow: isTop ? '0 0 24px rgba(116,192,252,0.08)' : 'none',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Rank badge */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: isTop ? 'rgba(116,192,252,0.2)' : 'rgba(255,255,255,0.06)',
          color: isTop ? '#74c0fc' : 'rgba(255,255,255,0.4)',
          border: isTop ? '1.5px solid rgba(116,192,252,0.4)' : '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700,
        }}>
          #{rank}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title + type badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
              {opp.title || opp.email_id}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
              padding: '2px 9px', borderRadius: 20, background: typeMeta.bg,
              color: typeMeta.color, fontWeight: 600, letterSpacing: '0.04em' }}>
              {typeMeta.icon} {opp.opportunity_type || 'OPPORTUNITY'}
            </span>
          </div>

          {/* Organization */}
          {opp.organization && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
              {opp.organization} {opp.location ? `• ${opp.location}` : ''}
            </div>
          )}

          {/* Urgency + benefit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <UrgencyBadge daysRemaining={opp.days_remaining} urgencyScore={opp.urgency_score || 0} />
            {opp.stipend_or_benefit && (
              <span style={{ fontSize: 12, color: '#69db7c', fontWeight: 600 }}>
                💰 {opp.stipend_or_benefit}
              </span>
            )}
          </div>
        </div>

        {/* Fit score ring */}
        <FitScoreRing score={opp.fit_score || 0} size={60} />
      </div>

      {/* Why this matters */}
      {opp.why_this_matters && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
          borderRadius: 8, fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)',
          borderLeft: `3px solid ${typeMeta.color}` }}>
          {opp.why_this_matters}
        </div>
      )}

      {/* Score breakdown row */}
      <div style={{ marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11,
        color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        <span>Priority: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{((opp.priority_score || 0) * 100).toFixed(0)}%</strong></span>
        <span>Fit: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{((opp.fit_score || 0) * 100).toFixed(0)}%</strong></span>
        <span>Urgency: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{((opp.urgency_score || 0) * 100).toFixed(0)}%</strong></span>
        <span>Completeness: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{((opp.completeness_score || 0) * 100).toFixed(0)}%</strong></span>
        {opp.application_link && (
          <a href={opp.application_link} target="_blank" rel="noopener noreferrer"
            style={{ marginLeft: 'auto', color: '#74c0fc', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>
            Apply Now →
          </a>
        )}
      </div>

      {/* Evidence trail toggle */}
      <button onClick={() => setShowEvidence(!showEvidence)} style={{
        marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{showEvidence ? '▼' : '▶'}</span>
        Why ranked #{rank}?
        <span style={{ color: 'rgba(255,255,255,0.25)' }}>
          ({(opp.fit_evidence || []).length} matches · {(opp.fit_gaps || []).length} gaps)
        </span>
      </button>

      {showEvidence && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(opp.fit_evidence || []).map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: '#69db7c', alignItems: 'flex-start' }}>
              <span>✓</span><span>{e}</span>
            </div>
          ))}
          {(opp.fit_gaps || []).map((g, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: '#ff6b6b', alignItems: 'flex-start' }}>
              <span>✗</span><span>{g}</span>
            </div>
          ))}
          {/* Eligibility criteria */}
          {(opp.eligibility_criteria || []).length > 0 && (
            <div style={{ marginTop: 6, padding: '8px 12px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ marginBottom: 4, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Eligibility Requirements:</div>
              {opp.eligibility_criteria?.map((c, i) => <div key={i}>• {c}</div>)}
            </div>
          )}
        </div>
      )}

      {/* Action checklist toggle */}
      {(opp.action_steps || []).length > 0 && (
        <>
          <button onClick={() => setShowActions(!showActions)} style={{
            marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 12, color: typeMeta.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{showActions ? '▼' : '▶'}</span>
            Action checklist ({opp.action_steps!.length} steps)
          </button>
          {showActions && <ActionChecklist steps={opp.action_steps!} opportunityId={opp.email_id} />}
        </>
      )}
    </div>
  );
}
