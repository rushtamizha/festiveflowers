import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Rupees from '@/components/ui/Rupees';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { ArrowRightIcon } from '@/components/ui/Icons';

// Desktop columns follow the number of ranges, since empty ranges are left out (src/data/content.js).
const desktopColumns = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' };

export default function ShopByPrice({ ranges }) {
  return (
    <section className="defer-render after-paint border-y border-ink-200 bg-ink-50">
      <div className="wrap py-8 lg:py-12">
      <SectionHeading title="Shop by price" description="Pick a budget to see everything that fits it" />
      <ul className={`mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 ${desktopColumns[ranges.length] ?? 'lg:grid-cols-5'}`}>
        {ranges.map((range, index) => {
          return (
            <Reveal as="li" key={range.slug} delay={index * 0.05} className="last:col-span-2 md:last:col-span-1">
              <Link href={`/price/${range.slug}`} className="group block h-full">
                <SpotlightCard className="card lift flex h-full flex-col p-4" spotlightColor="rgba(216, 27, 102, 0.12)">
                  <span className="text-[11px] font-bold tracking-[0.08em] text-ink-500 uppercase">{range.productCount} designs</span>
                  <strong className="mt-2 text-lg leading-tight font-bold tracking-[-0.03em] text-ink sm:text-xl">
                    <Rupees>{range.label}</Rupees>
                  </strong>
                  <span className="mt-1 text-[13px] leading-snug text-ink-500">{range.note}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-brand-700">
                    Shop now
                    <ArrowRightIcon size={15} className="transition-transform duration-500 ease-fluid group-hover:translate-x-1" />
                  </span>
                </SpotlightCard>
              </Link>
            </Reveal>
          );
        })}
      </ul>
      </div>
    </section>
  );
}
