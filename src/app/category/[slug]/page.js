import { notFound } from 'next/navigation';
import { getCategories, getCategory, getProducts } from '@/lib/api/catalog';
import Listing from '@/components/shop/Listing';
import { Price } from '@/components/ui/Rupees';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  const path = `/category/${category.slug}`;
  return {
    title: `${category.name} – Buy Fresh ${category.name} Online`,
    description: category.description,
    alternates: { canonical: path },
    openGraph: {
      title: category.name,
      description: category.description,
      url: path,
      images: [{ url: category.image, width: 640, height: 800, alt: category.name }],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const path = `/category/${category.slug}`;
  const items = await getProducts({ category: category.slug });
  const prices = items.map((p) => p.price);

  return (
    <Listing
      path={path}
      breadcrumbs={[
        { name: 'Shop', href: '/shop' },
        { name: category.name, href: path },
      ]}
      eyebrow={category.short}
      title={category.name}
      text={category.description}
      chips={[
        { href: path, label: 'All', active: true },
        ...category.subcategories.map((sub) => ({ href: `${path}/${sub.slug}`, label: sub.name })),
      ]}
      products={items}
    >
      <section className="wrap pb-16 sm:pb-24">
        <div className="card p-7 sm:p-12">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">About our {category.name.toLowerCase()} collection</h2>
          <div className="prose-copy mt-4 max-w-3xl leading-relaxed text-ink-500">
            <p>{category.intro}</p>
            {prices.length > 0 && (
              <p>
                The collection has {items.length} designs priced from <Price value={Math.min(...prices)} /> to{' '}
                <Price value={Math.max(...prices)} />, across {category.subcategories.map((s) => s.name).join(', ')}. Every
                piece is made to order with fresh flowers and can be customised in flowers, colour and length.
              </p>
            )}
          </div>
        </div>
      </section>
    </Listing>
  );
}
