interface Props {
  daysRemaining: number;
}

export function UrgencyBadge({ daysRemaining }: Props) {
  let bg: string, border: string, color: string, label: string, emoji: string;

  if (daysRemaining <= 3) {
    bg = 'rgba(248,113,113,0.15)'; border = 'rgba(248,113,113,0.4)';
    color = '#f87171'; label = `${daysRemaining}d left`; emoji = '🔴';
  } else if (daysRemaining <= 7) {
    bg = 'rgba(251,191,36,0.15)'; border = 'rgba(251,191,36,0.4)';
    color = '#fbbf24'; label = `${daysRemaining}d left`; emoji = '🟡';
  } else if (daysRemaining <= 14) {
    bg = 'rgba(251,146,60,0.15)'; border = 'rgba(251,146,60,0.4)';
    color = '#fb923c'; label = `${daysRemaining}d left`; emoji = '🟠';
  } else {
    bg = 'rgba(52,211,153,0.12)'; border = 'rgba(52,211,153,0.3)';
    color = '#34d399'; label = `${daysRemaining}d`; emoji = '🟢';
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
      borderRadius: 20, background: bg, border: `1px solid ${border}`,
      boxShadow: daysRemaining <= 3 ? '0 0 8px rgba(248,113,113,0.25)' : undefined
    }}>
      <span style={{ fontSize: 10 }}>{emoji}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{label}</span>
    </div>
  );
}
