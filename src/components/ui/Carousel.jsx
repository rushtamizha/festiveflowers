'use client';

import { Children, useRef, useState } from 'react';
import { useSwiper } from '@/lib/useSwiper';
import { cn } from '@/lib/cn';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

// One Swiper carousel for every horizontal section (products, categories). Slides are
// server-rendered and sized with CSS (`slideClassName`) rather than Swiper's JS breakpoints,
// so the layout is identical before and after Swiper attaches (no layout shift).
// Swiper itself is loaded when the carousel nears the viewport.
export default function Carousel({
  children,
  label,
  slideClassName = 'w-[46%] sm:w-[31%] lg:w-[23.4%] xl:w-[19%]',
  gap = 'px-1.5 lg:px-2',
  bleed = '-mx-1.5 lg:-mx-2',
  className,
}) {
  const swiper = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const sync = (instance) => setEdges({ start: instance.isBeginning, end: instance.isEnd });

  const ref = useSwiper(
    ({ A11y, Keyboard }) => ({
      modules: [A11y, Keyboard],
      slidesPerView: 'auto',
      spaceBetween: 0,
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: { containerMessage: label },
      on: { slideChange: sync, reachEnd: sync, fromEdge: sync, resize: sync },
    }),
    {
      nearViewport: true,
      onReady: (instance) => {
        swiper.current = instance;
        sync(instance);
      },
    },
  );

  const arrow =
    'press grid size-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50 disabled:pointer-events-none disabled:opacity-35';

  return (
    <div className={cn('relative', className)}>
      <div ref={ref} className={cn('swiper py-1', bleed)}>
        <div className="swiper-wrapper">
          {Children.map(children, (child) => (
            <div className={cn('swiper-slide h-auto', gap, slideClassName)}>{child}</div>
          ))}
        </div>
      </div>

      <div className="mt-4 hidden gap-2 lg:flex">
        <button type="button" aria-label="Previous" disabled={edges.start} className={arrow} onClick={() => swiper.current?.slidePrev()}>
          <ChevronLeftIcon size={17} />
        </button>
        <button type="button" aria-label="Next" disabled={edges.end} className={arrow} onClick={() => swiper.current?.slideNext()}>
          <ChevronRightIcon size={17} />
        </button>
      </div>
    </div>
  );
}
