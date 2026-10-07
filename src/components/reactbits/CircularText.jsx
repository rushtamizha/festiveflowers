'use client';

// React Bits — CircularText (https://reactbits.dev/text-animations/circular-text)
// Adapted: the ring of letters is rendered statically first; the spinning Motion version
// (motion-impl.jsx) takes over once it has loaded after first paint.

import { useIdleImport } from '@/lib/useIdleImport';

const load = () => import('./motion-impl');

export default function CircularText(props) {
  const impl = useIdleImport(load);
  if (impl) return <impl.CircularText {...props} />;

  const letters = Array.from(props.text);
  return (
    <div aria-hidden="true" className={`relative origin-center rounded-full text-center ${props.className ?? ''}`}>
      {letters.map((letter, i) => (
        <span key={i} className="absolute inset-0 inline-block" style={{ transform: `rotateZ(${(360 / letters.length) * i}deg)` }}>
          {letter}
        </span>
      ))}
    </div>
  );
}
