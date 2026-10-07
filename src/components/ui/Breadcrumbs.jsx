import Link from 'next/link';
import JsonLd from './JsonLd';
import Rupees from './Rupees';
import { ChevronRightIcon } from './Icons';
import { breadcrumbSchema } from '@/lib/schema';

// `items`: [{ name, href }] — the last item is the current page.
export default function Breadcrumbs({ items, light = false, className = '' }) {
  const trail = [{ name: 'Home', href: '/' }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={`flex flex-wrap items-center gap-1.5 text-xs ${light ? 'text-white/60' : 'text-ink-500'}`}>
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRightIcon size={12} className={light ? 'text-white/35' : 'text-ink-300'} />}
              {last ? (
                <span aria-current="page" className={`font-medium ${light ? 'text-white' : 'text-ink-800'}`}>
                  <Rupees>{item.name}</Rupees>
                </span>
              ) : (
                <Link href={item.href} className={`flex min-h-6 items-center ${light ? 'hover:text-white' : 'hover:text-ink'}`}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbSchema(trail)} />
    </nav>
  );
}
