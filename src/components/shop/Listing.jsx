import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import JsonLd from '@/components/ui/JsonLd';
import Rupees from '@/components/ui/Rupees';
import ProductGrid from '@/components/product/ProductGrid';
import { collectionSchema } from '@/lib/schema';

// Shared layout for category, price, premium and best-seller pages.
// `chips`: [{ href, label, active }] shown under the title as quick filters.
export default function Listing({ path, breadcrumbs, eyebrow, title, text, chips, products, children }) {
  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} eyebrow={eyebrow} title={title} text={text}>
        {chips?.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip.href}>
                <Link
                  href={chip.href}
                  aria-current={chip.active ? 'page' : undefined}
                  className={`press inline-flex h-10 items-center rounded-full border px-4 text-[13px] font-semibold whitespace-nowrap ${
                    chip.active ? 'border-brand-600 bg-brand-600 text-white' : 'border-white/20 text-white/85 hover:border-white/45 hover:text-white'
                  }`}
                >
                  <Rupees>{chip.label}</Rupees>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageHeader>

      <section className="wrap py-7 lg:py-10" aria-label={`${title} products`}>
        <p className="mb-4 text-[13px] text-ink-500">
          <strong className="font-bold text-ink">{products.length}</strong> {products.length === 1 ? 'design' : 'designs'}
        </p>
        {products.length > 0 ? (
          <ProductGrid products={products} eager={4} heading="h2" />
        ) : (
          <div className="card p-10 text-center">
            <p className="text-ink-500">Nothing here yet. New designs are added regularly.</p>
            <Link href="/shop" className="btn btn-primary mt-5">
              Browse all products
            </Link>
          </div>
        )}
      </section>

      {children}

      <JsonLd data={collectionSchema({ name: title, description: text, path, products })} />
    </>
  );
}
