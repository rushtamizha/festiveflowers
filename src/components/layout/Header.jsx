import Link from 'next/link';
import { categories, categoryImage } from '@/data/categories';
import { products } from '@/data/products';
import { priceRanges } from '@/data/content';
import { site, hasWhatsapp, whatsappLink } from '@/config/site';
import { ChevronDownIcon, ChevronRightIcon } from '@/components/ui/Icons';
import LogoMark from '@/components/ui/LogoMark';
import NavDropdown from './NavDropdown';
import HeaderShell from './HeaderShell';

const menu = categories.map(({ slug, name, subcategories }) => ({ slug, name, subcategories }));

// What the navbar sheet (search, filters, phone menu) needs to know about the catalogue.
const sheetCategories = categories.map(({ slug, name, subcategories }) => ({
  slug,
  name,
  subcategories,
  image: categoryImage(slug),
  count: products.filter((p) => p.categorySlug === slug).length,
}));
const sheetPrices = priceRanges.map(({ slug, label }) => ({ slug, label }));
const contact = {
  phone: site.phone,
  whatsapp: hasWhatsapp ? whatsappLink(`Hello ${site.name}, I would like to enquire about an order.`) : '',
};

const links = [
  { href: '/category/wedding-garland', label: 'Wedding Garlands', wide: true },
  { href: '/best-sellers', label: 'Best Sellers' },
  { href: '/premium', label: 'Premium' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

// On phones only the first part of the announcement is shown, so it stays on one line.
const [announcementLead, ...announcementTail] = site.announcement.split(' · ');
const announcementRest = announcementTail.join(' · ');

const navLink =
  'press flex h-10 items-center gap-1 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap text-ink-800 hover:bg-ink-50 hover:text-ink';
const menuLink =
  'flex min-h-9 items-center justify-between gap-3 rounded-small px-3 text-[13px] font-medium transition-colors duration-150 hover:bg-ink-50 hover:text-brand-700';

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name}. Home`} prefetch={false}>
      <LogoMark size={36} eager className="shadow-small ring-ink-900/10" />
      {/* While search is open on a phone, the wordmark steps aside so the field can reach the logo mark. */}
      <span className="text-[17px] leading-none font-bold tracking-[-0.03em] whitespace-nowrap text-ink max-sm:group-data-[searching=true]/header:hidden sm:text-xl">
        Wedding Garlands<span className="text-brand-600">.</span>
      </span>
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-0.5">
        <li>
          <Link href="/" className={navLink} prefetch={false}>
            Home
          </Link>
        </li>

        <NavDropdown
          trigger={
            <Link href="/shop" className={navLink} aria-haspopup="true">
              Shop
              <ChevronDownIcon size={16} className="transition-transform duration-300 ease-fluid group-hover/menu:rotate-180" />
            </Link>
          }
        >
          <ul className="w-72 rounded-large border border-ink-200 bg-white p-1.5 text-ink shadow-large">
            <li>
              <Link href="/shop" className={`${menuLink} font-bold text-brand-700`} prefetch={false}>
                All Category
              </Link>
            </li>
            {menu.map((category, index) => (
              <li key={category.slug} className="group/sub relative">
                <Link href={`/category/${category.slug}`} className={menuLink} aria-haspopup="true" prefetch={false}>
                  {category.name}
                  <ChevronRightIcon size={15} className="text-ink-500" />
                </Link>
                <div
                  className={`invisible absolute left-full z-50 translate-x-1 pl-2 opacity-0 transition-[opacity,transform,visibility] duration-300 ease-fluid group-focus-within/sub:visible group-focus-within/sub:translate-x-0 group-focus-within/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100 ${
                    index > 6 ? 'bottom-0' : 'top-0'
                  }`}
                >
                  <ul className="w-64 rounded-large border border-ink-200 bg-white p-1.5 text-ink shadow-large">
                    {category.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link href={`/category/${category.slug}/${sub.slug}`} className={menuLink} prefetch={false}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                    <li className="mt-1 border-t border-ink-200 pt-1">
                      <Link href={`/category/${category.slug}`} className={`${menuLink} font-bold text-brand-700`} prefetch={false}>
                        View all
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </NavDropdown>

        {links.map((link) => (
          <li key={link.href} className={link.wide ? 'hidden xl:block' : ''}>
            <Link href={link.href} className={navLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Header() {
  return (
    <>
      <div className="bg-brand-600 text-white">
        <p className="wrap py-2 text-center text-xs font-semibold sm:text-[13px]">
          {announcementLead}
          {announcementRest && <span className="hidden sm:inline"> · {announcementRest}</span>}
        </p>
      </div>

      <HeaderShell logo={<Logo />} nav={<DesktopNav />} categories={sheetCategories} priceRanges={sheetPrices} contact={contact} />
    </>
  );
}
