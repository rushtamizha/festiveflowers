'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FlowerIcon,
  GridIcon,
  HeartIcon,
  PhoneIcon,
  StarIcon,
  UserIcon,
  WhatsAppIcon,
} from '@/components/ui/Icons';

function Group({ title, children }) {
  return (
    <section>
      <h3 className="mb-2 px-1 text-[11px] font-bold tracking-[0.1em] text-ink-500 uppercase">{title}</h3>
      <div className="overflow-hidden rounded-large border border-ink-200 bg-white">{children}</div>
    </section>
  );
}

const rowClass = 'group flex w-full items-center gap-3 pl-3.5 text-left transition-colors hover:bg-ink-50 active:bg-ink-100';
const rowInner = 'flex flex-1 items-center gap-2 border-b border-ink-200 py-3 pr-3.5 group-last:border-0';

function Row({ href, onNavigate, icon, label, detail, external }) {
  const Tag = external ? 'a' : Link;
  const extra = external ? { target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' } : {};
  return (
    <Tag href={href} onClick={onNavigate} className={rowClass} {...extra}>
      {icon}
      <span className={rowInner}>
        <span className="flex-1 text-[15px] font-medium text-ink">{label}</span>
        {detail && <span className="text-sm text-ink-500 tabular-nums">{detail}</span>}
        <ChevronRightIcon size={16} className="text-ink-300" />
      </span>
    </Tag>
  );
}

function Tile({ className, children }) {
  return <span className={cn('grid size-8 shrink-0 place-items-center rounded-small text-white shadow-small ring-1 ring-black/10', className)}>{children}</span>;
}

/** Phone menu content, shown inside the navbar sheet. Categories open to show their sub-categories. */
export default function MenuPanel({ categories, contact, onNavigate }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-6 p-5">
      <Group title="Explore">
        <Row href="/shop" onNavigate={onNavigate} label="Shop all" icon={<Tile className="bg-brand-600"><GridIcon size={16} /></Tile>} />
        <Row href="/best-sellers" onNavigate={onNavigate} label="Best sellers" icon={<Tile className="bg-ink-900"><StarIcon size={15} /></Tile>} />
        <Row href="/premium" onNavigate={onNavigate} label="Premium collection" icon={<Tile className="bg-brand-800"><FlowerIcon size={16} /></Tile>} />
        <Row href="/services" onNavigate={onNavigate} label="Our services" icon={<Tile className="bg-success-700"><FlowerIcon size={16} /></Tile>} />
        <Row href="/wishlist" onNavigate={onNavigate} label="Favourites" icon={<Tile className="bg-brand-500"><HeartIcon size={16} /></Tile>} />
        <Row href="/account" onNavigate={onNavigate} label="Your account" icon={<Tile className="bg-ink-600"><UserIcon size={16} /></Tile>} />
      </Group>

      <Group title="Categories">
        {categories.map((category) => {
          const open = expanded === category.slug;
          return (
            <div key={category.slug} className="group">
              <button type="button" aria-expanded={open} onClick={() => setExpanded(open ? null : category.slug)} className={rowClass}>
                <span className="relative block size-8 shrink-0 overflow-hidden rounded-small border border-ink-200 bg-ink-50">
                  <Image src={category.image} alt="" fill sizes="32px" className="object-cover" />
                </span>
                <span className={cn(rowInner, open && 'border-transparent')}>
                  <span className="flex-1 text-[15px] font-medium text-ink">{category.name}</span>
                  <span className="text-sm text-ink-500 tabular-nums">{category.count}</span>
                  <ChevronDownIcon size={16} className={cn('text-ink-300 transition-transform duration-300 ease-fluid', open && 'rotate-180')} />
                </span>
              </button>
              {/* Sub-categories unfold in place */}
              <div className={cn('grid transition-[grid-template-rows] duration-300 ease-fluid', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <ul inert={!open} className="overflow-hidden bg-ink-50">
                  {category.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/category/${category.slug}/${sub.slug}`}
                        onClick={onNavigate}
                        className="flex min-h-11 items-center justify-between gap-2 pr-3.5 pl-[3.6rem] text-sm text-ink-700 active:bg-ink-100"
                      >
                        {sub.name}
                        <ChevronRightIcon size={15} className="text-ink-300" />
                      </Link>
                    </li>
                  ))}
                  <li className="border-b border-ink-200">
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={onNavigate}
                      className="flex min-h-11 items-center pr-3.5 pl-[3.6rem] text-sm font-semibold text-brand-700 active:bg-ink-100"
                    >
                      View all {category.name}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
      </Group>

      <Group title="Support">
        {contact.phone && (
          <Row
            external
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            label="Call us"
            detail={contact.phone}
            icon={<Tile className="bg-success-500"><PhoneIcon size={16} /></Tile>}
          />
        )}
        {contact.whatsapp && (
          <Row external href={contact.whatsapp} label="Chat on WhatsApp" icon={<Tile className="bg-success-700"><WhatsAppIcon size={17} /></Tile>} />
        )}
        <Row href="/contact" onNavigate={onNavigate} label="Contact & custom orders" icon={<Tile className="bg-ink-500"><PhoneIcon size={16} /></Tile>} />
        <Row href="/faq" onNavigate={onNavigate} label="FAQs" icon={<Tile className="bg-ink-800">?</Tile>} />
      </Group>
    </div>
  );
}
