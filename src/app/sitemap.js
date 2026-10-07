import { site, absoluteUrl } from '@/config/site';
import { categories, categoryImage } from '@/data/categories';
import { products } from '@/data/products';
import { priceRanges } from '@/data/content';

export default function sitemap() {
  const now = new Date();
  const page = (path, priority, changeFrequency = 'weekly', extra = {}) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
    ...extra,
  });

  return [
    { url: site.url, lastModified: now, changeFrequency: 'daily', priority: 1 },
    page('/shop', 0.9, 'daily'),
    page('/best-sellers', 0.8),
    page('/premium', 0.8),
    page('/services', 0.7, 'monthly'),
    page('/about', 0.5, 'monthly'),
    page('/faq', 0.6, 'monthly'),
    page('/contact', 0.6, 'monthly'),
    ...categories.flatMap((c) => [
      page(`/category/${c.slug}`, 0.9, 'weekly', { images: [absoluteUrl(categoryImage(c.slug))] }),
      ...c.subcategories.map((s) => page(`/category/${c.slug}/${s.slug}`, 0.7)),
    ]),
    ...priceRanges.map((r) => page(`/price/${r.slug}`, 0.6)),
    ...products.map((p) => page(`/product/${p.slug}`, 0.8, 'weekly', { images: p.images.map((src) => absoluteUrl(src)) })),
  ];
}
