import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import Carousel from '@/components/ui/Carousel';

/**
 * Image-led tiles, swipeable on every breakpoint: the categories, or a single category's styles
 * while only one category is live (see src/app/page.js).
 * @param {{ title: string, tiles: { href: string, name: string, image: string, count: number }[] }} props
 */
export default function CategoryCarousel({ title, tiles }) {
  return (
    <section className="defer-render after-paint-phone wrap py-6 lg:py-10">
      <SectionHeading title={title} action={{ label: 'See All', href: '/shop' }} />
      <Carousel label={title} className="mt-4" slideClassName="w-[116px] sm:w-[132px] lg:w-[150px]" gap="px-1.5" bleed="-mx-1.5">
        {tiles.map((tile) => {
          return (
            <Link key={tile.href} href={tile.href} className="press group block text-center">
              <div className="relative aspect-square overflow-hidden rounded-large border-2 border-white bg-ink-50 shadow-small ring-1 ring-ink-200 transition-[box-shadow] duration-300 group-hover:shadow-medium group-hover:ring-brand-200">
                <Image
                  src={tile.image}
                  alt={`${tile.name} collection`}
                  fill
                  sizes="150px"
                  className="object-cover transition-transform duration-700 ease-fluid group-hover:scale-110"
                />
              </div>
              <h3 className="mt-2 line-clamp-2 text-xs leading-tight font-semibold tracking-normal text-ink-800 group-hover:text-brand-700 sm:text-[13px]">
                {tile.name}
              </h3>
              <p className="text-[11px] text-ink-500">
                {tile.count} {tile.count === 1 ? 'design' : 'designs'}
              </p>
            </Link>
          );
        })}
      </Carousel>
    </section>
  );
}
