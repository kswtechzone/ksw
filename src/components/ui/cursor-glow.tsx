'use client';

import * as React from 'react';

export function CursorGlow() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let raf: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      if (!ref.current) return;
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      ref.current.style.left = `${currentX}px`;
      ref.current.style.top = `${currentY}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle at center, rgba(255, 50, 50, 0.6) 0%, rgba(255, 0, 0, 0.25) 30%, transparent 70%)',
      }}
      aria-hidden
    />
  );
}
