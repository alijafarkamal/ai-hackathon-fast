import { useRef, useMemo, useState, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { ParsedOpportunity, StudentProfile } from '../lib/types';

// ── ErrorBoundary — catches WebGL/Three.js crashes so the whole app doesn't go blank ──
class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[3D Graph] WebGL error — showing 2D fallback:', error.message, info);
    this.setState({ crashed: true });
  }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

interface Props {
  opportunities: ParsedOpportunity[];
  profile: StudentProfile | null;
}

// Color palette for skill nodes
const SKILL_COLORS = [
  '#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f472b6',
  '#38bdf8', '#fb923c', '#6ee7b7', '#c084fc', '#f87171',
];

const TYPE_COLORS: Record<string, string> = {
  SCHOLARSHIP: '#60a5fa',
  FELLOWSHIP: '#a78bfa',
  INTERNSHIP: '#34d399',
  COMPETITION: '#fbbf24',
  JOB: '#f472b6',
  WORKSHOP: '#38bdf8',
  CONFERENCE: '#fb923c',
  ADMISSION: '#6ee7b7',
  OTHER: '#94a3b8',
};

interface NodeData {
  id: string;
  label: string;
  type: 'skill' | 'opportunity' | 'center';
  position: [number, number, number];
  color: string;
  connections: string[];
  fitScore?: number;
}

function SkillNode({ node, isHovered, onHover }: {
  node: NodeData;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const scale = isHovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const size = node.type === 'center' ? 0.5 : node.type === 'opportunity' ? 0.35 : 0.22;

  return (
    <group position={node.position}>
      {/* Main sphere — low-poly, basic material (no lighting cost) */}
      <mesh ref={meshRef}
        onPointerOver={() => onHover(node.id)}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={isHovered ? '#ffffff' : node.color} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, size + 0.2, 0]}
        fontSize={node.type === 'center' ? 0.18 : 0.12}
        color={isHovered ? '#ffffff' : node.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {node.label}
      </Text>

      {node.type === 'opportunity' && node.fitScore != null && (
        <Text
          position={[0, -(size + 0.18), 0]}
          fontSize={0.1}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {Math.round(node.fitScore * 100)}% fit
        </Text>
      )}
    </group>
  );
}

function ConnectionLine({ from, to, color, strength }: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  strength: number;
}) {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  return (
    <Line
      points={points}
      color={color}
      lineWidth={strength * 2}
      transparent
      opacity={0.3 + strength * 0.4}
      dashed={false}
    />
  );
}

// ── 2D fallback when WebGL/GPU not available ──────────────────────────────────
function FallbackGraph({ opportunities, profile }: Props) {
  const skills = profile?.skills || [];
  return (
    <div style={{
      borderRadius: 14, border: '1px solid var(--color-border)',
      background: '#07080f', padding: 24,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 20, color: '#fbbf24', fontSize: 12 }}>
        ⚠️ WebGL unavailable on this machine — showing 2D skill matrix
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {skills.map((skill, i) => {
          const matched = opportunities.filter(o =>
            [(o.title || ''), ...(o.eligibility_criteria || []), (o.opportunity_type || '')].join(' ').toLowerCase().includes(skill.toLowerCase()) || (o.fit_score || 0) > 0.7
          );
          const pct = opportunities.length ? matched.length / opportunities.length : 0;
          const color = SKILL_COLORS[i % SKILL_COLORS.length];
          return (
            <div key={skill} style={{ padding: 14, borderRadius: 10, background: 'var(--color-surface)', border: `1px solid ${color}33` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{skill}</div>
              <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${pct * 100}%`, background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>{matched.length} / {opportunities.length} opportunities matched</div>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {matched.slice(0, 2).map(o => (
                  <span key={o.email_id} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: `${color}22`, color, border: `1px solid ${color}44` }}>
                    {(o.title || '').slice(0, 18)}…
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {opportunities.map((o, i) => (
          <div key={o.email_id} style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 11,
            background: `${TYPE_COLORS[o.opportunity_type || 'OTHER'] || '#94a3b8'}18`,
            border: `1px solid ${TYPE_COLORS[o.opportunity_type || 'OTHER'] || '#94a3b8'}44`,
            color: TYPE_COLORS[o.opportunity_type || 'OTHER'] || '#94a3b8',
          }}>
            #{i + 1} {(o.title || '').slice(0, 28)} — {Math.round((o.fit_score || 0) * 100)}% fit
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneContent({ opportunities, profile }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { nodes, connections } = useMemo(() => {
    const skills = profile?.skills || [];
    const nodes: NodeData[] = [];
    const connections: { from: string; to: string; color: string; strength: number }[] = [];

    // Center node — student
    nodes.push({
      id: 'student',
      label: profile?.name || 'Student',
      type: 'center',
      position: [0, 0, 0],
      color: '#ffffff',
      connections: [],
    });

    // Skill nodes — arranged in a ring
    skills.forEach((skill, i) => {
      const angle = (i / Math.max(skills.length, 1)) * Math.PI * 2;
      const radius = 2.8;
      nodes.push({
        id: `skill_${i}`,
        label: skill,
        type: 'skill',
        position: [
          Math.cos(angle) * radius,
          (Math.sin(i * 1.3) * 0.8),
          Math.sin(angle) * radius,
        ],
        color: SKILL_COLORS[i % SKILL_COLORS.length],
        connections: ['student'],
      });
      // Connect skill to center
      connections.push({ from: 'student', to: `skill_${i}`, color: SKILL_COLORS[i % SKILL_COLORS.length], strength: 0.4 });
    });

    // Opportunity nodes — cap at 6 to keep draw calls low on CPU
    const topOpps = opportunities.slice(0, 6);
    topOpps.forEach((opp, i) => {
      const angle = (i / Math.max(topOpps.length, 1)) * Math.PI * 2 + Math.PI / topOpps.length;
      const radius = 5.5;
      const oppColor = TYPE_COLORS[opp.opportunity_type || 'OTHER'] || '#94a3b8';
      const nodeId = `opp_${i}`;
      nodes.push({
        id: nodeId,
        label: (opp.title || opp.opportunity_type || 'Opportunity').slice(0, 25),
        type: 'opportunity',
        position: [
          Math.cos(angle) * radius,
          (Math.sin(i * 0.9) * 1.2),
          Math.sin(angle) * radius,
        ],
        color: oppColor,
        connections: [],
        fitScore: opp.fit_score,
      });

      // Connect opportunity to matching skills
      const oppSkillsRaw = [
        ...(opp.eligibility_criteria || []),
        opp.title || '',
        opp.opportunity_type || ''
      ].join(' ').toLowerCase();

      skills.forEach((skill, si) => {
        if (oppSkillsRaw.includes(skill.toLowerCase()) || (opp.fit_score || 0) > 0.7) {
          const strength = (opp.fit_score || 0.5);
          connections.push({ from: nodeId, to: `skill_${si}`, color: oppColor, strength });
        }
      });

      // Always connect to center with fit strength
      connections.push({ from: nodeId, to: 'student', color: oppColor, strength: opp.fit_score || 0.5 });
    });

    return { nodes, connections };
  }, [opportunities, profile]);

  const nodeMap = useMemo(() => {
    const m: Record<string, NodeData> = {};
    nodes.forEach(n => { m[n.id] = n; });
    return m;
  }, [nodes]);

  return (
    <>
      {/* Single ambient light — no point lights (expensive on CPU) */}
      <ambientLight intensity={0.9} />

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.4}
      />

      {connections.map((conn, i) => {
        const from = nodeMap[conn.from];
        const to = nodeMap[conn.to];
        if (!from || !to) return null;
        return (
          <ConnectionLine
            key={i}
            from={from.position}
            to={to.position}
            color={conn.color}
            strength={conn.strength}
          />
        );
      })}

      {/* No Float wrapper — saves per-frame CPU calculations */}
      {nodes.map(node => (
        <SkillNode
          key={node.id}
          node={node}
          isHovered={hoveredId === node.id}
          onHover={setHoveredId}
        />
      ))}
    </>
  );
}

export function SkillGraphViz({ opportunities, profile }: Props) {
  const typeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    opportunities.forEach(o => {
      const t = o.opportunity_type || 'OTHER';
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [opportunities]);

  if (opportunities.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 400, background: 'var(--color-surface)', borderRadius: 14,
        border: '1px solid var(--color-border)', color: 'var(--color-text-faint)',
        fontSize: 14
      }}>
        Run a scan first to see the skill-opportunity graph
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e8eaf0', marginBottom: 6 }}>
          🕸️ 3D Skill-Opportunity Knowledge Graph
        </h2>
        <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          Neo4j-style visualization · Center = your profile · Inner ring = your skills · Outer ring = opportunities
          · Line thickness = fit strength · Drag to rotate · Scroll to zoom
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        {Object.entries(TYPE_COLORS).filter(([t]) => typeBreakdown[t]).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{type} ({typeBreakdown[type]})</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px #fff' }} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Your Profile</span>
        </div>
      </div>

      <CanvasErrorBoundary fallback={<FallbackGraph opportunities={opportunities} profile={profile} />}>
        <div style={{
          height: 520, borderRadius: 14, overflow: 'hidden',
          border: '1px solid var(--color-border)',
          background: 'radial-gradient(ellipse at center, #0a0f1e 0%, #07080f 100%)',
        }}>
          <Canvas camera={{ position: [0, 4, 12], fov: 60 }} dpr={1} gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}>
            <SceneContent opportunities={opportunities} profile={profile} />
          </Canvas>
        </div>
      </CanvasErrorBoundary>

      {/* Skill match stats below */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
        {(profile?.skills || []).slice(0, 8).map((skill, i) => {
          const matchCount = opportunities.filter(o => {
            const text = [o.title, ...(o.eligibility_criteria || []), o.opportunity_type].join(' ').toLowerCase();
            return text.includes(skill.toLowerCase()) || (o.fit_score || 0) > 0.7;
          }).length;
          return (
            <div key={skill} style={{
              padding: '10px 12px', borderRadius: 10,
              background: 'var(--color-surface)', border: `1px solid ${SKILL_COLORS[i % SKILL_COLORS.length]}33`
            }}>
              <div style={{ fontSize: 11, color: SKILL_COLORS[i % SKILL_COLORS.length], fontWeight: 700, marginBottom: 4 }}>
                {skill}
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>
                {matchCount} opportunit{matchCount !== 1 ? 'ies' : 'y'} matched
              </div>
              <div style={{ marginTop: 5, height: 3, background: 'var(--color-border)', borderRadius: 2 }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${opportunities.length ? (matchCount / opportunities.length) * 100 : 0}%`,
                  background: SKILL_COLORS[i % SKILL_COLORS.length],
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
