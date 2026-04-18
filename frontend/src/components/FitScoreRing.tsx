interface Props { score: number; size?: number; }

export function FitScoreRing({ score, size = 56 }: Props) {
  const pct = Math.round(score * 100);
  const r = size / 2 - 5;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (pct / 100) * circumference;

  const color = pct >= 80 ? '#51cf66' : pct >= 60 ? '#ffd43b' : pct >= 40 ? '#ff922b' : '#ff6b6b';
  const trackColor = 'rgba(255,255,255,0.06)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={trackColor} strokeWidth={5} />
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color, lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>fit</span>
        </div>
      </div>
    </div>
  );
}
