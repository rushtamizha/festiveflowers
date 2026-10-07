'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSwiper } from '@/lib/useSwiper';
import { loadMotion, prefersReducedMotion } from '@/lib/lazy';

// Image-only banner slider. The slides are plain server-rendered HTML and the first banner has
// high fetch priority, so it paints before any JavaScript runs. Swiper is attached afterwards.
// With a single banner there is nothing to slide, so it renders as a plain banner (no Swiper).
export default function HeroSwiper({ slides, desktopSizes, mobileSizes }) {
  const sizes = { desktopSizes, mobileSizes };
  return slides.length > 1 ? <Slider slides={slides} {...sizes} /> : <Single slide={slides[0]} {...sizes} />;
}

function Slider({ slides, desktopSizes, mobileSizes }) {
  const ref = useSwiper(({ A11y, Autoplay, Keyboard, Pagination }) => ({
    modules: [A11y, Autoplay, Keyboard, Pagination],
    rewind: true,
    speed: 900,
    spaceBetween: 16,
    autoplay: { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    keyboard: { enabled: true, onlyInViewport: true },
    a11y: { containerMessage: 'Featured collections' },
  }));
  useSettleOnScroll(ref);

  return (
    <div ref={ref} className="swiper swiper-single hero-swiper origin-top">
      <div className="swiper-wrapper">
        {slides.map((slide, index) => (
          <div className="swiper-slide" key={slide.id}>
            <Banner slide={slide} first={index === 0} desktopSizes={desktopSizes} mobileSizes={mobileSizes} />
          </div>
        ))}
      </div>
      <div className="swiper-pagination" />
    </div>
  );
}

function Single({ slide, desktopSizes, mobileSizes }) {
  const ref = useRef(null);
  useSettleOnScroll(ref);

  return (
    <div ref={ref} className="origin-top pb-2 lg:pb-4">
      <Banner slide={slide} first desktopSizes={desktopSizes} mobileSizes={mobileSizes} />
    </div>
  );
}

function Banner({ slide, first, desktopSizes, mobileSizes }) {
  return (
    <Link href={slide.href} className="block overflow-hidden rounded-large" draggable={false} prefetch={false}>
      <picture>
        <source media="(min-width: 768px)" srcSet={slide.desktopSrcSet} sizes={desktopSizes} />
        {/* A plain <img>: src and srcSet come from next/image's getImageProps (see Hero.jsx). */}
        <img
          src={slide.src}
          srcSet={slide.srcSet}
          sizes={mobileSizes}
          width={1000}
          height={640}
          alt={slide.alt}
          loading={first ? 'eager' : 'lazy'}
          fetchPriority={first ? 'high' : 'low'}
          decoding={first ? 'sync' : 'async'}
          draggable={false}
          className="  w-full bg-ink-50 object-cover "
        />
      </picture>
    </Link>
  );
}

// Apple-style: the banner eases back and settles as the page scrolls past it.
function useSettleOnScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let active = true;
    let stop;
    loadMotion().then(({ animate, scroll }) => {
      if (!active) return;
      stop = scroll(animate(el, { scale: [1, 0.94], opacity: [1, 0.55] }, { ease: 'linear' }), {
        target: el,
        offset: ['start 120px', 'end start'],
      });
    });
    return () => {
      active = false;
      stop?.();
    };
  }, [ref]);
}
