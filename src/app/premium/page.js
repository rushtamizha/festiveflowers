import { getProducts } from '@/lib/api/catalog';
import Listing from '@/components/shop/Listing';

const title = 'Premium Wedding Garlands';
const description =
  'Our premium collection: orchid, lotus and designer wedding garlands, luxury car decoration and bridal pieces with hand-finished detailing.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/premium' },
  openGraph: { title, description, url: '/premium' },
};

export default async function PremiumPage() {
  return (
    <Listing
      path="/premium"
      breadcrumbs={[{ name: 'Premium', href: '/premium' }]}
      eyebrow="The premium collection"
      title={title}
      text={description}
      products={await getProducts({ tag: 'premium', sort: 'price-desc' })}
    />
  );
}
