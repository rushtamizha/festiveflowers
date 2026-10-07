'use client';

// A Client Component on purpose: the server still renders the full card HTML, but only the small
// `product` object (not the whole element tree) is repeated in the page's hydration payload.

import Image from 'next/image';
import Link from 'next/link';
import { discountPercent } from '@/lib/format';
import { Price } from '@/components/ui/Rupees';
import { Badge, DiscountBadge } from '@/components/ui/Badge';
import { StarIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/cn';
import WishlistButton from './WishlistButton';
import AddToCartButton from './AddToCartButton';

const defaultSizes = '(min-width: 1280px) 280px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw';

// `product` is the compact shape from toCard() in src/data/products.js.
// `heading`: the heading level of the product name, so cards fit the page outline (h2 on
// listing pages where they follow the h1, h3 inside a titled section).
export default function ProductCard({ product, eager = false, sizes = defaultSizes, className, heading: Heading = 'h3' }) {
  const off = discountPercent(product.price, product.mrp);

  return (
    <article className={cn('group card lift relative flex h-full flex-col overflow-hidden', className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          className="object-cover transition-transform duration-700 ease-fluid group-hover:scale-[1.05]"
        />

        <DiscountBadge percent={off} className="absolute top-2.5 left-2.5" />
        <WishlistButton product={product} className="absolute top-2 right-2 z-10" />

        {(product.premium || product.bestSeller) && (
          <Badge tone={product.premium ? 'dark' : 'brand'} className="absolute bottom-2.5 left-2.5">
            {product.premium ? 'Premium' : 'Best seller'}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-2">
          <Heading className="line-clamp-2 text-[13px] leading-snug font-bold tracking-normal text-ink sm:text-sm">
            {/* The stretched link makes the whole card tappable */}
            <Link href={`/product/${product.slug}`} className="before:absolute before:inset-0">
              {product.name}
            </Link>
          </Heading>
          {product.reviews > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ink">
              <StarIcon size={13} className="text-star" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-xs text-ink-500">{product.categoryName}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="min-w-0 leading-tight">
            <p className="text-[15px] font-bold text-ink">
              <Price value={product.price} />
            </p>
            {off > 0 && (
              <s className="text-[11px] text-ink-500">
                <span className="sr-only">Original price </span>
                <Price value={product.mrp} />
              </s>
            )}
          </div>
          <AddToCartButton product={product} icon className="z-10" />
        </div>
      </div>
    </article>
  );
}
