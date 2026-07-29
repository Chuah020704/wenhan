import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseSize: number;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 2400,
    y: (Math.random() - 0.5) * 2400,
    z: Math.random() * 1600,
    baseSize: Math.random() * 1.8 + 0.4,
  }));
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let mouseX = 0;
    let mouseY = 0;

    const PARTICLE_COUNT = window.innerWidth < 640 ? 60 : 120;
    const particles = makeParticles(PARTICLE_COUNT);

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      el.width = el.offsetWidth;
      el.height = el.offsetHeight;
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 60;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 60;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    function getAccentColor(): [string, string] {
      const style = getComputedStyle(document.documentElement);
      const from = style.getPropertyValue('--accent-from').trim() || '#6366f1';
      const to = style.getPropertyValue('--accent-to').trim() || '#06b6d4';
      return [from, to];
    }

    let prev = 0;
    function draw(now: number) {
      rafId = requestAnimationFrame(draw);
      if (document.hidden) return;

      const dt = Math.min(now - prev, 50);
      prev = now;

      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const fov = 500;
      const [colorA, colorB] = getAccentColor();

      for (const p of particles) {
        p.z -= dt * 0.08;
        if (p.z <= 0) {
          p.z = 1600;
          p.x = (Math.random() - 0.5) * 2400;
          p.y = (Math.random() - 0.5) * 2400;
        }

        const scale = fov / (fov + p.z);
        const x2d = p.x * scale + w / 2 + mouseX * (1 - scale) * 4;
        const y2d = p.y * scale + h / 2 + mouseY * (1 - scale) * 4;
        const r = p.baseSize * scale * 3;
        const alpha = Math.min(scale * 0.85, 0.75);

        // Alternate particle color between accent-from and accent-to based on index
        const t = (p.x + p.y + 2400) / 4800;
        const color = t > 0.5 ? colorA : colorB;

        ctx!.beginPath();
        ctx!.arc(x2d, y2d, Math.max(r, 0.3), 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    />
  );
}
