import { IMAGE_VERSION } from './image-version.mjs';
import { IMAGE_HOSTS } from './image-hosts.mjs';

// Single place for everything business-specific.
// Replace the placeholder values below with your real details before going live.

export const site = {
  name: 'Wedding Garlands',
  shortName: 'Garlands',
  tagline: 'Handcrafted fresh flower garlands for weddings and ceremonies',
  description:
    'Premium handcrafted wedding garlands, bridal flowers, bouquets, car decoration, pooja garlands and floral jewellery, made to order with fresh flowers.',

  // Set NEXT_PUBLIC_SITE_URL in .env (or your host) to your real domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com').replace(/\/$/, ''),
  locale: 'en-IN',
  language: 'en',
  currency: 'INR',
  themeColor: '#d81b66',

  // Contact — placeholders. Leave a field empty ('') to hide it everywhere.
  phone: '+91 00000 00000',
  whatsapp: '910000000000', // country code + number, digits only
  email: 'hello@example.com',
  address: {
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'IN',
  },
  hours: 'Mon – Sun, 6:00 AM – 9:00 PM',
  areaServed: 'India',

  social: {
    instagram: '',
    facebook: '',
    youtube: '',
  },

  // Shown in the bar above the header.
  announcement: 'Fresh flowers, handcrafted to order · Book wedding garlands 2–3 days ahead',

  // Order lead time used in product copy and FAQs.
  leadTime: '2–3 days',

  // Order rules used by the cart, checkout, WhatsApp message and emails.
  // PLACEHOLDER NUMBERS: set these to your real policy.
  order: {
    minimumValue: 500, // smallest order you accept (0 = no minimum)
    freeDeliveryAbove: 5000, // item total at which delivery becomes free (0 = never free)
    deliveryFee: 150, // charged below the free-delivery level
    // Fresh flowers are generally GST-exempt in India. If you do charge GST, set the rate here
    // and a "GST (x%)" row appears in the bill everywhere.
    gstPercent: 0,
  },

  seo: {
    // Turn this on only when the ratings in src/data/products.js are real customer
    // ratings. Publishing made-up ratings in structured data breaks search-engine rules.
    includeRatingSchema: false,
    keywords: [
      'wedding garlands',
      'wedding garland online',
      'rose petal garland',
      'jasmine wedding garland',
      'bridal flowers',
      'wedding car decoration',
      'pooja garlands',
      'floral jewellery sets',
      'money garland',
      'wedding hand bouquet',
    ],
  },
};

export const hasAddress = Boolean(site.address.street && site.address.city);
export const hasWhatsapp = Boolean(site.whatsapp) && !/0{8}/.test(site.whatsapp);

export function whatsappLink(message = '') {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Versioned URL for a file in /public/images (see image-version.mjs). */
export function img(path) {
  return `${path}?v=${IMAGE_VERSION}`;
}

/**
 * Turns a photo as written in the data files into a URL the site can use:
 *   'My photo.png'                    a file in public/images/<folder>/
 *   '/images/gallery/My photo.png'    a file anywhere in public/images/
 *   'https://cdn.example.com/a.jpg'   a photo hosted elsewhere (its host must be in image-hosts.mjs)
 */
export function imageSrc(src, folder) {
  if (/^[a-z]+:\/\//i.test(src)) {
    const { protocol, hostname } = new URL(src);
    if (protocol !== 'https:' || !IMAGE_HOSTS.includes(hostname)) {
      throw new Error(`Photo "${src}": use an https:// address and add '${hostname}' to IMAGE_HOSTS in src/config/image-hosts.mjs.`);
    }
    return src;
  }
  const path = src.startsWith('/') ? src : `/images/${folder}/${src}`;
  if (!path.startsWith('/images/')) {
    throw new Error(`Photo "${src}": put the file inside public/images/ and write its path as /images/…`);
  }
  // File names may contain spaces, commas and other characters that are not allowed in a URL
  // as-is. Each part is encoded the way Next.js looks up files in /public.
  const encoded = path
    .split('/')
    .map((part) => encodeURIComponent(decodeURIComponent(part)))
    .join('/');
  return img(encoded);
}

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
