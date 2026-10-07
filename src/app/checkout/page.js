import PageHeader from '@/components/ui/PageHeader';
import CheckoutForm from '@/components/shop/CheckoutForm';

export const metadata = {
  title: 'Checkout',
  description: 'Enter your function date and delivery details to place your order.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: 'Cart', href: '/cart' },
          { name: 'Checkout', href: '/checkout' },
        ]}
        title="Checkout"
      />
      <section className="wrap py-10 sm:py-14">
        <CheckoutForm />
      </section>
    </>
  );
}
