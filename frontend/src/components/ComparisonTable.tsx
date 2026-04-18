export function ComparisonTable() {
  const rows = [
    { feature: 'Scans for real opportunities', gmail: '❌', manual: '✅ (slow)', copilot: '✅ Instant' },
    { feature: 'Personalized profile matching', gmail: '❌', manual: '⚠️ Subjective', copilot: '✅ Evidence-backed' },
    { feature: 'Deadline urgency detection', gmail: '❌', manual: '⚠️ Often missed', copilot: '✅ Math-based scoring' },
    { feature: 'Ranked priority list', gmail: '❌', manual: '❌', copilot: '✅ Weighted formula' },
    { feature: 'Structured data extraction', gmail: '❌', manual: '⚠️ Manual', copilot: '✅ Automated' },
    { feature: 'Action checklist per opportunity', gmail: '❌', manual: '❌', copilot: '✅ Specific steps' },
    { feature: 'Explainable ranking reasons', gmail: '❌', manual: '❌', copilot: '✅ Evidence trail' },
    { feature: 'Time to process 15 emails', gmail: '—', manual: '~45 min', copilot: '~8 seconds' },
  ];
  return (
    <div style={{ marginTop: 40, padding: '24px', background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
        📊 Why Not Just Use Gmail Filters?
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Feature', 'Gmail Filters', 'Manual Reading', '🚀 Opportunity Copilot'].map((h, i) => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700,
                color: i === 3 ? '#74c0fc' : 'rgba(255,255,255,0.4)',
                borderBottom: '1px solid rgba(255,255,255,0.08)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '9px 12px', color: 'rgba(255,255,255,0.7)' }}>{row.feature}</td>
              <td style={{ padding: '9px 12px', color: '#ff6b6b' }}>{row.gmail}</td>
              <td style={{ padding: '9px 12px', color: '#ffd43b' }}>{row.manual}</td>
              <td style={{ padding: '9px 12px', color: '#51cf66', fontWeight: 600 }}>{row.copilot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
