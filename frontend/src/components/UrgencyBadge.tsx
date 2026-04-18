interface Props { daysRemaining?: number | null; urgencyScore: number; }

const URGENCY_CONFIG = [
  { min: 1.0, bg: '#3d0a0a', text: '#ff6b6b', border: '#7f1d1d', label: (d: number) => `${d} DAY${d === 1 ? '' : 'S'} LEFT ⚠️` },
  { min: 0.9, bg: '#3d1f0a', text: '#ffa94d', border: '#7c3a1a', label: (d: number) => `${d} DAYS LEFT` },
  { min: 0.75, bg: '#3d340a', text: '#ffd43b', border: '#7a6800', label: (d: number) => `${d} days left` },
  { min: 0.55, bg: '#0a2e3d', text: '#74c0fc', border: '#1864ab', label: (d: number) => `${d} days left` },
  { min: 0, bg: '#1a1a2e', text: '#868e96', border: '#373a40', label: (d: number) => d !== undefined ? `${d} days left` : 'No deadline' },
];

export function UrgencyBadge({ daysRemaining, urgencyScore }: Props) {
  if (daysRemaining !== null && daysRemaining !== undefined && daysRemaining < 0) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
        padding: '3px 10px', borderRadius: 20, background: '#1a1a2e', color: '#495057',
        border: '1px solid #373a40', letterSpacing: '0.04em' }}>
        EXPIRED
      </span>
    );
  }
  if (daysRemaining === null || daysRemaining === undefined) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500,
        padding: '3px 10px', borderRadius: 20, background: '#1a1a2e', color: '#868e96',
        border: '1px solid #373a40' }}>
        No deadline
      </span>
    );
  }
  const cfg = URGENCY_CONFIG.find(c => urgencyScore >= c.min) || URGENCY_CONFIG[URGENCY_CONFIG.length - 1];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 20, background: cfg.bg, color: cfg.text,
      border: `1px solid ${cfg.border}`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {cfg.label(daysRemaining)}
    </span>
  );
}
