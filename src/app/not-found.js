import Link from 'next/link';
import { FlowerIcon } from '@/components/ui/Icons';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center sm:py-32">
      <span className="icon-badge size-16">
        <FlowerIcon size={30} />
      </span>
      <h1 className="mt-6 text-4xl font-bold text-ink sm:text-5xl">This page has wilted</h1>
      <p className="mt-4 max-w-md text-ink-500">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/shop" className="btn btn-outline">
          Browse the shop
        </Link>
      </div>
    </section>
  );
}
