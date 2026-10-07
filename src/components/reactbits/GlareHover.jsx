'use client';

// React Bits — GlareHover (https://reactbits.dev/animations/glare-hover)
// Adapted: sizing and shape come from `className` so it can wrap responsive images.

import { useRef } from 'react';

const toRgba = (color, opacity) => {
  const hex = color.replace('#', '');
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

const GlareHover = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.45,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 700,
  className = '',
}) => {
  const overlayRef = useRef(null);

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    void el.offsetWidth;
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '100% 100%, 0 0';
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '-100% -100%, 0 0';
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onMouseEnter={animateIn} onMouseLeave={animateOut}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${toRgba(glareColor, glareOpacity)} 70%, hsla(0,0%,0%,0) 100%)`,
          backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '-100% -100%, 0 0',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default GlareHover;
