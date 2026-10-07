import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProductSlugs, getRelatedProducts } from '@/lib/api/catalog';
import { toCard } from '@/data/products';
import { site, whatsappLink } from '@/config/site';
import { formatPrice, discountPercent } from '@/lib/format';
import { faqSchema, productSchema } from '@/lib/schema';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import JsonLd from '@/components/ui/JsonLd';
import Rating from '@/components/ui/Rating';
import { Badge, DiscountBadge } from '@/components/ui/Badge';
import FaqList from '@/components/ui/FaqList';
import ProductGallery from '@/components/product/ProductGallery';
import BuyBox from '@/components/product/BuyBox';
import ProductTabs from '@/components/product/ProductTabs';
import ProductRail from '@/components/home/ProductRail';
import { ClockIcon, LeafIcon, PaletteIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Rupees';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const path = `/product/${product.slug}`;
  const description = `${product.blurb} ${formatPrice(product.price)}. Made fresh to order with ${product.flowers.join(', ').toLowerCase()}.`;
  return {
    title: `${product.name} – ${formatPrice(product.price)}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: product.name,
      description,
      url: path,
      images: product.images.map((url) => ({ url, width: 800, height: 1000, alt: product.name })),
    },
  };
}

function productFaqs(product) {
  const off = discountPercent(product.price, product.mrp);
  const { deliveryFee, freeDeliveryAbove } = site.order;
  const deliveryLine = freeDeliveryAbove
    ? `Delivery is ${formatPrice(deliveryFee)}, and free on orders above ${formatPrice(freeDeliveryAbove)}.`
    : `Delivery is ${formatPrice(deliveryFee)}.`;
  return [
    {
      q: `How much does the ${product.name} cost?`,
      a: `The ${product.name} costs ${formatPrice(product.price)}${off ? `, down from ${formatPrice(product.mrp)} (${off}% off)` : ''}. ${deliveryLine}`,
    },
    {
      q: `Which flowers are used in the ${product.name}?`,
      a: `It is made with ${product.flowers.join(', ').toLowerCase()}. The flowers are bought fresh on the morning of delivery.`,
    },
    {
      q: 'How early should I order?',
      a: `Please order ${site.leadTime} before your function so the right flowers can be sourced. For urgent orders, message us and we will tell you what is possible.`,
    },
    {
      q: 'Can this design be customised?',
      a: 'Yes. The flowers, colours, thickness and length can be changed to match your outfit and budget. Send us a reference photo and we will confirm the price before you order.',
    },
  ];
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const card = toCard(product);
  const off = discountPercent(product.price, product.mrp);
  const faqs = productFaqs(product);
  const related = await getRelatedProducts(product.slug);
  const categoryPath = `/category/${product.categorySlug}`;

  return (
    <>
      <div className="wrap pt-5 lg:pt-7">
        <Breadcrumbs
          items={[
            { name: product.categoryName, href: categoryPath },
            { name: product.subcategoryName, href: `${categoryPath}/${product.subcategorySlug}` },
            { name: product.name, href: `/product/${product.slug}` },
          ]}
        />
      </div>

      <article className="wrap grid gap-7 pt-5 pb-10 lg:grid-cols-[1.08fr_1fr] lg:gap-12 lg:pb-14">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <Link href={categoryPath}>
              <Badge tone="neutral" className="hover:bg-ink-100">
                {product.categoryName}
              </Badge>
            </Link>
            {product.premium && <Badge tone="dark">Premium</Badge>}
            {product.bestSeller && <Badge tone="brand">Best seller</Badge>}
            <DiscountBadge percent={off} className="border border-ink-200 shadow-none" />
          </div>

          <h1 className="mt-3 text-[26px] leading-tight sm:text-[32px] lg:text-[36px]">{product.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {product.reviews > 0 && <Rating value={product.rating} count={product.reviews} size={15} />}
            <span className="text-[13px] text-ink-500">SKU {product.sku}</span>
          </div>

          <p className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-[30px] leading-none font-bold tracking-[-0.03em] text-ink">
              <Price value={product.price} />
            </span>
            {off > 0 && (
              <s className="text-base text-ink-500">
                <span className="sr-only">Original price </span>
                <Price value={product.mrp} />
              </s>
            )}
          </p>

          <p className="mt-4 text-[15px] leading-relaxed text-ink-500">{product.blurb}</p>

          <BuyBox product={card} />

          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: LeafIcon, title: 'Fresh flowers', text: 'Made on the day of delivery' },
              { icon: ClockIcon, title: `Order ${site.leadTime} ahead`, text: 'So we can source the right flowers' },
              { icon: PaletteIcon, title: 'Customisable', text: 'Flowers, colour and length' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="card flex items-start gap-3 p-3">
                <span className="icon-badge size-9">
                  <Icon size={18} />
                </span>
                <span className="text-xs leading-snug">
                  <strong className="block text-[13px] font-bold text-ink">{title}</strong>
                  <span className="text-ink-500">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href={whatsappLink(`Hello ${site.name}, I am interested in the ${product.name} (${product.sku}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            <WhatsAppIcon size={19} />
            Ask about this design on WhatsApp
          </a>
        </div>
      </article>

      <div className="border-t border-ink-200">
        <ProductTabs
          description={product.description[0]}
          craft={product.description[1]}
          care={product.description[2]}
          flowers={product.flowers}
          specs={{ Category: `${product.categoryName} › ${product.subcategoryName}`, SKU: product.sku, ...product.specs }}
          leadTime={site.leadTime}
        />
      </div>

      <section className="wrap border-t border-ink-200 py-9 lg:py-12">
        <h2 className="text-[20px] sm:text-[24px]">Questions about this design</h2>
        <FaqList faqs={faqs} className="mt-4" />
      </section>

      {related.length > 0 && (
        <div className="border-t border-ink-200">
          <ProductRail
            title="Related products"
            href={categoryPath}
            linkLabel={`All ${product.categoryName}`}
            products={related}
          />
        </div>
      )}

      <JsonLd data={[productSchema(product), faqSchema(faqs)]} />
    </>
  );
}
