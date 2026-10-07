// Home-page and marketing content: banners, services, price ranges, FAQs.
// PLACEHOLDER COPY: review the wording (especially delivery and policy answers) before going live.

import { site, img } from '../config/site.js';
import { formatPrice } from '../lib/format.js';
import { getCategory } from './categories.js';
import { products } from './products.js';

const { minimumValue, deliveryFee, freeDeliveryAbove } = site.order;

// Hero banners. Each banner is a ready-made image with its text already in the artwork.
// Replace the files in /public/images/banners/ with your own:
//   desktop: 1920 x 720   (banner-N-desktop.webp)
//   mobile:  1000 x 640   (banner-N-mobile.webp)
// `alt` is what search engines and screen readers read, so describe the banner text there.
// `category` is the collection the banner sells: a banner only shows while that category is
// live in src/data/categories.js, so its "Shop now" never leads to a missing page.
const allBanners = [
  {
    id: 'banner-1',
    desktop: img('/images/banners/Elegant-Jasmine-And-Rose-Garlands.png'),
    mobile: img('/images/banners/Elegant-Jasmine-And-Rose-Garlands.png'),
    alt: 'Shop fresh jasmine and rose wedding garlands in Coimbatore.',
    category: 'wedding-garland',
  },
  {
    id: 'banner-2',
    desktop: img('/images/banners/Elegant-Bridal-Flower-Styling-Banner.png'),
    mobile: img('/images/banners/Elegant-Bridal-Flower-Styling-Banner.png'),
    alt: 'Shop bridal flowers for bun and braid styling in Coimbatore.',
    category: 'bridal-flowers',
  },
  {
    id: 'banner-3',
    desktop: img('/images/banners/Golden-Ceremony-Pooja-Flowers.png'),
    mobile: img('/images/banners/Golden-Ceremony-Pooja-Flowers.png'),
    alt: 'Shop fresh garlands and flower offerings for pooja and ceremonies in Coimbatore.',
    category: 'traditional-ceremony-garlands',
  },
  {
    id: 'banner-4',
    desktop: img('/images/banners/Floral-Wedding-Car-at-Tamil-Mahal.png'),
    mobile: img('/images/banners/Floral-Wedding-Car-at-Tamil-Mahal.png'),
    alt: 'Explore wedding car decoration with jasmine and rose garlands in Coimbatore.',
    category: 'car-decoration',
  },
  {
    id: 'banner-5',
    desktop: img('/images/banners/Elegant-bouquets-ready-to-gift.png'),
    mobile: img('/images/banners/Elegant-bouquets-ready-to-gift.png'),
    alt: 'Shop fresh flower bouquets and floral gifts in Coimbatore.',
    category: 'bouquet',
  },
];

export const banners = allBanners
  .filter((banner) => getCategory(banner.category))
  .map((banner) => ({ ...banner, href: `/category/${banner.category}` }));

// Services. Replace the files in /public/images/services/ (4:5 portrait, e.g. 900 x 1125)
// and update `alt` to describe what your photo shows.
// A service links to its category while that category is live, otherwise to the contact page.
const categoryOrContact = (slug) => (getCategory(slug) ? `/category/${slug}` : '/contact');

export const services = [
  {
    id: 'wedding-garland-making',
    title: 'Wedding Garland Making',
    text: 'Bride and groom garlands designed around your outfits and strung fresh on the wedding day.',
    image: img('/images/services/wedding-garland-making.webp'),
    alt: 'A matched pair of fresh rose and jasmine garlands for the bride and groom',
    href: categoryOrContact('wedding-garland'),
  },
  // {
  //   id: 'bridal-flower-styling',
  //   title: 'Bridal Flower Styling',
  //   text: 'Poo jadai, veni and fresh floral jewellery fitted to your hairstyle and saree.',
  //   image: img('/images/services/bridal-flower-styling.webp'),
  //   alt: 'A jasmine and rose poo jadai for a bridal braid',
  //   href: categoryOrContact('bridal-flowers'),
  // },
  // {
  //   id: 'wedding-car-decoration',
  //   title: 'Wedding Car Decoration',
  //   text: 'On-site car décor with fresh flowers and ribbon, fixed safely without marking the car.',
  //   image: img('/images/services/wedding-car-decoration.webp'),
  //   alt: 'A wedding car bonnet dressed with roses and ribbon',
  //   href: categoryOrContact('car-decoration'),
  // },
  // {
  //   id: 'ceremony-and-pooja-flowers',
  //   title: 'Ceremony & Pooja Flowers',
  //   text: 'Garlands, thoranam and loose flowers for engagements, seemantham, housewarming and pooja.',
  //   image: img('/images/services/ceremony-and-pooja-flowers.webp'),
  //   alt: 'A marigold garland for a pooja ceremony',
  //   href: categoryOrContact('traditional-ceremony-garlands'),
  // },
  // {
  //   id: 'bouquets-and-gifting',
  //   title: 'Bouquets & Gifting',
  //   text: 'Hand-tied bouquets and bridal hand bouquets for receptions, stage greetings and gifts.',
  //   image: img('/images/services/bouquets-and-gifting.webp'),
  //   alt: 'A hand-tied bouquet of pink and blush roses',
  //   href: categoryOrContact('bouquet'),
  // },
  // {
  //   id: 'custom-and-bulk-orders',
  //   title: 'Custom & Bulk Orders',
  //   text: 'Bespoke designs, family garland sets and bulk string flowers for the whole function.',
  //   image: img('/images/services/custom-and-bulk-orders.webp'),
  //   alt: 'Strings of jasmine, kanakambaram and marigold flowers',
  //   href: '/contact',
  // },
];

// Shop-by-price ranges. `max: null` means "and above".
const allPriceRanges = [
  { slug: 'under-999', label: 'Under ₹999', min: 0, max: 999, note: 'Strings, pooja garlands and gifts' },
  { slug: '1000-to-2499', label: '₹1,000 – ₹2,499', min: 1000, max: 2499, note: 'Bouquets, jadai and jewellery sets' },
  { slug: '2500-to-4999', label: '₹2,500 – ₹4,999', min: 2500, max: 4999, note: 'Classic wedding garlands' },
  { slug: '5000-to-9999', label: '₹5,000 – ₹9,999', min: 5000, max: 9999, note: 'Lotus and orchid garlands' },
  { slug: '10000-and-above', label: '₹10,000 & above', min: 10000, max: null, note: 'Designer and luxury pieces' },
];

// Only ranges that currently have designs in them (empty ones return with their products).
export const priceRanges = allPriceRanges.filter((range) => products.some((p) => inPriceRange(p.price, range)));

export function inPriceRange(price, range) {
  return price >= range.min && (range.max === null || price <= range.max);
}

export function getPriceRange(slug) {
  return priceRanges.find((r) => r.slug === slug);
}

export const orderSteps = [
  { title: 'Choose your design', text: 'Browse the collections, or send us a photo of a garland you like.' },
  { title: 'Tell us the date', text: 'Share the function date, time and delivery address when you order.' },
  { title: 'We craft it fresh', text: 'Your flowers are bought that morning and strung by hand to order.' },
  { title: 'Delivered to your venue', text: 'Packed in a cool box and delivered in time for the ceremony.' },
];

export const faqs = [
  {
    q: 'How far in advance should I order wedding garlands?',
    a: `Order wedding garlands ${site.leadTime} before the function so the right flowers can be sourced. String flowers, bouquets and pooja garlands can usually be arranged at shorter notice. For designer and orchid garlands, a week’s notice is best during the wedding season.`,
  },
  {
    q: 'Are the garlands made with fresh flowers?',
    a: 'Yes. Every garland is made to order with fresh flowers bought on the morning of delivery. Nothing is pre-made or stored.',
  },
  {
    q: 'How long does a wedding garland stay fresh?',
    a: 'A fresh flower wedding garland looks its best for 12 to 18 hours when kept in a cool, shaded place and sprinkled lightly with water. Orchid and carnation garlands last longest; jasmine is best worn the same day.',
  },
  {
    q: 'Can I customise the flowers, colour or length?',
    a: 'Yes. Flowers, colour combination, thickness and length can all be changed to suit your outfit and budget. Share a reference photo on WhatsApp and we will confirm the price before you order.',
  },
  {
    q: 'Is the price for one garland or a pair?',
    a: 'Unless the product name says “pair” or “set”, the listed price is for a single garland. Add two to your cart for the bride and groom.',
  },
  {
    q: 'Which wedding garland is most popular?',
    a: 'Red rose petal garlands and Madurai jasmine garlands are the most chosen designs for the muhurtham, while orchid garlands are popular for evening receptions because they last longer under stage lights.',
  },
  {
    q: 'How do I place an order?',
    a: 'Add items to your cart and complete the checkout form with your function date and delivery address. Your order is sent to us on WhatsApp and a confirmation is emailed to you. We then confirm availability, delivery time and payment with you. No payment is taken online.',
  },
  {
    q: 'What are the delivery charges and is there a minimum order?',
    a: [
      `Delivery is ${formatPrice(deliveryFee)} per order`,
      freeDeliveryAbove ? `, and free when your items total ${formatPrice(freeDeliveryAbove)} or more` : '',
      '.',
      minimumValue ? ` The minimum order value is ${formatPrice(minimumValue)}.` : ' There is no minimum order value.',
    ].join(''),
  },
];
