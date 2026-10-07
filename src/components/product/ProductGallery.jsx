'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSwiper } from '@/lib/useSwiper';

// Product photos: a swipeable main image with thumbnail buttons.
// The first photo is server-rendered with high fetch priority (it is the page's LCP image).
export default function ProductGallery({ images, name }) {
  const swiper = useRef(null);
  const [active, setActive] = useState(0);

  const ref = useSwiper(
    ({ A11y, Keyboard }) => ({
      modules: [A11y, Keyboard],
      keyboard: { enabled: true, onlyInViewport: true },
      on: { slideChange: (instance) => setActive(instance.activeIndex) },
    }),
    {
      onReady: (instance) => {
        swiper.current = instance;
      },
    },
  );

  const show = (index) => {
    if (swiper.current) swiper.current.slideTo(index);
    else {
      // Swiper has not attached yet: scroll the strip natively.
      const el = ref.current;
      el?.scrollTo({ left: el.clientWidth * index, behavior: 'smooth' });
      setActive(index);
    }
  };

  // With a single photo there is nothing to pick between: no thumbnails, no counter.
  const several = images.length > 1;

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {several && (
        <ul className="flex gap-2.5 lg:w-20 lg:shrink-0 lg:flex-col" aria-label="Product photos">
          {images.map((src, index) => (
            <li key={index} className="w-1/4 lg:w-full">
              <button
                type="button"
                aria-label={`Show photo ${index + 1} of ${images.length}`}
                aria-current={active === index}
                onClick={() => show(index)}
                className={`relative block aspect-[4/5] w-full overflow-hidden rounded-xl border-2 bg-brand-100 transition ${
                  active === index ? 'border-brand-700' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={src} alt="" fill sizes="(min-width: 1024px) 80px, 24vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden rounded-large bg-brand-100">
        <div ref={ref} className="swiper swiper-single h-full">
          <div className="swiper-wrapper">
            {images.map((src, index) => (
              <div className="swiper-slide" key={index}>
                <Image
                  src={src}
                  alt={`${name} – photo ${index + 1}`}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {several && (
          <span className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-ink-900/70 px-3 py-1 text-xs text-white">
            {active + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
