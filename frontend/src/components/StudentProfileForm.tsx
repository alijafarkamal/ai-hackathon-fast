import { useState, useEffect } from 'react';
import { User, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import type { StudentProfile } from '../lib/types';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Ali Hassan',
  university: 'FAST-NUCES Lahore',
  degree: 'BS',
  program: 'Computer Science',
  semester: 6,
  cgpa: 3.53,
  graduation_year: 2027,
  skills: ['Python', 'Machine Learning', 'LangChain', 'React', 'FastAPI'],
  interests: ['AI/ML', 'NLP', 'Full-Stack Development', 'Research'],
  preferred_types: ['SCHOLARSHIP', 'FELLOWSHIP', 'COMPETITION', 'INTERNSHIP'],
  financial_need: false,
  location_preference: 'ANY',
  nationality: 'Pakistani',
  gender: 'Male',
  past_experience: 'Won MIT Hack Nation Global AI Hackathon. Stanford Code in Place Section Leader. UG Research Assistant.',
};

interface Props {
  onChange: (profile: StudentProfile) => void;
  onLoadDemo: () => void;
  initialProfile?: StudentProfile | null;
}

export function StudentProfileForm({ onChange, onLoadDemo, initialProfile }: Props) {
  const [p, setP] = useState<StudentProfile>(initialProfile || DEFAULT_PROFILE);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (initialProfile) setP(initialProfile);
  }, [initialProfile]);

  const update = (patch: Partial<StudentProfile>) => {
    const next = { ...p, ...patch };
    setP(next);
    onChange(next);
  };

  // Auto-emit on mount
  useEffect(() => { onChange(p); }, []);

  const PREF_TYPES = ['SCHOLARSHIP', 'FELLOWSHIP', 'COMPETITION', 'INTERNSHIP', 'ADMISSION', 'JOB', 'WORKSHOP', 'CONFERENCE'];

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
    }}>
      {/* Card Header */}
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(167,139,250,0.15)', border: '1px solid var(--color-violet-border)'
          }}>
            <User size={14} color="var(--color-violet)" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0' }}>Student Profile</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>{p.name} · {p.university}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onLoadDemo} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
            border: '1px solid var(--color-violet-border)',
            background: 'rgba(167,139,250,0.12)', color: 'var(--color-violet)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>
            <Sparkles size={12} /> Load Demo
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            padding: '6px 8px', borderRadius: 8, border: '1px solid var(--color-border)',
            background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer'
          }}>
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <Field label="Full Name"><input style={inp} value={p.name} onChange={e => update({ name: e.target.value })} /></Field>
            <Field label="University"><input style={inp} value={p.university} onChange={e => update({ university: e.target.value })} /></Field>
            <Field label="Degree">
              <select style={inp} value={p.degree} onChange={e => update({ degree: e.target.value as any })}>
                {['BS', 'MS', 'PhD', 'MBA'].map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Program"><input style={inp} value={p.program} onChange={e => update({ program: e.target.value })} /></Field>
            <Field label="Semester">
              <input style={inp} type="number" min={1} max={12} value={p.semester} onChange={e => update({ semester: parseInt(e.target.value) || 1 })} />
            </Field>
            <Field label="CGPA (out of 4.0)">
              <input style={inp} type="number" step="0.01" min={0} max={4} value={p.cgpa} onChange={e => update({ cgpa: parseFloat(e.target.value) || 0 })} />
            </Field>
            <Field label="Graduation Year">
              <input style={inp} type="number" value={p.graduation_year} onChange={e => update({ graduation_year: parseInt(e.target.value) || 2027 })} />
            </Field>
            <Field label="Nationality">
              <input style={inp} value={p.nationality} onChange={e => update({ nationality: e.target.value })} />
            </Field>
            <Field label="Location Preference">
              <select style={inp} value={p.location_preference} onChange={e => update({ location_preference: e.target.value as any })}>
                {['ANY', 'LOCAL', 'REMOTE', 'INTERNATIONAL'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Financial Need">
              <select style={inp} value={p.financial_need ? 'Yes' : 'No'} onChange={e => update({ financial_need: e.target.value === 'Yes' })}>
                <option>No</option><option>Yes</option>
              </select>
            </Field>
          </div>

          {/* Skills */}
          <div style={{ marginTop: 12 }}>
            <div style={labelStyle}>Skills</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
              {p.skills.map((s, i) => (
                <span key={i} style={tag} onClick={() => update({ skills: p.skills.filter((_, j) => j !== i) })}>
                  {s} ×
                </span>
              ))}
            </div>
            <input style={{ ...inp, width: '100%', boxSizing: 'border-box' }} placeholder="Type skill + Enter"
              value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && skillInput.trim()) { update({ skills: [...p.skills, skillInput.trim()] }); setSkillInput(''); }}} />
          </div>

          {/* Interests */}
          <div style={{ marginTop: 10 }}>
            <div style={labelStyle}>Interests</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
              {p.interests.map((s, i) => (
                <span key={i} style={{ ...tag, background: 'rgba(167,139,250,0.12)', color: 'var(--color-violet)', borderColor: 'var(--color-violet-border)' }}
                  onClick={() => update({ interests: p.interests.filter((_, j) => j !== i) })}>
                  {s} ×
                </span>
              ))}
            </div>
            <input style={{ ...inp, width: '100%', boxSizing: 'border-box' }} placeholder="Type interest + Enter"
              value={interestInput} onChange={e => setInterestInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && interestInput.trim()) { update({ interests: [...p.interests, interestInput.trim()] }); setInterestInput(''); }}} />
          </div>

          {/* Preferred Types */}
          <div style={{ marginTop: 10 }}>
            <div style={labelStyle}>Preferred Opportunity Types</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PREF_TYPES.map(t => {
                const active = p.preferred_types.includes(t as any);
                return (
                  <button key={t} onClick={() => {
                    const next = active ? p.preferred_types.filter(x => x !== t) : [...p.preferred_types, t as any];
                    update({ preferred_types: next });
                  }} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20, cursor: 'pointer', fontWeight: 600,
                    background: active ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                    color: active ? 'var(--color-primary)' : 'var(--color-text-faint)',
                    border: active ? '1px solid var(--color-primary-border)' : '1px solid var(--color-border)'
                  }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Past Experience */}
          <div style={{ marginTop: 10 }}>
            <div style={labelStyle}>Past Experience</div>
            <textarea style={{ ...inp, width: '100%', boxSizing: 'border-box', minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }}
              value={p.past_experience} onChange={e => update({ past_experience: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 10.5, fontWeight: 700, color: 'var(--color-text-faint)',
  marginBottom: 5, letterSpacing: '0.07em', textTransform: 'uppercase',
};

const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--color-border)',
  borderRadius: 8, color: 'var(--color-text)',
  fontSize: 12.5, padding: '7px 10px', outline: 'none',
  fontFamily: 'inherit',
};

const tag: React.CSSProperties = {
  fontSize: 11.5, padding: '3px 10px', borderRadius: 20, cursor: 'pointer',
  background: 'var(--color-primary-glow)', color: 'var(--color-primary)',
  border: '1px solid var(--color-primary-border)', fontWeight: 500,
};
