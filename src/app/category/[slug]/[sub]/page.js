import { notFound } from 'next/navigation';
import { getCategories, getCategory, getProducts, getSubcategory } from '@/lib/api/catalog';
import Listing from '@/components/shop/Listing';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategories()).flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })));
}

export async function generateMetadata({ params }) {
  const { slug, sub } = await params;
  const [category, subcategory] = await Promise.all([getCategory(slug), getSubcategory(slug, sub)]);
  if (!category || !subcategory) return {};
  const path = `/category/${category.slug}/${subcategory.slug}`;
  const description = `Shop ${subcategory.name.toLowerCase()} from our ${category.name.toLowerCase()} collection. Made fresh to order and delivered to your venue.`;
  return {
    title: `${subcategory.name} – ${category.name}`,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${subcategory.name} – ${category.name}`, description, url: path },
  };
}

export default async function SubcategoryPage({ params }) {
  const { slug, sub } = await params;
  const [category, subcategory] = await Promise.all([getCategory(slug), getSubcategory(slug, sub)]);
  if (!category || !subcategory) notFound();

  const base = `/category/${category.slug}`;
  const path = `${base}/${subcategory.slug}`;

  return (
    <Listing
      path={path}
      breadcrumbs={[
        { name: 'Shop', href: '/shop' },
        { name: category.name, href: base },
        { name: subcategory.name, href: path },
      ]}
      eyebrow={category.name}
      title={subcategory.name}
      text={`${subcategory.name} from our ${category.name.toLowerCase()} collection, made fresh to order and delivered to your venue.`}
      chips={[
        { href: base, label: 'All' },
        ...category.subcategories.map((s) => ({ href: `${base}/${s.slug}`, label: s.name, active: s.slug === subcategory.slug })),
      ]}
      products={await getProducts({ category: category.slug, subcategory: subcategory.slug })}
    />
  );
}
