import Link from 'next/link';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { site, hasAddress, hasWhatsapp, whatsappLink } from '@/config/site';
import { ArrowRightIcon, ClockIcon, LeafIcon, MailIcon, PaletteIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/Icons';
import LogoMark from '@/components/ui/LogoMark';
import BackToTop from './BackToTop';

const columns = [
  {
    title: 'Shop',
    links: [
      { href: '/shop', label: 'All products' },
      { href: '/best-sellers', label: 'Best sellers' },
      { href: '/premium', label: 'Premium collection' },
      { href: '/category/wedding-garland', label: 'Wedding garlands' },
      // { href: '/category/bridal-flowers', label: 'Bridal flowers' }, // category not live yet
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/services', label: 'Our services' },
      { href: '/about', label: 'About us' },
      { href: '/faq', label: 'FAQs' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Your account',
    links: [
      { href: '/account', label: 'Profile & orders' },
      { href: '/wishlist', label: 'Favourites' },
      { href: '/cart', label: 'Cart' },
    ],
  },
];

const credentials = [
  { icon: LeafIcon, label: 'Freshness', value: 'Made on the day of delivery' },
  { icon: PaletteIcon, label: 'Custom orders', value: 'Flowers, colours and length' },
  { icon: ClockIcon, label: 'Hours', value: site.hours },
];

const contactCard =
  'group flex items-center gap-3 rounded-large border border-white/10 bg-white/[0.04] px-4 py-3 transition-colors hover:border-brand-500/50 hover:bg-white/[0.07]';

export default function Footer() {
  const social = Object.entries(site.social).filter(([, url]) => url);

  return (
    <footer className="surface-dark mt-auto pb-[60px] text-ink-300 lg:pb-0">
      {/* ── Action band ── */}
      <div className="border-b border-white/10">
        <div className="wrap flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:py-12">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-brand-300 uppercase">Fresh flowers · Made to order</p>
            <h2 className="mt-2.5 text-[24px] leading-tight text-white sm:text-[30px]">Plan your wedding flowers in a minute</h2>
            <p className="mt-2 text-[13px] text-white/60">
              {products.length} designs · {categories.length} {categories.length === 1 ? 'collection' : 'collections'} · order {site.leadTime} ahead
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <a
              href={hasWhatsapp ? whatsappLink(`Hello ${site.name}, I would like to enquire about an order.`) : '/contact'}
              target={hasWhatsapp ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg font-bold"
            >
              <WhatsAppIcon size={18} />
              Order on WhatsApp
            </a>
            <Link href="/shop" className="btn btn-lg border border-white/15 bg-white/[0.06] font-bold text-white hover:border-white/30 hover:bg-white/10">
              Browse the shop
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Link grid ── */}
      <div className="wrap grid gap-10 py-12 lg:grid-cols-12 lg:gap-8 lg:py-14">
        <div className="lg:col-span-4">
          <Link href="/" className="flex items-center gap-2.5" prefetch={false}>
            <LogoMark size={40} className="ring-white/15" />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-bold text-white">{site.name}</span>
              <span className="mt-1 text-[10px] font-semibold tracking-[0.16em] text-white/50 uppercase">Handcrafted · Fresh</span>
            </span>
          </Link>

          <div className="mt-7 space-y-3">
            {site.phone && (
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className={contactCard}>
                <span className="icon-badge icon-badge-dark size-9">
                  <PhoneIcon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] tracking-[0.1em] text-white/50 uppercase">Call us</span>
                  <span className="block text-sm font-bold text-white">{site.phone}</span>
                </span>
                <ArrowRightIcon size={16} className="ml-auto -rotate-45 text-white/40 transition-colors group-hover:text-brand-300" />
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className={contactCard}>
                <span className="icon-badge icon-badge-dark size-9">
                  <MailIcon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] tracking-[0.1em] text-white/50 uppercase">Email</span>
                  <span className="block truncate text-sm font-bold text-white">{site.email}</span>
                </span>
                <ArrowRightIcon size={16} className="ml-auto -rotate-45 text-white/40 transition-colors group-hover:text-brand-300" />
              </a>
            )}
            {hasAddress && (
              <p className="flex items-start gap-3 px-1 text-[13px] leading-relaxed text-white/60">
                <PinIcon size={16} className="mt-0.5 shrink-0 text-brand-400" />
                <span>
                  {site.address.street}, {site.address.city}
                  {site.address.region && `, ${site.address.region}`} {site.address.postalCode}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[11px] font-bold tracking-[0.14em] text-white uppercase">{column.title}</h3>
              <ul className="mt-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false} className="group inline-flex min-h-9 items-center gap-1.5 text-[13px] text-white/65 transition-colors hover:text-white">
                      <span className="h-px w-0 bg-brand-500 transition-[width] duration-300 ease-fluid group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-[11px] font-bold tracking-[0.14em] text-white uppercase">Collections</h3>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  prefetch={false}
                  className="inline-flex min-h-8 items-center rounded-full border border-white/10 px-3 text-[11px] font-semibold text-white/65 transition-colors hover:border-brand-500/60 hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-7 space-y-3">
            {credentials.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-2.5">
                <Icon size={16} className="mt-0.5 shrink-0 text-brand-400" />
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.12em] text-white/50 uppercase">{label}</p>
                  <p className="text-xs font-semibold text-white/80">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            {social.length > 0 && (
              <ul className="flex items-center gap-2">
                {social.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press inline-flex min-h-9 items-center rounded-full border border-white/10 px-3.5 text-xs font-semibold text-white/70 capitalize hover:border-brand-500/60 hover:text-white"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
