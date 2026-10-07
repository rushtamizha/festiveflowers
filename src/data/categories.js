import { imageSrc } from '../config/site.js';

// Product categories. `id` values match the original category list.
// `kind` only drives the placeholder artwork generator (scripts/generate-placeholders.mjs).
// `image` (optional) is the collection photo, written like a product photo in products.js:
// a file name in public/images/categories/, a /images/… path, or an https:// address.
// Leave it out to use public/images/categories/<slug>.webp.

export const categories = [
  {
    id: 1,
    slug: 'wedding-garland',
    name: 'Wedding Garland',
    kind: 'garland',
    short: 'Bride and groom garlands',
    description:
      'Handcrafted wedding garlands for the bride and groom in rose petal, jasmine, lotus and orchid designs, made fresh for your muhurtham and reception.',
    intro:
      'The wedding garland is the centrepiece of the ceremony. Each garland here is strung by hand on the day of delivery, matched as a pair for the bride and groom, and finished with a pendant and tassels so it sits well in photographs.',
    subcategories: [
      { slug: 'rose-garlands', name: 'Rose Petal Garlands' },
      { slug: 'jasmine-garlands', name: 'Jasmine Garlands' },
      { slug: 'lotus-garlands', name: 'Lotus Garlands' },
      { slug: 'orchid-garlands', name: 'Orchid & Designer Garlands' },
    ],
  },

  // ── Not live yet ──────────────────────────────────────────────────────────────
  // Only Wedding Garland is on sale for now. To bring a category back, move it above this
  // comment block, and uncomment its product rows in src/data/products.js.
  /*
  {
    id: 3,
    slug: 'bridal-flowers',
    name: 'Bridal Flowers',
    kind: 'braid',
    short: 'Poo jadai, veni and hair flowers',
    description:
      'Fresh bridal hair flowers including poo jadai, veni, gajra and hair accessories, crafted to match your wedding saree and hairstyle.',
    intro:
      'Bridal flowers complete the wedding look. Choose a full poo jadai for the muhurtham braid, a veni or gajra for the bun, or a lighter hair set for the reception.',
    subcategories: [
      { slug: 'poo-jadai', name: 'Poo Jadai (Braid Flowers)' },
      { slug: 'veni-gajra', name: 'Veni & Gajra' },
      { slug: 'hair-accessories', name: 'Floral Hair Accessories' },
    ],
  },
  {
    id: 4,
    slug: 'bouquet',
    name: 'Bouquet',
    kind: 'bouquet',
    short: 'Rose, mixed and exotic bouquets',
    description:
      'Fresh flower bouquets in rose, seasonal mixed and exotic orchid and lily arrangements for weddings, receptions and gifting.',
    intro:
      'A bouquet is the simplest way to greet the couple or welcome a guest. Every bouquet is arranged to order and wrapped by hand.',
    subcategories: [
      { slug: 'rose-bouquets', name: 'Rose Bouquets' },
      { slug: 'mixed-bouquets', name: 'Mixed Flower Bouquets' },
      { slug: 'exotic-bouquets', name: 'Exotic Bouquets' },
    ],
  },
  {
    id: 18,
    slug: 'car-decoration',
    name: 'Car Decoration',
    kind: 'car',
    short: 'Wedding car flower décor',
    description:
      'Wedding car decoration with fresh flowers, ribbons and bonnet arrangements for the bride and groom’s car.',
    intro:
      'The wedding car carries the couple into their new life together. Our decorators dress the bonnet, doors and rear of the car with fresh flowers fixed safely so nothing marks the paintwork.',
    subcategories: [
      { slug: 'wedding-car', name: 'Wedding Car Décor' },
      { slug: 'traditional-car', name: 'Traditional Car Décor' },
      { slug: 'luxury-car', name: 'Luxury Full Car Décor' },
    ],
  },
  {
    id: 31,
    slug: 'string-flowers',
    name: 'String Flowers',
    kind: 'strings',
    short: 'Jasmine, mullai and marigold strings',
    description:
      'Fresh string flowers such as Madurai malli, mullai, kanakambaram and marigold strings for hair, pooja and decoration.',
    intro:
      'String flowers are tied by hand, bud by bud. Order them for hair, for the pooja room, or in bulk to decorate the wedding hall.',
    subcategories: [
      { slug: 'jasmine-strings', name: 'Jasmine & Mullai Strings' },
      { slug: 'colour-strings', name: 'Colour Flower Strings' },
      { slug: 'marigold-strings', name: 'Marigold Strings' },
    ],
  },
  {
    id: 33,
    slug: 'pooja-garlands',
    name: 'Pooja Garlands',
    kind: 'garland',
    short: 'Deity and temple garlands',
    description:
      'Pooja garlands for deities, temples and home shrines in marigold, rose, tulsi and lotus, along with door thoranam.',
    intro:
      'Pooja garlands are made with flowers considered suitable for worship and are strung without artificial fragrance or colour.',
    subcategories: [
      { slug: 'deity-garlands', name: 'Deity Garlands' },
      { slug: 'temple-garlands', name: 'Temple Garlands' },
      { slug: 'door-thoranam', name: 'Door Thoranam' },
    ],
  },
  {
    id: 36,
    slug: 'support-garland',
    name: 'Support Garland',
    kind: 'garland',
    short: 'Garlands for family and guests',
    description:
      'Support garlands for parents, family members and guests of honour, designed to complement the bride and groom’s wedding garlands.',
    intro:
      'Support garlands are the lighter garlands worn by parents, siblings and honoured guests. They are made in the same flowers as the main wedding garlands so the whole family looks coordinated.',
    subcategories: [
      { slug: 'family-garlands', name: 'Family Garlands' },
      { slug: 'welcome-garlands', name: 'Guest Welcome Garlands' },
    ],
  },
  {
    id: 38,
    slug: 'wedding-hand-bouquets',
    name: 'Wedding Hand bouquets',
    kind: 'bouquet',
    short: 'Bridal and bridesmaid bouquets',
    description:
      'Wedding hand bouquets for brides and bridesmaids in rose, orchid and pastel arrangements for receptions and photo shoots.',
    intro:
      'A hand bouquet is carried by the bride at the reception and during the couple shoot. Each one is bound with a satin-wrapped handle that is comfortable to hold.',
    subcategories: [
      { slug: 'bridal-hand-bouquets', name: 'Bridal Hand Bouquets' },
      { slug: 'reception-hand-bouquets', name: 'Reception Hand Bouquets' },
      { slug: 'bridesmaid-bouquets', name: 'Bridesmaid Bouquets' },
    ],
  },
  {
    id: 39,
    slug: 'traditional-ceremony-garlands',
    name: 'Traditional Ceremony Garlands',
    kind: 'garland',
    short: 'Engagement, seemantham and more',
    description:
      'Traditional ceremony garlands for engagement, seemantham, sashtiapthapoorthi, housewarming and other family functions.',
    intro:
      'Every ceremony has its own garland tradition. These designs follow the customary flowers and lengths for each function.',
    subcategories: [
      { slug: 'engagement-garlands', name: 'Engagement Garlands' },
      { slug: 'baby-shower-garlands', name: 'Seemantham & Baby Shower' },
      { slug: 'milestone-garlands', name: '60th & 80th Wedding Garlands' },
      { slug: 'housewarming-garlands', name: 'Housewarming Garlands' },
    ],
  },
  {
    id: 42,
    slug: 'floral-jewellery-sets',
    name: 'Floral Jewellery Sets',
    kind: 'jewel',
    short: 'Haldi, mehendi and baby shower sets',
    description:
      'Fresh floral jewellery sets for haldi, mehendi, baby shower and bridal functions, including necklace, earrings, maang tikka and bangles.',
    intro:
      'Floral jewellery is light, fragrant and made for the camera. Each set is assembled on the day of the function so the flowers stay fresh through the event.',
    subcategories: [
      { slug: 'haldi-sets', name: 'Haldi Jewellery Sets' },
      { slug: 'mehendi-sets', name: 'Mehendi Jewellery Sets' },
      { slug: 'baby-shower-sets', name: 'Baby Shower Sets' },
      { slug: 'bridal-sets', name: 'Bridal Full Sets' },
    ],
  },
  {
    id: 44,
    slug: 'money-garland',
    name: 'Money Garland',
    kind: 'money',
    short: 'Currency note garlands',
    description:
      'Money garlands for grooms and felicitation, made with flowers, beads and note holders. Currency notes are added by you.',
    intro:
      'A money garland is gifted to the groom or to an honoured guest. We build the garland with secure sleeves so you can slip in your own notes without folding or pinning them.',
    subcategories: [
      { slug: 'note-garlands', name: 'Currency Note Garlands' },
      { slug: 'designer-money-garlands', name: 'Designer Money Garlands' },
    ],
  },
  */
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

export function getCategory(slug) {
  return categoryBySlug[slug];
}

export function getSubcategory(categorySlug, subSlug) {
  return categoryBySlug[categorySlug]?.subcategories.find((s) => s.slug === subSlug);
}

export function categoryImage(slug) {
  return imageSrc(categoryBySlug[slug]?.image || `${slug}.webp`, 'categories');
}
