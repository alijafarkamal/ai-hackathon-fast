export function ComparisonTable() {
  const rows = [
    { feature: 'Finds real opportunities', gmail: '❌', manual: '⚠️ slow', copilot: '✅ instant' },
    { feature: 'Personalized ranking', gmail: '❌', manual: '⚠️ subjective', copilot: '✅ profile-matched' },
    { feature: 'Deadline tracking', gmail: '❌', manual: '⚠️ manual', copilot: '✅ calendar export' },
    { feature: 'Near-miss detection', gmail: '❌', manual: '❌', copilot: '✅ gap analysis' },
    { feature: 'Evidence-backed reasoning', gmail: '❌', manual: '❌', copilot: '✅ explainable AI' },
    { feature: 'Speed (15 emails)', gmail: '~0s filtered', manual: '~45 min', copilot: '✅ ~6s' },
  ];

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--color-border)',
      background: 'var(--color-surface)'
    }}>
      <div style={{
        padding: '14px 18px', background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 8
      }}>
        <span style={{ fontSize: 16 }}>📊</span>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e8eaf0' }}>
          Copilot vs. Status Quo
        </h4>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            {['Feature', 'Gmail Filter', 'Manual Read', '🤖 Copilot'].map((h, i) => (
              <th key={i} style={{
                padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 700,
                color: i === 3 ? 'var(--color-primary)' : 'var(--color-text-faint)',
                letterSpacing: '0.05em', background: i === 3 ? 'rgba(96,165,250,0.06)' : undefined
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{
              borderBottom: i < rows.length - 1 ? '1px solid var(--color-border)' : undefined,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
            }}>
              <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{row.feature}</td>
              <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--color-text-muted)' }}>{row.gmail}</td>
              <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--color-text-muted)' }}>{row.manual}</td>
              <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--color-success)', fontWeight: 600, background: 'rgba(96,165,250,0.04)' }}>{row.copilot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
