import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, AreaChart, Area,
} from 'recharts';
import type { ParsedOpportunity } from '../lib/types';

interface Props {
  opportunities: ParsedOpportunity[];
}

const TYPE_COLORS: Record<string, string> = {
  SCHOLARSHIP: '#60a5fa',
  INTERNSHIP:  '#34d399',
  FELLOWSHIP:  '#a78bfa',
  COMPETITION: '#fb923c',
  JOB:         '#fbbf24',
  WORKSHOP:    '#f472b6',
  CONFERENCE:  '#38bdf8',
  ADMISSION:   '#c084fc',
  OTHER:       '#94a3b8',
};

const URGENCY_COLOR = (score: number) => {
  if (score >= 0.9) return '#f87171';
  if (score >= 0.7) return '#fb923c';
  if (score >= 0.5) return '#fbbf24';
  return '#34d399';
};

const CustomTooltipStyle = {
  background: '#0d0f1a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 12,
  color: '#e8eaf0',
};

function PriorityTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={CustomTooltipStyle}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
      <div style={{ color: '#94a3b8' }}>Priority Score: <span style={{ color: '#60a5fa' }}>{(d?.priority * 100).toFixed(1)}%</span></div>
      <div style={{ color: '#94a3b8' }}>Urgency: <span style={{ color: URGENCY_COLOR(d?.urgency ?? 0) }}>{(d?.urgency * 100).toFixed(0)}%</span></div>
    </div>
  );
}

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={CustomTooltipStyle}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
      <div style={{ color: '#94a3b8' }}>Fit Score: <span style={{ color: '#a78bfa' }}>{(d?.fit * 100).toFixed(0)}%</span></div>
      <div style={{ color: '#94a3b8' }}>Urgency: <span style={{ color: '#fb923c' }}>{(d?.urgency * 100).toFixed(0)}%</span></div>
      <div style={{ color: '#94a3b8' }}>Priority: <span style={{ color: '#60a5fa' }}>{(d?.priority * 100).toFixed(1)}%</span></div>
    </div>
  );
}

function DeadlineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CustomTooltipStyle}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#94a3b8' }}>Days remaining: <span style={{ color: '#34d399' }}>{payload[0]?.value}</span></div>
    </div>
  );
}

export function AnalyticsDashboard({ opportunities }: Props) {
  if (!opportunities.length) return null;

  // Chart 1: Priority scores bar
  const priorityData = opportunities.map((o, i) => ({
    name: (o.title || `Opp ${i+1}`).slice(0, 22) + ((o.title || '').length > 22 ? '…' : ''),
    priority: o.priority_score ?? 0,
    urgency: o.urgency_score ?? 0,
    fit: o.fit_score ?? 0,
  }));

  // Chart 2: Type distribution pie
  const typeCounts: Record<string, number> = {};
  for (const o of opportunities) {
    const t = o.opportunity_type || 'OTHER';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  }
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  // Chart 3: Fit vs Urgency scatter
  const scatterData = opportunities.map((o, i) => ({
    name: (o.title || `Opp ${i+1}`).slice(0, 30),
    fit: o.fit_score ?? 0,
    urgency: o.urgency_score ?? 0,
    priority: o.priority_score ?? 0,
    z: Math.round((o.priority_score ?? 0.5) * 80) + 20,
  }));

  // Chart 4: Deadline countdown area
  const deadlineData = opportunities
    .filter(o => o.days_remaining != null)
    .sort((a, b) => (a.days_remaining ?? 999) - (b.days_remaining ?? 999))
    .map((o, i) => ({
      name: (o.title || `Opp ${i+1}`).slice(0, 20) + '…',
      days: o.days_remaining ?? 0,
    }));

  const sectionHeader = (title: string, subtitle: string) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e8eaf0' }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-faint)', marginTop: 2 }}>{subtitle}</div>
    </div>
  );

  const cardStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '18px 20px',
  };

  return (
    <div style={{ marginTop: 28 }}>
      {/* Section title */}
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 3, height: 22, borderRadius: 2,
          background: 'linear-gradient(180deg, #60a5fa, #a78bfa)'
        }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e8eaf0' }}>Pipeline Analytics</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>
            Deterministic scoring engine — urgency × fit × completeness
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Chart 1: Priority Scores */}
        <div style={cardStyle}>
          {sectionHeader('Priority Score Ranking', 'Weighted: urgency(35%) + fit(40%) + completeness(25%)')}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 1]} tickFormatter={v => `${(v*100).toFixed(0)}%`} />
              <Tooltip content={<PriorityTooltip />} />
              <Bar dataKey="priority" radius={[4, 4, 0, 0]}>
                {priorityData.map((d, i) => (
                  <Cell key={i} fill={URGENCY_COLOR(d.urgency)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Opportunity Type Pie */}
        <div style={cardStyle}>
          {sectionHeader('Opportunity Type Breakdown', 'Distribution of opportunity categories in your inbox')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={TYPE_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: TYPE_COLORS[d.name] || '#94a3b8', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: '#e8eaf0', fontWeight: 600, marginLeft: 'auto' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Fit vs Urgency Scatter */}
        <div style={cardStyle}>
          {sectionHeader('Fit × Urgency Matrix', 'Bubble size = priority score — top-right quadrant = act now')}
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="fit" name="Fit Score" type="number" domain={[0, 1]}
                tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `${(v*100).toFixed(0)}%`}
                label={{ value: 'Fit Score →', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 10 }} />
              <YAxis dataKey="urgency" name="Urgency" type="number" domain={[0, 1]}
                tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `${(v*100).toFixed(0)}%`} />
              <ZAxis dataKey="z" range={[40, 200]} />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter data={scatterData} fill="#a78bfa" fillOpacity={0.75} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Deadline Countdown */}
        <div style={cardStyle}>
          {sectionHeader('Deadline Countdown', 'Days remaining per opportunity — left = urgent')}
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={deadlineData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
              <defs>
                <linearGradient id="deadlineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }} />
              <Tooltip content={<DeadlineTooltip />} />
              <Area type="monotone" dataKey="days" stroke="#34d399" strokeWidth={2}
                fill="url(#deadlineGradient)" dot={{ fill: '#34d399', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
