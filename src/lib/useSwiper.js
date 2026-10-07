'use client';

import { useEffect, useRef } from 'react';
import { loadSwiper } from './lazy';

/**
 * Turns server-rendered `.swiper > .swiper-wrapper > .swiper-slide` markup into a Swiper.
 * The markup already has its final layout from CSS, so nothing moves when Swiper takes over.
 *
 * @param getOptions (kit) => Swiper options. `kit` holds the Swiper modules.
 * @param nearViewport initialise only when the slider approaches the viewport.
 */
export function useSwiper(getOptions, { nearViewport = false, onReady } = {}) {
  const ref = useRef(null);
  const config = useRef({ getOptions, onReady });

  useEffect(() => {
    config.current = { getOptions, onReady };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let active = true;
    let instance;
    let observer;

    const init = () =>
      loadSwiper().then((kit) => {
        if (!active) return;
        el.scrollLeft = 0;
        instance = new kit.Swiper(el, config.current.getOptions(kit));
        config.current.onReady?.(instance);
      });

    if (nearViewport) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            init();
          }
        },
        { rootMargin: '500px' },
      );
      observer.observe(el);
    } else {
      init();
    }

    return () => {
      active = false;
      observer?.disconnect();
      instance?.destroy(true, false);
    };
  }, [nearViewport]);

  return ref;
}
