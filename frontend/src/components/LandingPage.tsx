import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CanvasPlayer } from './CanvasPlayer';

interface Props { onEnter: () => void; }

const PURPLE = '#6C63FF';

function SectionChaos() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.5, 0.6], [0, 1, 1, 0]);
  const y      = useTransform(scrollYProgress, [0.1, 0.2, 0.5, 0.6], [40, 0, 0, -40]);

  return (
    <section ref={ref} style={{ position: 'relative', width: '100%', height: '500vh' }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <CanvasPlayer folder="/frames/chaos" frameCount={120} progress={scrollYProgress} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 24px', pointerEvents: 'none' }}>
          <motion.div style={{ opacity, y, textAlign: 'center', maxWidth: 800 }}>
            <h1 style={{ fontSize: '60px', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}>
              15 emails.
              <br />
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>3 scholarships buried inside.</span>
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionScanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.8], [0, 1, 1, 0]);
  const y      = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.8], [40, 0, 0, -40]);

  return (
    <section ref={ref} style={{ position: 'relative', width: '100%', height: '400vh' }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <CanvasPlayer folder="/frames/orb" frameCount={120} progress={scrollYProgress} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 120, zIndex: 10, padding: '0 24px 120px', pointerEvents: 'none' }}>
          <motion.div style={{ opacity, y, textAlign: 'center', maxWidth: 700 }}>
            <h2 style={{ fontSize: '48px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
              Opportunity Copilot scans your inbox in{' '}
              <span style={{ color: PURPLE, fontWeight: 700 }}>8 seconds.</span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionTransform() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const textOpacity  = useTransform(scrollYProgress, [0.4, 0.48, 0.52, 0.6], [0, 1, 1, 0]);
  const textScale    = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0.9, 1, 1.1]);
  const flashOpacity = useTransform(scrollYProgress, [0.48, 0.5, 0.53], [0, 1, 0]);

  return (
    <section ref={ref} style={{ position: 'relative', width: '100%', height: '300vh' }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <CanvasPlayer folder="/frames/transform" frameCount={120} progress={scrollYProgress} />
        <motion.div style={{ opacity: flashOpacity, position: 'absolute', inset: 0, background: 'white', zIndex: 10, pointerEvents: 'none', mixBlendMode: 'overlay' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none' }}>
          <motion.h2 style={{ opacity: textOpacity, scale: textScale, textAlign: 'center', fontSize: '80px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}>
            Chaos <span style={{ color: PURPLE }}>→</span> Clarity.
          </motion.h2>
        </div>
      </div>
    </section>
  );
}

function SectionCards() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const y      = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [40, 0, 0, -40]);

  return (
    <section ref={ref} style={{ position: 'relative', width: '100%', height: '500vh' }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <CanvasPlayer folder="/frames/cards" frameCount={120} progress={scrollYProgress} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120, zIndex: 10, pointerEvents: 'none' }}>
          <motion.div style={{ opacity, y, textAlign: 'center', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', padding: '24px 36px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 700 }}>
            <h2 style={{ fontSize: '48px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
              Ranked by <span style={{ color: '#f87171' }}>urgency.</span>
              <br />
              Matched to your <span style={{ color: PURPLE }}>profile.</span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionCTA({ onEnter }: { onEnter: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const y      = useTransform(scrollYProgress, [0.1, 0.4], [50, 0]);

  return (
    <section ref={ref} style={{ position: 'relative', width: '100%', height: '300vh' }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <CanvasPlayer folder="/frames/profile" frameCount={120} progress={scrollYProgress} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: '0 24px' }}>
          <motion.div style={{ opacity, y, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Floating profile card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ background: 'rgba(26,27,38,0.85)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 280, pointerEvents: 'none' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${PURPLE}, #a78bfa)`, marginBottom: 16, boxShadow: `0 0 24px ${PURPLE}66` }} />
              <div style={{ height: 12, width: 120, background: 'rgba(255,255,255,0.2)', borderRadius: 6, marginBottom: 10 }} />
              <div style={{ height: 10, width: 160, background: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 20 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ height: 28, width: 70, background: `${PURPLE}33`, border: `1px solid ${PURPLE}88`, borderRadius: 20 }} />
                <div style={{ height: 28, width: 70, background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.5)', borderRadius: 20 }} />
              </div>
            </motion.div>

            <h2 style={{ fontSize: '60px', fontWeight: 800, color: '#fff', textAlign: 'center', letterSpacing: '-0.03em', textShadow: '0 4px 40px rgba(0,0,0,0.8)', marginBottom: 36, maxWidth: 700 }}>
              Stop missing what you deserve.
            </h2>

            <button
              onClick={onEnter}
              style={{ padding: '16px 40px', fontSize: 17, fontWeight: 700, color: '#fff', background: PURPLE, border: 'none', borderRadius: 50, cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 0 0px ${PURPLE}00` }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px ${PURPLE}99`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0px ${PURPLE}00`)}
            >
              Launch Copilot →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function LandingPage({ onEnter }: Props) {
  return (
    <div style={{ background: '#05060f', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(5,6,15,0.9), transparent)' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '0.02em' }}>✦ Opportunity Copilot</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>SOFTEC 2026</span>
          <button onClick={onEnter} style={{ padding: '16px 40px', fontSize: 18, fontWeight: 700, color: '#fff', background: '#6C63FF', border: 'none', borderRadius: 50, cursor: 'pointer', letterSpacing: '0.05em', boxShadow: '0 0 30px rgba(108,99,255,0.6)' }}>
            Skip Intro →
          </button>
        </div>
      </nav>

      <SectionChaos />
      <SectionScanner />
      <SectionTransform />
      <SectionCards />
      <SectionCTA onEnter={onEnter} />
    </div>
  );
}
