import PageHeader from '@/components/ui/PageHeader';
import WishlistView from '@/components/shop/WishlistView';

export const metadata = {
  title: 'Your Wishlist',
  description: 'The garlands and flowers you have saved.',
  alternates: { canonical: '/wishlist' },
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Wishlist', href: '/wishlist' }]}
        title="Your wishlist"
        text="Saved on this device, so you can come back to your favourites."
      />
      <section className="wrap py-10 sm:py-14">
        <WishlistView />
      </section>
    </>
  );
}
