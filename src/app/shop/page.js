import { Suspense } from 'react';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { searchIndex } from '@/data/search-index';
import { priceRanges } from '@/data/content';
import { collectionSchema } from '@/lib/schema';
import PageHeader from '@/components/ui/PageHeader';
import JsonLd from '@/components/ui/JsonLd';
import ShopBrowser from '@/components/shop/ShopBrowser';
import ShopView from '@/components/shop/ShopView';

const title = 'Shop All Wedding Garlands & Flowers';
const description =
  categories.length > 1
    ? 'Browse every design: wedding garlands, bridal flowers, bouquets, car decoration, string flowers, pooja garlands, floral jewellery and money garlands. Filter by category and price.'
    : `Browse every ${categories[0].name.toLowerCase()} design: ${categories[0].subcategories.map((s) => s.name.toLowerCase()).join(', ')}. Filter by price and sort to find yours.`;

export const metadata = {
  title: 'Shop All Garlands & Flowers',
  description,
  alternates: { canonical: '/shop' },
  openGraph: { title, description, url: '/shop' },
};

export default function ShopPage() {
  const cards = searchIndex;
  const menu = categories.map(({ slug, name }) => ({ slug, name }));
  const ranges = priceRanges.map(({ slug, label, min, max }) => ({ slug, label, min, max }));
  const counts = Object.fromEntries(menu.map((c) => [c.slug, cards.filter((p) => p.categorySlug === c.slug).length]));
  const shared = { categories: menu, priceRanges: ranges, counts };

  return (
    <>
      <PageHeader breadcrumbs={[{ name: 'Shop', href: '/shop' }]} eyebrow="All category" title={title} text={description} />
      {/* The fallback is the full, unfiltered catalogue: that is what gets prerendered into the HTML. */}
      <Suspense fallback={<ShopView products={cards} state={{}} {...shared} />}>
        <ShopBrowser products={cards} {...shared} />
      </Suspense>
      <JsonLd data={collectionSchema({ name: title, description, path: '/shop', products })} />
    </>
  );
}
