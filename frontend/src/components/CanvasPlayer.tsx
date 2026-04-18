import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { useMotionValueEvent } from 'framer-motion';

interface Props {
  folder: string;
  frameCount: number;
  progress: MotionValue<number>;
}

const pad = (n: number) => String(n).padStart(3, '0');

export function CanvasPlayer({ folder, frameCount, progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index - 1];
    if (!canvas || !img?.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cr = canvas.width / canvas.height;
    const ir = img.width / img.height;
    let dw = canvas.width, dh = canvas.height, ox = 0, oy = 0;
    if (cr > ir) { dh = canvas.width / ir; oy = (canvas.height - dh) / 2; }
    else { dw = canvas.height * ir; ox = (canvas.width - dw) / 2; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  };

  useEffect(() => {
    let count = 0;
    const images: HTMLImageElement[] = [];
    const onLoad = () => { count++; if (count === frameCount) { setLoaded(true); drawFrame(1); } };
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${folder}/ezgif-frame-${pad(i)}.jpg`;
      img.onload = onLoad;
      img.onerror = onLoad;
      images.push(img);
    }
    imagesRef.current = images;
    return () => { imagesRef.current = []; };
  }, [folder, frameCount]);

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      const p = progress.get();
      drawFrame(Math.max(1, Math.min(frameCount, Math.round(p * (frameCount - 1)) + 1)));
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, [progress, frameCount]);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (!loaded) return;
    drawFrame(Math.max(1, Math.min(frameCount, Math.round(latest * (frameCount - 1)) + 1)));
  });

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#05060f' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'rgba(255,255,255,0.4)',
          fontSize: 13, letterSpacing: '0.2em', background: '#05060f', zIndex: 10
        }}>
          LOADING...
        </div>
      )}
    </div>
  );
}
