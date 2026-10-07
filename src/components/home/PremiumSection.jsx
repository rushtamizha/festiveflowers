import Link from 'next/link';
import ShinyText from '@/components/reactbits/ShinyText';
import BlurText from '@/components/reactbits/BlurText';
import CircularText from '@/components/reactbits/CircularText';
import StarBorder from '@/components/reactbits/StarBorder';
import Carousel from '@/components/ui/Carousel';
import ProductCard from '@/components/product/ProductCard';
import { ArrowRightIcon, FlowerIcon } from '@/components/ui/Icons';

// The premium range sits on a solid block of the brand colour, with white cards floating on it.
export default function PremiumSection({ products }) {

  return (
    <section className="defer-render after-paint wrap py-8 lg:py-12">
      <div className="surface-brand relative overflow-hidden rounded-large px-4 py-7 sm:px-7 lg:px-10 lg:py-10">

        <div className="relative flex items-start justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase">
              <ShinyText text="The premium collection" color="#ffd0e0" shineColor="#ffffff" speed={4} />
            </p>
            <BlurText as="h2" text="Statement garlands for unforgettable weddings" delay={45} className="mt-2 text-[22px] leading-tight text-white sm:text-[28px] lg:text-[34px]" />
            <p className="mt-2 text-[13px] text-white/85 sm:text-sm">
              Orchid, lotus and designer pieces with hand-finished detailing.
            </p>
          </div>
          <div className="relative hidden shrink-0 lg:block">
            <CircularText text="PREMIUM • HANDCRAFTED • FRESH • " spinDuration={24} className="size-28 text-[11px] font-bold text-white" />
            <FlowerIcon size={28} className="absolute inset-0 m-auto text-white" />
          </div>
        </div>

        <Carousel label="Premium products" className="relative mt-5 [&_button]:border-white/30 [&_button]:bg-white">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} className="border-transparent" />
          ))}
        </Carousel>

        <div className="relative mt-6 lg:-mt-10 lg:text-right">
          <StarBorder as={Link} href="/premium" color="#ffffff" speed="5s" innerClassName="border-white bg-white text-sm font-semibold text-ink-900">
            Explore premium
            <ArrowRightIcon size={16} />
          </StarBorder>
        </div>
      </div>
    </section>
  );
}
