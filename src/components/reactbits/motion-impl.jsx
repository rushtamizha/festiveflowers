'use client';

// The Motion-driven halves of RotatingText, CircularText and ScrollVelocity.
// This file is imported lazily (after first paint) by the wrappers next to it.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as m from 'motion/react-m';
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  useAnimation,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';

/* ----------------------------- RotatingText ----------------------------- */

const splitIntoCharacters = (text) => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }
  return Array.from(text);
};

export function RotatingText({
  texts,
  transition = { type: 'spring', damping: 25, stiffness: 300 },
  initial = { y: '100%', opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: '-120%', opacity: 0 },
  rotationInterval = 2400,
  staggerDuration = 0.02,
  mainClassName = '',
  splitLevelClassName = '',
  elementLevelClassName = '',
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const words = useMemo(
    () =>
      texts[currentTextIndex].split(' ').map((word, i, arr) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== arr.length - 1,
      })),
    [texts, currentTextIndex],
  );

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTextIndex((i) => (i + 1) % texts.length), rotationInterval);
    return () => clearInterval(intervalId);
  }, [texts.length, rotationInterval]);

  return (
    <LazyMotion features={domAnimation}>
      <span className={`relative inline-flex flex-wrap whitespace-pre-wrap ${mainClassName}`}>
        <span className="sr-only">{texts[currentTextIndex]}</span>
        <AnimatePresence mode="wait" initial={false}>
          <m.span key={currentTextIndex} className="relative flex flex-wrap whitespace-pre-wrap" aria-hidden="true">
            {words.map((wordObj, wordIndex, array) => {
              const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
              return (
                <span key={wordIndex} className={`inline-flex ${splitLevelClassName}`}>
                  {wordObj.characters.map((char, charIndex) => (
                    <m.span
                      key={charIndex}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{ ...transition, delay: (previousCharsCount + charIndex) * staggerDuration }}
                      className={`inline-block ${elementLevelClassName}`}
                    >
                      {char}
                    </m.span>
                  ))}
                  {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
                </span>
              );
            })}
          </m.span>
        </AnimatePresence>
      </span>
    </LazyMotion>
  );
}

/* ----------------------------- CircularText ----------------------------- */

const getTransition = (duration, from) => ({
  rotate: { from, to: from + 360, ease: 'linear', duration, type: 'tween', repeat: Infinity },
  scale: { type: 'spring', damping: 20, stiffness: 300 },
});

export function CircularText({ text, spinDuration = 20, onHover = 'speedUp', className = '' }) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const ref = useRef(null);
  const inView = useInView(ref);

  // Only spin while visible, so nothing animates off screen.
  useEffect(() => {
    if (!inView) {
      controls.stop();
      return;
    }
    const start = rotation.get();
    controls.start({ rotate: start + 360, scale: 1, transition: getTransition(spinDuration, start) });
  }, [inView, spinDuration, text, controls, rotation]);

  const spin = (duration) => {
    const start = rotation.get();
    controls.start({ rotate: start + 360, scale: 1, transition: getTransition(duration, start) });
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        aria-hidden="true"
        className={`relative origin-center rounded-full text-center ${className}`}
        style={{ rotate: rotation }}
        initial={{ rotate: 0 }}
        animate={controls}
        onMouseEnter={() => onHover && spin(onHover === 'slowDown' ? spinDuration * 2 : spinDuration / 4)}
        onMouseLeave={() => spin(spinDuration)}
      >
        {letters.map((letter, i) => (
          <span
            key={i}
            className="absolute inset-0 inline-block"
            style={{ transform: `rotateZ(${(360 / letters.length) * i}deg)` }}
          >
            {letter}
          </span>
        ))}
      </m.div>
    </LazyMotion>
  );
}

/* ---------------------------- ScrollVelocity ---------------------------- */

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) setWidth(ref.current.offsetWidth);
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [ref]);

  return width;
}

function wrap(min, max, v) {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

function VelocityText({ children, baseVelocity, className, damping, stiffness, numCopies, velocityMapping }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(smoothVelocity, velocityMapping.input, velocityMapping.output, { clamp: false });

  const rowRef = useRef(null);
  const copyRef = useRef(null);
  const copyWidth = useElementWidth(copyRef);
  const inView = useInView(rowRef, { margin: '100px' });

  const x = useTransform(baseX, (v) => (copyWidth === 0 ? '0px' : `${wrap(-copyWidth, 0, v)}px`));

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    if (!inView) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const spans = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className="shrink-0" key={i} ref={i === 0 ? copyRef : null}>
        {children}&nbsp;
      </span>,
    );
  }

  return (
    <div ref={rowRef} className="relative overflow-hidden">
      <m.div className={`flex whitespace-nowrap will-change-transform ${className}`} style={{ x }}>
        {spans}
      </m.div>
    </div>
  );
}

export function ScrollVelocity({
  texts = [],
  velocity = 100,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
}) {
  return (
    <LazyMotion features={domAnimation}>
      <div aria-hidden="true">
        {texts.map((text, index) => (
          <VelocityText
            key={index}
            className={className}
            baseVelocity={index % 2 !== 0 ? -velocity : velocity}
            damping={damping}
            stiffness={stiffness}
            numCopies={numCopies}
            velocityMapping={velocityMapping}
          >
            {text}
          </VelocityText>
        ))}
      </div>
    </LazyMotion>
  );
}
