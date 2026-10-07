import Image from 'next/image';
import Link from 'next/link';
import { site, img, whatsappLink } from '@/config/site';
import Reveal from '@/components/ui/Reveal';
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/Icons';

const shell = 'group lift relative flex h-full w-full items-center justify-between gap-4 overflow-hidden rounded-large p-6 text-left lg:p-8';

/** Offer tiles: custom orders on WhatsApp, and bulk / function enquiries. */
export default function CustomOrder() {
  return (
    <section className="defer-render after-paint wrap py-6 lg:py-10">
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
        <Reveal>
          <a
            href={whatsappLink(`Hello ${site.name}, I would like a custom garland.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${shell} bg-ink-900`}
          >
            <Image
              src={img('/images/services/wedding-garland-making.webp')}
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover opacity-30"
            />
            <span aria-hidden="true" className="dot-grid absolute inset-0 text-white opacity-[0.08]" />
            <span className="relative">
              <span className="text-[11px] font-bold tracking-[0.12em] text-brand-300 uppercase">Custom orders</span>
              <span className="mt-2 block text-xl leading-tight font-bold tracking-[-0.03em] text-white lg:text-2xl">
                Have a design in mind? We will make it.
              </span>
              <span className="mt-1 block text-[13px] text-white/75">Send a photo on WhatsApp and get a price before you order.</span>
            </span>
            <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-transform duration-500 ease-fluid group-hover:scale-110">
              <WhatsAppIcon size={22} />
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.06}>
          <Link href="/contact" className={`${shell} bg-brand-600`}>
            <Image
              src={img('/images/services/custom-and-bulk-orders.webp')}
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover opacity-20"
            />
            <span aria-hidden="true" className="dot-grid absolute inset-0 text-white opacity-10" />
            <span className="relative">
              <span className="text-[11px] font-bold tracking-[0.12em] text-white/85 uppercase">Whole function</span>
              <span className="mt-2 block text-xl leading-tight font-bold tracking-[-0.03em] text-white lg:text-2xl">
                Family sets and bulk flowers
              </span>
              <span className="mt-1 block text-[13px] text-white/85">Garland sets, string flowers and décor for the full event.</span>
            </span>
            <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand-700 transition-transform duration-500 ease-fluid group-hover:translate-x-1">
              <ArrowRightIcon size={20} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
