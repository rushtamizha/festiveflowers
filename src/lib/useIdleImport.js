'use client';

import { useEffect, useState } from 'react';
import { afterFirstPaint } from './lazy';

// Returns a lazily imported module once the page is idle (null until then).
// Pass a module-level loader function so its identity is stable.
export function useIdleImport(loader) {
  const [mod, setMod] = useState(null);

  useEffect(() => {
    let active = true;
    afterFirstPaint()
      .then(loader)
      .then((loaded) => active && setMod(() => loaded));
    return () => {
      active = false;
    };
  }, [loader]);

  return mod;
}
