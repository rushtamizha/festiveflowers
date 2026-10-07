import { notFound } from 'next/navigation';
import { getPriceRanges, getProducts } from '@/lib/api/catalog';
import Listing from '@/components/shop/Listing';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPriceRanges()).map((r) => ({ range: r.slug }));
}

const describe = (range) =>
  `Wedding garlands, bridal flowers and bouquets priced ${range.label.replace('&', 'and').toLowerCase()}. ${range.note}, made fresh to order.`;

export async function generateMetadata({ params }) {
  const { range: slug } = await params;
  const range = (await getPriceRanges()).find((r) => r.slug === slug);
  if (!range) return {};
  const path = `/price/${range.slug}`;
  return {
    title: `Garlands & Flowers ${range.label}`,
    description: describe(range),
    alternates: { canonical: path },
    openGraph: { title: `Garlands & Flowers ${range.label}`, description: describe(range), url: path },
  };
}

export default async function PricePage({ params }) {
  const { range: slug } = await params;
  const priceRanges = await getPriceRanges();
  const range = priceRanges.find((r) => r.slug === slug);
  if (!range) notFound();

  const path = `/price/${range.slug}`;
  const items = await getProducts({ price: range.slug, sort: 'price-asc' });

  return (
    <Listing
      path={path}
      breadcrumbs={[
        { name: 'Shop', href: '/shop' },
        { name: range.label, href: path },
      ]}
      eyebrow="Shop by price"
      title={`Garlands & Flowers ${range.label}`}
      text={describe(range)}
      chips={priceRanges.map((r) => ({ href: `/price/${r.slug}`, label: r.label, active: r.slug === range.slug }))}
      products={items}
    />
  );
}
