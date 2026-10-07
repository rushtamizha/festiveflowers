import { getProducts } from '@/lib/api/catalog';
import Listing from '@/components/shop/Listing';

const title = 'Best Selling Garlands & Flowers';
const description =
  'The wedding garlands, bridal flowers, bouquets and pooja garlands our customers order most.';

export const metadata = {
  title: 'Best Sellers',
  description,
  alternates: { canonical: '/best-sellers' },
  openGraph: { title, description, url: '/best-sellers' },
};

export default async function BestSellersPage() {
  return (
    <Listing
      path="/best-sellers"
      breadcrumbs={[{ name: 'Best sellers', href: '/best-sellers' }]}
      eyebrow="Loved by couples"
      title={title}
      text={description}
      products={await getProducts({ tag: 'bestseller' })}
    />
  );
}
