import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductGrid from '@/components/product/ProductGrid';

export default function WeddingGarlands({ category, products }) {
  const path = `/category/${category.slug}`;

  return (
    <section className="defer-render after-paint wrap py-8 lg:py-12">
      <SectionHeading
        title="Wedding garlands"
        description="For the bride and groom: rose petal, jasmine, lotus and orchid"
        action={{ label: 'See All', href: path }}
      />

      <ul className="mt-4 flex flex-wrap gap-2">
        {category.subcategories.map((sub) => (
          <li key={sub.slug}>
            <Link href={`${path}/${sub.slug}`} className="chip">
              {sub.name}
            </Link>
          </li>
        ))}
      </ul>

      <ProductGrid products={products} className="mt-5" />
    </section>
  );
}
