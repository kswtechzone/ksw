'use client';

import * as React from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  hue: number;
  delay: number;
}

export function ParticleField() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particles = React.useRef<Particle[]>([]);
  const raf = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 40;
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      size: 2 + Math.random() * 4,
      speed: 0.15 + Math.random() * 0.4,
      opacity: 0.15 + Math.random() * 0.35,
      hue: 0 + Math.random() * 20,
      delay: Math.random() * 200,
    }));

    let start = performance.now();

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = (now - start) / 1000;

      for (const p of particles.current) {
        const t = (elapsed - p.delay * 0.01) * p.speed;
        if (t < 0) continue;

        const y = p.y - t * 60;
        const fadeIn = Math.min(1, t * 2);
        const fadeOut = Math.max(0, Math.min(1, (canvas.height - y) / 200));
        const alpha = p.opacity * fadeIn * fadeOut;

        const gradient = ctx.createRadialGradient(p.x, y, 0, p.x, y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 55%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, 100%, 50%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 45%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
