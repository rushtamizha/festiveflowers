import { getImageProps } from 'next/image';
import { banners } from '@/data/content';
import HeroSwiper from './HeroSwiper';

const DESKTOP_SIZES = '(min-width: 1240px) 1176px, calc(100vw - 3rem)';
const MOBILE_SIZES = 'calc(100vw - 2rem)';

export default function Hero() {
  // Art direction: a wide banner for desktop, a taller one for phones.
  const slides = banners.map((banner) => {
    const desktop = getImageProps({ src: banner.desktop, alt: banner.alt, width: 1920, height: 720, sizes: DESKTOP_SIZES }).props;
    const mobile = getImageProps({ src: banner.mobile, alt: banner.alt, width: 1000, height: 640, sizes: MOBILE_SIZES }).props;
    return {
      id: banner.id,
      href: banner.href,
      alt: banner.alt,
      desktopSrcSet: desktop.srcSet,
      src: mobile.src,
      srcSet: mobile.srcSet,
    };
  });
  const first = slides[0];

  return (
    <section aria-label="Featured collections" className="wrap pt-4 lg:pt-6">
      {/* Preload only the banner this screen size will actually show (the LCP image). */}
      <link rel="preload" as="image" imageSrcSet={first.srcSet} imageSizes={MOBILE_SIZES} media="(max-width: 767.98px)" fetchPriority="high" />
      <link rel="preload" as="image" imageSrcSet={first.desktopSrcSet} imageSizes={DESKTOP_SIZES} media="(min-width: 768px)" fetchPriority="high" />
      <HeroSwiper slides={slides} desktopSizes={DESKTOP_SIZES} mobileSizes={MOBILE_SIZES} />
    </section>
  );
}
