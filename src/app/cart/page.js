import PageHeader from '@/components/ui/PageHeader';
import CartView from '@/components/shop/CartView';

export const metadata = {
  title: 'Your Cart',
  description: 'Review the garlands and flowers in your cart.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ name: 'Cart', href: '/cart' }]} title="Your cart" />
      <section className="wrap py-10 sm:py-14">
        <CartView />
      </section>
    </>
  );
}
