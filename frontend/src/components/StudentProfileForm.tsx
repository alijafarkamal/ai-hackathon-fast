import { useState } from 'react';
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

  const update = (patch: Partial<StudentProfile>) => {
    const next = { ...p, ...patch };
    setP(next);
    onChange(next);
  };

  const PREF_TYPES = ['SCHOLARSHIP', 'FELLOWSHIP', 'COMPETITION', 'INTERNSHIP', 'ADMISSION', 'JOB', 'WORKSHOP', 'CONFERENCE'];

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
          👤 Student Profile
        </h3>
        <button onClick={onLoadDemo} style={demoBtn}>Load Demo Profile</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        <Field label="Full Name">
          <input style={inp} value={p.name} onChange={e => update({ name: e.target.value })} />
        </Field>
        <Field label="University">
          <input style={inp} value={p.university} onChange={e => update({ university: e.target.value })} />
        </Field>
        <Field label="Degree">
          <select style={inp} value={p.degree} onChange={e => update({ degree: e.target.value as any })}>
            {['BS', 'MS', 'PhD', 'MBA'].map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Program">
          <input style={inp} value={p.program} onChange={e => update({ program: e.target.value })} />
        </Field>
        <Field label="Semester">
          <input style={inp} type="number" min={1} max={12} value={p.semester}
            onChange={e => update({ semester: parseInt(e.target.value) || 1 })} />
        </Field>
        <Field label="CGPA (out of 4.0)">
          <input style={inp} type="number" step="0.01" min={0} max={4} value={p.cgpa}
            onChange={e => update({ cgpa: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Graduation Year">
          <input style={inp} type="number" value={p.graduation_year}
            onChange={e => update({ graduation_year: parseInt(e.target.value) || 2027 })} />
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
          <select style={inp} value={p.financial_need ? 'Yes' : 'No'}
            onChange={e => update({ financial_need: e.target.value === 'Yes' })}>
            <option>No</option><option>Yes</option>
          </select>
        </Field>
      </div>

      {/* Skills */}
      <div style={{ marginTop: 14 }}>
        <div style={labelStyle}>Skills</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          {p.skills.map((s, i) => (
            <span key={i} style={tag} onClick={() => update({ skills: p.skills.filter((_, j) => j !== i) })}>
              {s} ×
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input style={{ ...inp, flex: 1 }} placeholder="Add skill..." value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && skillInput.trim()) { update({ skills: [...p.skills, skillInput.trim()] }); setSkillInput(''); }}} />
        </div>
      </div>

      {/* Interests */}
      <div style={{ marginTop: 12 }}>
        <div style={labelStyle}>Interests</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          {p.interests.map((s, i) => (
            <span key={i} style={{ ...tag, background: 'rgba(218,119,242,0.15)', color: '#da77f2', borderColor: 'rgba(218,119,242,0.3)' }}
              onClick={() => update({ interests: p.interests.filter((_, j) => j !== i) })}>
              {s} ×
            </span>
          ))}
        </div>
        <input style={{ ...inp, width: '100%', boxSizing: 'border-box' }} placeholder="Add interest..." value={interestInput}
          onChange={e => setInterestInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && interestInput.trim()) { update({ interests: [...p.interests, interestInput.trim()] }); setInterestInput(''); }}} />
      </div>

      {/* Preferred types */}
      <div style={{ marginTop: 12 }}>
        <div style={labelStyle}>Preferred Opportunity Types</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PREF_TYPES.map(t => {
            const active = p.preferred_types.includes(t as any);
            return (
              <button key={t} onClick={() => {
                const next = active ? p.preferred_types.filter(x => x !== t) : [...p.preferred_types, t as any];
                update({ preferred_types: next });
              }} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, cursor: 'pointer', fontWeight: 600,
                background: active ? 'rgba(116,192,252,0.2)' : 'rgba(255,255,255,0.04)',
                color: active ? '#74c0fc' : 'rgba(255,255,255,0.3)',
                border: active ? '1px solid rgba(116,192,252,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Past experience */}
      <div style={{ marginTop: 12 }}>
        <div style={labelStyle}>Past Experience (brief)</div>
        <textarea style={{ ...inp, width: '100%', boxSizing: 'border-box', minHeight: 64, resize: 'vertical' }}
          value={p.past_experience} onChange={e => update({ past_experience: e.target.value })} />
      </div>
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
  fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
  marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase',
};

const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.9)',
  fontSize: 13, padding: '7px 10px', outline: 'none',
};

const tag: React.CSSProperties = {
  fontSize: 12, padding: '3px 10px', borderRadius: 20, cursor: 'pointer',
  background: 'rgba(116,192,252,0.12)', color: '#74c0fc', border: '1px solid rgba(116,192,252,0.25)',
  fontWeight: 500,
};

const demoBtn: React.CSSProperties = {
  fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 500,
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
  color: 'rgba(255,255,255,0.7)',
};
