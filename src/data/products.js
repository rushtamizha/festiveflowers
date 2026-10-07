// Product catalogue.
//
// PLACEHOLDER DATA: names, prices, ratings and review counts below are sample values so the
// site has something to show. Replace them with your real catalogue before going live.
//
// Photos: list them in each row's `images` (see below). Portrait 4:5 photos fit best; square
// ones are cropped a little at the sides on cards and the product page.

import { categoryBySlug } from './categories.js';
import { site, imageSrc } from '../config/site.js';

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Copy shared by every product in a category: how it is made, and how to look after it.
const categoryCopy = {
  'wedding-garland': {
    craft:
      'Each garland is strung by hand on the morning of delivery and finished with a matching pendant and tassels. It is made as a pair on request so the bride’s and groom’s garlands match in length and fullness.',
    care: 'Keep the garland in its box in a cool, shaded place and sprinkle a little water over the flowers. Avoid refrigeration and direct sunlight. It looks its best for 12–18 hours after delivery.',
    specs: { Length: 'Approx. 3.5 ft drop (customisable)', 'Sold as': 'Single garland' },
  },
  'bridal-flowers': {
    craft:
      'The flowers are tied on a soft base so the piece stays light on the hair and can be pinned securely by your hairstylist.',
    care: 'Store flat in the box in a cool place until it is time to dress. Mist lightly with water; do not soak.',
    specs: { Length: 'Made to your braid length', 'Sold as': 'One piece' },
  },
  bouquet: {
    craft:
      'Stems are conditioned in water before arranging, then hand-tied and wrapped so the bouquet holds its shape when carried.',
    care: 'Trim the stems and place them in fresh water once the event is over. Keep away from heat and direct sun.',
    specs: { Size: 'Approx. 14–16 in tall', 'Sold as': 'One bouquet' },
  },
  'car-decoration': {
    craft:
      'Our decorators fix the arrangement at your venue using suction mounts and ribbon, so nothing sticks to or scratches the paintwork.',
    care: 'Decoration is done on-site shortly before the car is needed. Drive at moderate speed to keep the flowers in place.',
    specs: { Coverage: 'Bonnet, doors and rear', Includes: 'On-site fitting' },
  },
  'string-flowers': {
    craft:
      'Buds are picked early and tied tightly by hand so they open slowly through the day and hold their fragrance.',
    care: 'Wrap in a damp cotton cloth and keep in a cool place. Jasmine strings are best used the same day.',
    specs: { Length: 'Sold per 5 mozham (approx. 7.5 ft)', 'Sold as': 'One string' },
  },
  'pooja-garlands': {
    craft:
      'Made only with flowers customarily offered in worship, without artificial colour or fragrance.',
    care: 'Keep in a clean, cool place until the pooja. Sprinkle water to keep the flowers fresh.',
    specs: { Length: 'Approx. 2.5 ft drop', 'Sold as': 'Single garland' },
  },
  'support-garland': {
    craft:
      'Made lighter and slimmer than the main wedding garland, in matching flowers, so family members can wear them comfortably through the ceremony.',
    care: 'Keep boxed in a cool, shaded place and sprinkle lightly with water until needed.',
    specs: { Length: 'Approx. 2.5–3 ft drop' },
  },
  'wedding-hand-bouquets': {
    craft:
      'Bound on a satin-wrapped handle that is comfortable to hold, with stems sealed so the bouquet stays fresh through the reception and photo shoot.',
    care: 'Keep upright in a little water until it is carried. Avoid air-conditioning vents and direct sun.',
    specs: { Size: 'Approx. 10–12 in across', 'Sold as': 'One hand bouquet' },
  },
  'traditional-ceremony-garlands': {
    craft:
      'Strung in the customary flowers and length for the ceremony, and made as a matched pair where the function calls for one.',
    care: 'Keep boxed in a cool, shaded place and sprinkle lightly with water. Best worn within 12–18 hours of delivery.',
    specs: { Length: 'Approx. 3 ft drop (customisable)' },
  },
  'floral-jewellery-sets': {
    craft:
      'Each piece is assembled on the day of the function on soft wire and thread, so it is light to wear and gentle on skin and fabric.',
    care: 'Keep the set in its box in a cool place and put it on last, after hair and make-up are done.',
    specs: { Includes: 'Necklace, earrings, maang tikka, bangles', 'Sold as': 'One set' },
  },
  'money-garland': {
    craft:
      'Built with clear sleeves that hold each note flat, so you can add your own currency without pins, glue or folding.',
    care: 'Store flat in the box. Add the notes shortly before the function and remove them afterwards.',
    specs: { Length: 'Approx. 3 ft drop', Note: 'Currency notes are not included' },
  },
};

// [name, category, subcategory, price, mrp, rating, reviews, flags, flowers, blurb, images]
// rating, reviews: use 0, 0 for a design with no reviews yet (no stars are shown).
// flags: 'b' = best seller, 'p' = premium
// images: up to 4 photos of this product. The first is the main photo (cards, cart, search).
//   Each one can be:
//     'my-photo.webp'                         a file in public/images/products/
//     '/images/anything/My photo.png'         a file anywhere in public/images/
//     'https://cdn.example.com/garland.jpg'   a photo on another website (add its host to
//                                             src/config/image-hosts.mjs first)
//   Photos are named after the product (its name in lower case with dashes, e.g.
//   'magenta-rose-petal-garland.webp'; extra views add -2, -3, -4). Leave `images` out and the
//   product uses public/images/products/<product-name>.webp.
//   After replacing a photo with a new one of the same file name, bump src/config/image-version.mjs.
const rows = [
  // Wedding Garland
  ['Classic Red Rose Petal Wedding Garland', 'wedding-garland', 'rose-garlands', 3499, 3999, 4.9, 214, 'b', ['Red rose petals', 'Green leaf', 'Gold thread'], 'A full garland of deep red rose petals wound with green leaf and gold bands, finished with a rose pendant and tassels. The traditional choice for the muhurtham.',
    ['classic-red-rose-petal-wedding-garland.webp']],

  ['Pink Rose and Jasmine Bridal Garland', 'wedding-garland', 'rose-garlands', 4299, 4999, 4.8, 167, 'b', ['Pink rose petals', 'Jasmine', 'Gold thread'], 'Magenta rose petals with bands of ivory jasmine and gold, finished with a rose pendant and gold tassels. Delicate, and beautiful in photographs.',
    ['pink-rose-and-jasmine-bridal-garland.webp']],

  ['Pastel Blush Rose Petal Garland', 'wedding-garland', 'rose-garlands', 5499, 6499, 4.8, 92, 'p', ['Peach rose', 'Baby’s breath', 'Pearl'], 'Peach roses set between soft clusters of baby’s breath, finished with pearl strands and rosebud tassels. Made for daytime weddings and pastel outfits.',
    ['pastel-blush-rose-petal-garland.webp']],

  ['Madurai Jasmine Wedding Garland', 'wedding-garland', 'jasmine-garlands', 2999, 3499, 4.9, 188, 'b', ['Jasmine', 'Baby’s breath'], 'Tightly strung Madurai malli with soft clusters of baby’s breath along its length and a jasmine tassel. Classic, and unmistakably fragrant.',
    ['madurai-jasmine-wedding-garland.webp']],

  ['Jasmine and Red Rose Braided Garland', 'wedding-garland', 'jasmine-garlands', 3799, 4299, 4.7, 121, '', ['Jasmine', 'Red rose buds', 'Gold thread'], 'Ivory jasmine with repeating bands of red rosebuds and gold, finished with red rose tassels. A striking contrast for silk sarees and veshtis.',
    ['jasmine-and-red-rose-braided-garland.webp']],

  ['Sacred Pink Lotus Wedding Garland', 'wedding-garland', 'lotus-garlands', 6999, 7999, 4.9, 74, 'p', ['Pink lotus', 'Jasmine'], 'Pink lotus clusters set into a full jasmine garland with fine red and gold bands, finished with lotus-bud tassels. An auspicious choice for temple weddings.',
    ['sacred-pink-lotus-wedding-garland.webp']],

  ['Ivory Jasmine and Tulsi Garland', 'wedding-garland', 'jasmine-garlands', 5999, 6999, 4.7, 58, '', ['Jasmine', 'Tulsi', 'Gold thread'], 'A single jasmine garland banded with fresh tulsi and gold, finished with a jasmine pendant. Light to wear for engagements and receptions.',
    ['ivory-jasmine-and-tulsi-garland.webp']],

  ['Royal Blue and Gold Jasmine Garland', 'wedding-garland', 'orchid-garlands', 7499, 8999, 4.8, 133, 'bp', ['Jasmine buds', 'Blue and gold trim'], 'White jasmine buds banded in royal blue and gold, with a sculpted blue-and-white pendant. A modern statement design for evening receptions.',
    ['royal-blue-and-gold-jasmine-garland.webp']],

  ['White Rose and Baby’s Breath Garland', 'wedding-garland', 'rose-garlands', 8999, 10499, 4.9, 66, 'p', ['White rose', 'Baby’s breath', 'Pearl'], 'An all-white garland of ivory roses edged with baby’s breath, finished with pearl strands and white rosebud tassels. Light, modern and elegant.',
    ['white-rose-and-baby-s-breath-garland.webp']],

  ['Royal Red Rose and Gold Designer Garland', 'wedding-garland', 'orchid-garlands', 12999, 14999, 5.0, 41, 'p', ['Red rose', 'Gold bead'], 'Our most elaborate design: red roses wound with spirals of gold bead work, a gold cone pendant and rosebud tassels.',
    ['royal-red-rose-and-gold-designer-garland.webp']],

  // Not rated yet (rating and reviews 0, 0: no stars are shown until you fill them in).
  ['Pink and Ivory Rose Garland', 'wedding-garland', 'rose-garlands', 5999, 6899, 0, 0, '', ['Pink rose', 'White rose', 'Baby’s breath'], 'Alternating pink and ivory roses edged with baby’s breath, finished with a rose pendant and pink rosebud tassels.',
    ['pink-and-ivory-rose-garland.webp']],

  ['Magenta Rose and Jasmine Panel Garland', 'wedding-garland', 'rose-garlands', 4499, 5199, 0, 0, '', ['Pink rose petals', 'Jasmine', 'Green leaf'], 'A long panel of ivory jasmine framed by magenta rose petals, with green leaf and gold bands and red rose tassels.',
    ['magenta-rose-and-jasmine-panel-garland.webp']],

  ['Peach Rosebud and Jasmine Garland', 'wedding-garland', 'rose-garlands', 5499, 6299, 0, 0, '', ['Peach rose buds', 'Jasmine', 'Pink rose petals'], 'Rows of peach rosebuds and jasmine that deepen into pink rose petals, with a gold collar and pink rosebud tassels.',
    ['peach-rosebud-and-jasmine-garland.webp']],

  ['Jasmine Garland with Burgundy Rose Bands', 'wedding-garland', 'jasmine-garlands', 4299, 4899, 0, 0, '', ['Jasmine', 'Burgundy rose', 'Gold thread'], 'Full jasmine with bands of deep burgundy rose and gold, finished with a magenta rose pendant and gold tassels.',
    ['jasmine-garland-with-burgundy-rose-bands.webp']],

  ['Magenta Rose Garland with Gold Bell Tassels', 'wedding-garland', 'rose-garlands', 5499, 6299, 0, 0, '', ['Pink rose petals', 'Jasmine', 'Gold bells'], 'Jasmine shoulders flowing into magenta rose petals dotted with jasmine, with gold bands and a fringe of gold bells and pearls.',
    ['magenta-rose-garland-with-gold-bell-tassels.webp']],

  ['Jasmine Garland with Red Rose Buttons', 'wedding-garland', 'jasmine-garlands', 3999, 4599, 0, 0, '', ['Jasmine', 'Red rose', 'Green leaf'], 'Dense jasmine dotted with single red roses and edged in green leaf, with a round rose-and-jasmine pendant and pearl tassels.',
    ['jasmine-garland-with-red-rose-buttons.webp']],

  ['Blush and Magenta Rose Garland', 'wedding-garland', 'rose-garlands', 4799, 5499, 0, 0, '', ['Blush rose petals', 'Pink rose petals', 'Green leaf'], 'Soft blush petals with a deep magenta rose panel and a fine green leaf stripe, finished with a magenta rose pendant.',
    ['blush-and-magenta-rose-garland.webp']],

  ['Pink Rose and Baby’s Breath Panel Garland', 'wedding-garland', 'rose-garlands', 5299, 5999, 0, 0, '', ['Pink rose', 'Baby’s breath'], 'Bands of pink roses alternating with full panels of baby’s breath, finished with pink lotus-bud tassels.',
    ['pink-rose-and-baby-s-breath-panel-garland.webp']],

  ['Red and Ivory Checked Designer Garland', 'wedding-garland', 'orchid-garlands', 6499, 7499, 0, 0, 'p', ['Jasmine', 'Red rose petals', 'Green chrysanthemum'], 'Jasmine with a checked panel of red rose petals and white blooms, green chrysanthemum bands and red rosebud tassels with pearls.',
    ['red-and-ivory-checked-designer-garland.webp']],

  ['Magenta Rose Spiral Garland', 'wedding-garland', 'rose-garlands', 4999, 5699, 0, 0, '', ['Pink rose petals', 'Jasmine', 'Gold thread'], 'Magenta rose petals wound with spirals of jasmine, green leaf and gold, finished with pink rosebud tassels.',
    ['magenta-rose-spiral-garland.webp']],

  ['Jasmine Garland with Red Rose and Gold Bands', 'wedding-garland', 'jasmine-garlands', 3799, 4399, 0, 0, '', ['Jasmine', 'Red rose', 'Gold thread'], 'Full jasmine broken by bands of red rose and gold, with a red rose pendant and green-and-gold tassels.',
    ['jasmine-garland-with-red-rose-and-gold-bands.webp']],

  ['Jasmine Garland with Red Rose Panel', 'wedding-garland', 'jasmine-garlands', 4599, 5299, 0, 0, '', ['Jasmine', 'Red rose petals', 'Gold thread'], 'Ivory jasmine with a long red rose panel studded with gold, framed by gold bands and finished with rose and gold tassels.',
    ['jasmine-garland-with-red-rose-panel.webp']],

  ['Pink Rosebud Garland with Gold Bands', 'wedding-garland', 'rose-garlands', 5799, 6699, 0, 0, '', ['Pink rose buds', 'Jasmine', 'Green leaf'], 'Pink rosebuds dotted with jasmine, with green and gold bands, a full rose pendant and gold bead tassels.',
    ['pink-rosebud-garland-with-gold-bands.webp']],

  ['Magenta Rose Petal Garland', 'wedding-garland', 'rose-garlands', 3999, 4599, 0, 0, '', ['Pink rose petals', 'Green leaf'], 'A full garland of magenta rose petals dotted with green, finished with a gold-wrapped pendant and rosebud tassels.',
    ['magenta-rose-petal-garland.webp']],

  ['Red Rose and Jasmine Spiral Garland', 'wedding-garland', 'rose-garlands', 4499, 5199, 0, 0, '', ['Red rose petals', 'Jasmine'], 'Red rose petals and jasmine wound in a bold spiral, with a gold collar, a rose pendant and rosebud tassels.',
    ['red-rose-and-jasmine-spiral-garland.webp']],

  ['Pink Lotus and Jasmine Golden Garland', 'wedding-garland', 'lotus-garlands', 7499, 8499, 0, 0, 'p', ['Pink lotus', 'Jasmine', 'Gold thread'], 'Jasmine with tiers of pink lotus and gold detailing, a gold collar and lotus-bud tassels. A rich design for the muhurtham.',
    ['pink-lotus-and-jasmine-golden-garland.webp']],

  ['Jasmine Garland with Magenta Rose and Leaf Bands', 'wedding-garland', 'jasmine-garlands', 4299, 4899, 0, 0, '', ['Jasmine', 'Pink rose petals', 'Green leaf'], 'Ivory jasmine with magenta rose panels between broad green leaf and gold bands, finished with rosebud tassels.',
    ['jasmine-garland-with-magenta-rose-and-leaf-bands.webp']],

  ['Magenta Rose Garland with Ivory Spiral', 'wedding-garland', 'rose-garlands', 4799, 5499, 0, 0, '', ['Pink rose petals', 'Jasmine', 'Green leaf'], 'Magenta rose petals with an ivory jasmine and green spiral, a full rose pendant and rosebud tassels.',
    ['magenta-rose-garland-with-ivory-spiral.webp']],

  ['Magenta Rose and Marigold Garland', 'wedding-garland', 'rose-garlands', 4999, 5699, 0, 0, '', ['Pink rose petals', 'Yellow marigold', 'Green leaf'], 'Magenta rose petals with blocks of yellow marigold and green, a marigold pendant and rosebud tassels.',
    ['magenta-rose-and-marigold-garland.webp']],

  ['Jasmine Garland with Pink Rose Panels and Pearls', 'wedding-garland', 'jasmine-garlands', 5499, 6299, 0, 0, '', ['Jasmine', 'Pink rose', 'Pearl'], 'Full jasmine with panels of tiny pink and white roses, finished with a rose pendant and long pearl-strand tassels.',
    ['jasmine-garland-with-pink-rose-panels-and-pearls.webp']],

  ['Magenta Rose Garland with White and Gold Bands', 'wedding-garland', 'rose-garlands', 4699, 5399, 0, 0, '', ['Pink rose petals', 'White chrysanthemum', 'Gold thread'], 'Magenta rose petals banded with white blooms, green and gold, with a white pendant and red rose tassels.',
    ['magenta-rose-garland-with-white-and-gold-bands.webp']],

  ['Ivory Jasmine Garland with Red Rosebuds', 'wedding-garland', 'jasmine-garlands', 2499, 2899, 0, 0, '', ['Jasmine', 'Red rose buds'], 'A single ivory jasmine garland set with small clusters of red rosebuds and a red rose pendant.',
    ['ivory-jasmine-garland-with-red-rosebuds.webp']],

  ['Jasmine Garland with Red Rose Stripes', 'wedding-garland', 'jasmine-garlands', 4199, 4799, 0, 0, '', ['Jasmine', 'Red rose', 'Green leaf'], 'Ivory jasmine with diagonal stripes of red rose and green leaf, finished with a jasmine pendant and pink rosebud tassels.',
    ['jasmine-garland-with-red-rose-stripes.webp']],

  ['Burgundy Rose Garland with Gold Cone', 'wedding-garland', 'orchid-garlands', 6999, 7999, 0, 0, 'p', ['Burgundy rose', 'Gold bead'], 'Deep burgundy roses dotted with gold, gathered into a gold cone pendant with red rosebud tassels.',
    ['burgundy-rose-garland-with-gold-cone.webp']],

  ['Ivory Jasmine and Blush Rose Garland', 'wedding-garland', 'jasmine-garlands', 5299, 5999, 0, 0, '', ['Jasmine', 'Blush rose', 'Baby’s breath'], 'Ivory jasmine set with blush rose clusters and baby’s breath, finished with white rosebud tassels.',
    ['ivory-jasmine-and-blush-rose-garland.webp']],

  ['Pink and Gold Rose Garland', 'wedding-garland', 'rose-garlands', 5999, 6899, 0, 0, '', ['Pink rose petals', 'Gold thread'], 'Magenta rose petals with broad gold bands, a gold-wrapped pendant and rose tassels.',
    ['pink-and-gold-rose-garland.webp']],

  ['Orange Rose Garland with Pearl Studs', 'wedding-garland', 'orchid-garlands', 6499, 7499, 0, 0, 'p', ['Orange rose', 'Pearl'], 'Vivid orange roses studded with pearls, gathered into a pearl pendant with orange rosebud tassels.',
    ['orange-rose-garland-with-pearl-studs.webp']],

  ['Red Rose and Ivory Jasmine Single Garland', 'wedding-garland', 'rose-garlands', 2799, 3199, 0, 0, '', ['Red rose', 'Jasmine', 'Gold thread'], 'A single garland of red roses with an ivory jasmine panel and gold bands, finished with a red rose pendant.',
    ['red-rose-and-ivory-jasmine-single-garland.webp']],

  ['Ruby Rose Garland with Gold Bead Collar', 'wedding-garland', 'orchid-garlands', 7999, 9199, 0, 0, 'p', ['Red rose', 'Gold bead'], 'Ruby roses dotted with gold, a beaded gold collar, a gold pendant and red rosebud tassels.',
    ['ruby-rose-garland-with-gold-bead-collar.webp']],

  ['Jasmine Garland with Gold and Red Bands', 'wedding-garland', 'jasmine-garlands', 3999, 4599, 0, 0, '', ['Jasmine', 'Red rose', 'Gold thread'], 'Full jasmine with broad gold and fine red bands, finished with a round jasmine pendant and red tassels.',
    ['jasmine-garland-with-gold-and-red-bands.webp']],

  // Not live yet: these categories are commented out in src/data/categories.js. Uncomment a
  // category's rows together with the category. Ids follow row order, so they continue after the garlands above.
  /*
  // Bridal Flowers
  ['Jasmine Bridal Poo Jadai', 'bridal-flowers', 'poo-jadai', 1899, 2299, 4.8, 156, 'b', ['Jasmine', 'Red rose petals'], 'A full-length braid cover in jasmine with rose medallions, the classic South Indian bridal jadai.'],
  ['Rose Petal Bridal Jadai with Kunjalam', 'bridal-flowers', 'poo-jadai', 2499, 2899, 4.7, 83, '', ['Pink rose petals', 'Jasmine', 'Gold bead'], 'Rose petal panels edged with jasmine and finished with traditional kunjalam tassels.'],
  ['Bridal Bun Veni and Gajra Set', 'bridal-flowers', 'veni-gajra', 699, 899, 4.6, 204, '', ['Jasmine', 'Kanakambaram'], 'A circular veni for the bun with a matching gajra string. Quick to pin and light to wear.'],
  ['Orchid and Baby’s Breath Hair Set', 'bridal-flowers', 'hair-accessories', 1599, 1899, 4.7, 47, '', ['White orchid', 'Baby’s breath'], 'A modern hair set of orchid blooms and baby’s breath sprigs for reception hairstyles.'],

  // Bouquet
  ['Red Rose Classic Bouquet', 'bouquet', 'rose-bouquets', 1299, 1499, 4.8, 312, 'b', ['Red rose'], 'Twenty-five long-stem red roses, hand-tied and wrapped. A timeless bouquet for any occasion.'],
  ['Pink and White Rose Bouquet', 'bouquet', 'rose-bouquets', 1499, 1799, 4.7, 141, '', ['Pink rose', 'White rose'], 'A gentle mix of pink and white roses with fresh greens.'],
  ['Mixed Seasonal Flower Bouquet', 'bouquet', 'mixed-bouquets', 999, 1199, 4.6, 176, '', ['Marigold', 'Pink rose', 'Yellow chrysanthemum'], 'A bright, generous bouquet of the best seasonal flowers from the morning market.'],
  ['Orchid and Lily Luxury Bouquet', 'bouquet', 'exotic-bouquets', 2999, 3499, 4.9, 64, 'p', ['Purple orchid', 'White lily'], 'Orchids and oriental lilies in a tall, elegant arrangement for stage greetings.'],

  // Car Decoration
  ['Classic Rose Wedding Car Decoration', 'car-decoration', 'wedding-car', 4999, 5999, 4.8, 97, 'b', ['Red rose', 'White rose'], 'A rose bonnet arrangement with ribbon lines and door bunches. Our most-booked car décor.'],
  ['Orchid and Ribbon Bonnet Car Décor', 'car-decoration', 'wedding-car', 7999, 9499, 4.8, 52, 'p', ['Purple orchid', 'White orchid'], 'An orchid centrepiece with satin ribbon work for a clean, contemporary look.'],
  ['Jasmine and Marigold Traditional Car Décor', 'car-decoration', 'traditional-car', 3999, 4599, 4.6, 71, '', ['Jasmine', 'Marigold'], 'Marigold and jasmine strings in a traditional style, with mango leaf accents.'],
  ['Full Floral Luxury Car Decoration', 'car-decoration', 'luxury-car', 14999, 17999, 4.9, 28, 'p', ['Pink rose', 'White orchid', 'Baby’s breath'], 'Complete coverage for bonnet, roof line, doors and rear in premium flowers.'],

  // String Flowers
  ['Madurai Malli Jasmine String', 'string-flowers', 'jasmine-strings', 299, 349, 4.9, 428, 'b', ['Jasmine'], 'Fresh Madurai malli buds tied tight. Fragrant, bright and long-lasting.'],
  ['Mullai Flower String', 'string-flowers', 'jasmine-strings', 249, 299, 4.7, 233, '', ['Mullai'], 'Slender mullai buds with a gentle fragrance, ideal for everyday and festive wear.'],
  ['Kanakambaram Flower String', 'string-flowers', 'colour-strings', 349, 399, 4.6, 118, '', ['Kanakambaram'], 'Bright orange kanakambaram tied in the traditional flat style.'],
  ['Marigold String Toran Pack', 'string-flowers', 'marigold-strings', 599, 749, 4.7, 164, '', ['Marigold'], 'A pack of ten marigold strings for doorways, mandaps and backdrops.'],

  // Pooja Garlands
  ['Marigold Pooja Garland', 'pooja-garlands', 'deity-garlands', 349, 449, 4.8, 356, 'b', ['Marigold'], 'A thick marigold garland for daily worship and festival days.'],
  ['Rose and Tulsi Deity Garland', 'pooja-garlands', 'deity-garlands', 499, 599, 4.7, 187, '', ['Red rose petals', 'Tulsi'], 'Red rose and tulsi strung for home shrines and deity photos.'],
  ['Large Lotus Temple Garland', 'pooja-garlands', 'temple-garlands', 1499, 1799, 4.8, 63, '', ['Pink lotus', 'Jasmine'], 'A long garland of lotus and jasmine sized for temple deities.'],
  ['Mango Leaf and Marigold Door Thoranam', 'pooja-garlands', 'door-thoranam', 399, 499, 4.7, 241, '', ['Marigold', 'Mango leaf'], 'A fresh mango leaf and marigold thoranam to hang over the main door.'],

  // Support Garland
  ['Rose Petal Parents Garland Pair', 'support-garland', 'family-garlands', 1799, 2199, 4.7, 109, '', ['Red rose petals', 'Tuberose'], 'A matched pair of slim rose petal garlands for the parents of the bride or groom.'],
  ['Jasmine and Rose Family Garland Set', 'support-garland', 'family-garlands', 2999, 3599, 4.8, 86, 'b', ['Jasmine', 'Pink rose petals'], 'A set of four coordinated garlands for close family members.'],
  ['Guest of Honour Welcome Garland', 'support-garland', 'welcome-garlands', 599, 749, 4.6, 152, '', ['Marigold', 'Tuberose'], 'A neat welcome garland for chief guests and elders.'],
  ['Tuberose Welcome Garland Set', 'support-garland', 'welcome-garlands', 1299, 1599, 4.6, 73, '', ['Tuberose', 'Green leaf'], 'Five fragrant tuberose garlands to welcome guests at the entrance.'],

  // Wedding Hand bouquets
  ['Bridal Red Rose Hand Bouquet', 'wedding-hand-bouquets', 'bridal-hand-bouquets', 1499, 1799, 4.8, 139, 'b', ['Red rose', 'Baby’s breath'], 'A round bouquet of red roses ringed with baby’s breath on a satin handle.'],
  ['Pastel Rose and Baby’s Breath Hand Bouquet', 'wedding-hand-bouquets', 'bridal-hand-bouquets', 1999, 2399, 4.8, 94, '', ['Blush rose', 'Baby’s breath'], 'Blush and ivory roses in a soft, romantic dome.'],
  ['White Orchid Cascade Hand Bouquet', 'wedding-hand-bouquets', 'reception-hand-bouquets', 3499, 3999, 4.9, 48, 'p', ['White orchid', 'Green leaf'], 'A cascading orchid bouquet that trails gracefully for reception entrances.'],
  ['Bridesmaid Posy Bouquet Set', 'wedding-hand-bouquets', 'bridesmaid-bouquets', 2499, 2999, 4.7, 37, '', ['Pink rose', 'White rose'], 'Three matching posies for bridesmaids and flower girls.'],

  // Traditional Ceremony Garlands
  ['Engagement Garland Pair', 'traditional-ceremony-garlands', 'engagement-garlands', 2499, 2999, 4.8, 128, 'b', ['Pink rose petals', 'Tuberose'], 'A matched pair of medium-weight garlands for the nichayathartham ceremony.'],
  ['Seemantham Baby Shower Garland', 'traditional-ceremony-garlands', 'baby-shower-garlands', 1999, 2399, 4.7, 77, '', ['Jasmine', 'Pink rose petals'], 'A light, fragrant garland made comfortable for the mother-to-be.'],
  ['Sashtiapthapoorthi Garland Pair', 'traditional-ceremony-garlands', 'milestone-garlands', 3999, 4599, 4.9, 54, '', ['Red rose petals', 'Jasmine'], 'A grand pair of garlands for the 60th wedding celebration.'],
  ['Housewarming Garland Set', 'traditional-ceremony-garlands', 'housewarming-garlands', 1499, 1799, 4.7, 96, '', ['Marigold', 'Mango leaf'], 'Door thoranam, deity garland and kalasam flowers for the grihapravesam.'],

  // Floral Jewellery Sets
  ['Haldi Floral Jewellery Set', 'floral-jewellery-sets', 'haldi-sets', 1299, 1599, 4.8, 173, 'b', ['Yellow chrysanthemum', 'Jasmine'], 'A sunny yellow and white set for the haldi ceremony.'],
  ['Mehendi Rose Floral Jewellery Set', 'floral-jewellery-sets', 'mehendi-sets', 1499, 1799, 4.7, 112, '', ['Pink rose', 'Baby’s breath'], 'Mini roses and baby’s breath in a playful set for the mehendi.'],
  ['Baby Shower Floral Jewellery Set', 'floral-jewellery-sets', 'baby-shower-sets', 1799, 2099, 4.8, 89, '', ['Jasmine', 'Pink rose'], 'A gentle set with a floral crown, made for the mother-to-be.'],
  ['Bridal Fresh Flower Jewellery Full Set', 'floral-jewellery-sets', 'bridal-sets', 3499, 3999, 4.9, 45, 'p', ['White orchid', 'Pink rose', 'Gold bead'], 'A complete bridal set with necklace, long haar, earrings, tikka, bangles and waist belt.'],

  // Money Garland
  ['Classic Currency Note Garland', 'money-garland', 'note-garlands', 999, 1299, 4.6, 82, '', ['Marigold', 'Gold bead'], 'A simple, sturdy garland with sleeves for twenty-one notes.'],
  ['Rose and Note Wedding Money Garland', 'money-garland', 'note-garlands', 1999, 2399, 4.7, 69, 'b', ['Red rose', 'Gold bead'], 'Rose clusters alternate with note fans for a rich, festive garland.'],
  ['Designer Gold Bead Money Garland', 'money-garland', 'designer-money-garlands', 2999, 3499, 4.7, 38, '', ['Gold bead', 'White rose'], 'Gold bead strands and ivory flowers frame the notes in a refined design.'],
  ['Royal Groom Money Garland', 'money-garland', 'designer-money-garlands', 5499, 5999, 4.8, 23, 'p', ['Gold bead', 'Red rose', 'White orchid'], 'A statement garland for the groom with layered note fans and a jewelled pendant.'],
  */
];

export const products = rows.map(
  ([name, categorySlug, subcategorySlug, price, mrp, rating, reviews, flags, flowers, blurb, images = []], index) => {
    const slug = slugify(name);
    const category = categoryBySlug[categorySlug];
    const subcategory = category.subcategories.find((s) => s.slug === subcategorySlug);
    const copy = categoryCopy[categorySlug];

    return {
      id: `p${index + 1}`,
      sku: `WG-${String(category.id).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`,
      slug,
      name,
      categorySlug,
      categoryName: category.name,
      subcategorySlug,
      subcategoryName: subcategory.name,
      price,
      mrp,
      rating,
      reviews,
      bestSeller: flags.includes('b'),
      premium: flags.includes('p'),
      flowers,
      blurb,
      description: [blurb, copy.craft, copy.care],
      specs: {
        Flowers: flowers.join(', '),
        ...copy.specs,
        Freshness: 'Made to order on the day of delivery',
        'Order ahead': site.leadTime,
      },
      images: (images.length ? images : [`${slug}.webp`])
        .slice(0, 4)
        .map((src) => imageSrc(src, 'products')),
    };
  },
);

const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

export function getProduct(slug) {
  return bySlug[slug];
}

export function getProductsByCategory(categorySlug, subcategorySlug) {
  return products.filter(
    (p) => p.categorySlug === categorySlug && (!subcategorySlug || p.subcategorySlug === subcategorySlug),
  );
}

export const bestSellers = products.filter((p) => p.bestSeller);
export const premiumProducts = products.filter((p) => p.premium);

export function getRelatedProducts(product, limit = 8) {
  const sameSub = products.filter((p) => p.id !== product.id && p.subcategorySlug === product.subcategorySlug);
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug && p.subcategorySlug !== product.subcategorySlug,
  );
  const others = products.filter((p) => p.categorySlug !== product.categorySlug && p.bestSeller);
  return [...sameSub, ...sameCategory, ...others].slice(0, limit);
}

// The small subset of fields that product cards, the cart and the wishlist need.
// Pass this (not the full product) to client components to keep the JS payload small.
export function toCard(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    categorySlug: product.categorySlug,
    categoryName: product.categoryName,
    price: product.price,
    mrp: product.mrp,
    rating: product.rating,
    reviews: product.reviews,
    bestSeller: product.bestSeller,
    premium: product.premium,
    image: product.images[0],
  };
}
