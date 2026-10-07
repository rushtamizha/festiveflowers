// /llms.txt — a plain-language map of the site for AI assistants and answer engines.

import { site, absoluteUrl } from '@/config/site';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { faqs, services } from '@/data/content';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-static';

export function GET() {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Key facts',
    `- Every item is handcrafted to order with fresh flowers bought on the day of delivery.`,
    `- Recommended order lead time for wedding garlands: ${site.leadTime}.`,
    `- Prices are in Indian Rupees (INR). Listed prices are per single item unless the name says pair or set.`,
    `- Flowers, colours, thickness and length can be customised on request.`,
    `- Catalogue: ${products.length} designs across ${categories.length} ${categories.length === 1 ? 'collection' : 'collections'}.`,
    '',
    '## Collections',
    ...categories.map((c) => `- [${c.name}](${absoluteUrl(`/category/${c.slug}`)}): ${c.description}`),
    '',
    '## Products',
    ...categories.flatMap((c) => [
      `### ${c.name}`,
      ...products
        .filter((p) => p.categorySlug === c.slug)
        .map((p) => `- [${p.name}](${absoluteUrl(`/product/${p.slug}`)}): ${formatPrice(p.price)}. ${p.blurb}`),
      '',
    ]),
    '## Services',
    ...services.map((s) => `- ${s.title}: ${s.text}`),
    '',
    '## Frequently asked questions',
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, '']),
    '## More',
    `- [Shop all](${absoluteUrl('/shop')})`,
    `- [Best sellers](${absoluteUrl('/best-sellers')})`,
    `- [Premium collection](${absoluteUrl('/premium')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
