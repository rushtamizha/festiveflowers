'use client';

// React Bits — ScrollVelocity (https://reactbits.dev/text-animations/scroll-velocity)
// Adapted: renders static rows first; the scroll-reactive Motion version (motion-impl.jsx)
// takes over once it has loaded after first paint, and pauses while off screen.

import { useIdleImport } from '@/lib/useIdleImport';

const load = () => import('./motion-impl');

export default function ScrollVelocity(props) {
  const impl = useIdleImport(load);
  if (impl) return <impl.ScrollVelocity {...props} />;

  const { texts = [], className = '', numCopies = 6 } = props;
  return (
    <div aria-hidden="true">
      {texts.map((text, index) => (
        <div key={index} className="relative overflow-hidden">
          <div className={`flex whitespace-nowrap ${className}`}>
            {Array.from({ length: numCopies }, (_, i) => (
              <span className="shrink-0" key={i}>
                {text}&nbsp;
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
