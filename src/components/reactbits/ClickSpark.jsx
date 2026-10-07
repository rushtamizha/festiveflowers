'use client';

// React Bits — ClickSpark (https://reactbits.dev/animations/click-spark)
// Adapted for a whole site: one fixed, viewport-sized canvas instead of a canvas as tall
// as the page, and the animation loop only runs while sparks are actually on screen.

import { useRef, useEffect } from 'react';

const ease = (t) => t * (2 - t);

const ClickSpark = ({
  sparkColor = '#d81b66',
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 450,
  extraScale = 1.0,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let sparks = [];
    let frame = 0;
    let sized = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sized = true;
    };

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparks = sparks.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const eased = ease(Math.max(0, elapsed) / duration);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      frame = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const handleClick = (e) => {
      if (!sized) resize();
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / sparkCount, startTime: now });
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      sized = false;
    };

    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, extraScale]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] h-full w-full" />;
};

export default ClickSpark;
