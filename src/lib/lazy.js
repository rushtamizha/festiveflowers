// Everything decorative (animations, sliders, smooth scrolling) is loaded only after the page
// has painted and the browser is idle. The page is fully readable and usable before that:
// content is server-rendered, and these libraries enhance it once they arrive.

let idle;

/** Resolves once the page has loaded, painted a frame and gone idle. */
export function afterFirstPaint() {
  if (!idle) {
    idle = new Promise((resolve) => {
      const whenIdle = () =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 2000 });
            else setTimeout(resolve, 200);
          }),
        );
      if (document.readyState === 'complete') whenIdle();
      else window.addEventListener('load', whenIdle, { once: true });
    });
  }
  return idle;
}

let motion;
let motionKit = null;
export function loadMotion() {
  return (motion ??= afterFirstPaint()
    .then(() => import('./motion-kit'))
    .then((kit) => (motionKit = kit)));
}

/** The Motion kit if it has already loaded, otherwise null (never triggers a load). */
export const getMotion = () => motionKit;

let swiper;
export function loadSwiper() {
  return (swiper ??= afterFirstPaint().then(() => import('./swiper-kit')));
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The site's signature easing (see lib/motion.js).
export const FLUID = [0.22, 1, 0.36, 1];

/**
 * Scroll-reveal helper. Elements that are already on screen when this runs are left alone
 * (no flash); elements further down are hidden by `arm()` and revealed by `enter()` when
 * they scroll into view. Returns a cleanup function.
 */
export function whenScrolledIntoView(el, { arm, enter, rootMargin = '0px 0px -60px 0px' }) {
  let first = true;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (first) {
        first = false;
        // Already on screen, or already scrolled past: leave it visible.
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) observer.disconnect();
        else arm?.();
        return;
      }
      if (entry.isIntersecting) {
        observer.disconnect();
        enter();
      }
    },
    { rootMargin },
  );
  observer.observe(el);
  return () => observer.disconnect();
}
