import PageHeader from '@/components/ui/PageHeader';
import AccountView from '@/components/account/AccountView';

export const metadata = {
  title: 'Your Account',
  description: 'Your saved profile, orders and wishlist.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ name: 'Account', href: '/account' }]} title="Your account" />
      <section className="wrap py-10 sm:py-14">
        <AccountView />
      </section>
    </>
  );
}
