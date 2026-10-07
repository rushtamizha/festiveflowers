'use client';

// React Bits — RotatingText (https://reactbits.dev/text-animations/rotating-text)
// Adapted: shows the first phrase as plain text straight away, then hands over to the
// Motion-driven version (motion-impl.jsx) once it has loaded after first paint.

import { useIdleImport } from '@/lib/useIdleImport';

const load = () => import('./motion-impl');

export default function RotatingText(props) {
  const impl = useIdleImport(load);
  if (impl) return <impl.RotatingText {...props} />;

  return (
    <span className={`relative inline-flex flex-wrap whitespace-pre-wrap ${props.mainClassName ?? ''}`}>
      {props.texts[0]}
    </span>
  );
}
