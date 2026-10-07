import Image from 'next/image';
import Link from 'next/link';
import { site, img } from '@/config/site';
import PageHeader from '@/components/ui/PageHeader';
import HowItWorks from '@/components/home/HowItWorks';
import { getCatalogueSummary } from '@/lib/api/catalog';

const description = `${site.name} makes fresh flower wedding garlands, bridal flowers and ceremony flowers by hand, to order.`;

export const metadata = {
  title: 'About Us',
  description,
  alternates: { canonical: '/about' },
  openGraph: { title: `About ${site.name}`, description, url: '/about' },
};

// PLACEHOLDER COPY: replace with your own story.
export default async function AboutPage() {
  const summary = await getCatalogueSummary();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'About', href: '/about' }]}
        eyebrow="Our craft"
        title="Flowers made by hand, for the day that matters"
        text={description}
      />
      <section className="wrap grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-large bg-brand-100 lg:order-last">
          <Image
            src={img('/images/services/wedding-garland-making.webp')}
            alt="A pair of handcrafted wedding garlands"
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            loading="eager"
            className="object-cover"
          />
        </div>
        <div className="prose-copy text-base leading-relaxed text-ink-500 sm:text-lg">
          <h2 className="mb-4 text-2xl font-bold text-ink sm:text-4xl">A garland is made once, for one moment</h2>
          <p>
            A wedding garland is worn for a few hours and remembered for a lifetime. That is why we make every piece to
            order: the flowers are chosen on the morning of your function, strung by hand, and delivered while they are
            at their freshest.
          </p>
          {summary.categoryCount > 1 ? (
            <p>
              We work across {summary.categoryCount} collections, from bride and groom garlands to bridal hair flowers,
              bouquets, car decoration, pooja garlands and floral jewellery, so the flowers for your whole celebration
              can come from one place and match each other.
            </p>
          ) : (
            <p>
              We focus on one thing and do it well: wedding garlands for the bride and groom, in rose petal, jasmine,
              lotus and orchid designs, made as a matched pair for your muhurtham and reception.
            </p>
          )}
          <p>
            Nothing is pre-made. Tell us your colours, your outfits and your budget, and we will shape the design around
            them.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">
              Browse the collections
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
      <HowItWorks summary={summary} />
    </>
  );
}
