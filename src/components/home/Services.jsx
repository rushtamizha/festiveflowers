import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/data/content';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import GlareHover from '@/components/reactbits/GlareHover';
import { ArrowRightIcon } from '@/components/ui/Icons';

export default function Services({ heading = true }) {
  // On the services page the cards follow the page's h1 directly, so their titles are h2.
  const Title = heading ? 'h3' : 'h2';
  return (
    <section id="services" className={`wrap py-8 lg:py-12 ${heading ? 'defer-render after-paint' : ''}`}>
      {heading && (
        <SectionHeading
          title="Our services"
          description="Every floral detail of your celebration, taken care of"
          action={{ label: 'See All', href: '/services' }}
        />
      )}
      <ul className={`grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4 ${heading ? 'mt-5' : ''}`}>
        {services.map((service, index) => (
          <Reveal as="li" key={service.id} delay={(index % 3) * 0.06}>
            <Link href={service.href} className="group card lift flex h-full flex-col overflow-hidden">
              <GlareHover>
                <div className="relative aspect-[4/3] bg-ink-50">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(min-width: 1240px) 390px, (min-width: 1024px) 31vw, 46vw"
                    className="object-cover transition-transform duration-700 ease-fluid group-hover:scale-105"
                  />
                </div>
              </GlareHover>
              <div className="flex flex-1 items-start justify-between gap-3 p-3 sm:p-4">
                <div>
                  <Title className="text-sm leading-snug sm:text-base">{service.title}</Title>
                  <p className="mt-1 hidden text-[13px] leading-relaxed text-ink-500 sm:block">{service.text}</p>
                </div>
                <span className="hidden size-9 shrink-0 place-items-center rounded-full bg-ink-50 text-ink ring-1 ring-ink-200 transition-[background-color,color,transform] duration-500 ease-fluid group-hover:translate-x-1 group-hover:bg-brand-600 group-hover:text-white sm:grid">
                  <ArrowRightIcon size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
