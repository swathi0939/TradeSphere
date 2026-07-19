import { useEffect, useRef } from 'react';
import { useIntersection } from '@/hooks/useIntersection';
import { getPrefersReducedMotion } from '@/utils/helpers';

interface Particle {
  x: number;
  y: number;
  speed: number;
  up: boolean;
  value: string;
}

/** Faint scrolling ticker numbers drifting behind the hero — purely decorative. */
export function TickerField() {
  const { ref, isIntersecting } = useIntersection<HTMLCanvasElement>({ threshold: 0.05 });
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  function resize() {
    const canvas = ref.current;
    if (!canvas) return;
    const w = (canvas.width = canvas.offsetWidth);
    const h = (canvas.height = canvas.offsetHeight);
    sizeRef.current = { w, h };
    const count = Math.floor((w * h) / 26000);
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0.15 + Math.random() * 0.35,
      up: Math.random() > 0.45,
      value: (Math.random() * 900 + 100).toFixed(1),
    }));
  }

  function draw() {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { w, h } = sizeRef.current;

    ctx.clearRect(0, 0, w, h);
    ctx.font = '10px ' + getComputedStyle(document.documentElement).getPropertyValue('--font-mono');
    particlesRef.current.forEach((p) => {
      ctx.fillStyle = p.up ? 'rgba(0,200,150,0.28)' : 'rgba(255,77,79,0.24)';
      ctx.fillText(p.value, p.x, p.y);
      p.y -= p.speed;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
    });
  }

  useEffect(() => {
    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getPrefersReducedMotion() || !isIntersecting) return;
    let rafId = requestAnimationFrame(function loop() {
      draw();
      rafId = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  return <canvas ref={ref} className="absolute inset-0 opacity-50" aria-hidden="true" />;
}
