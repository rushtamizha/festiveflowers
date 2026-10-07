/**
 * Catalogue data-access layer.
 *
 * Nothing in the UI reads the catalogue files directly: every page and section calls these
 * async functions. Today they read the local data in src/data; to move to a real backend or
 * an admin panel later, swap the bodies of these functions for fetch() calls and the rest of
 * the site keeps working unchanged.
 */

import { categories, getCategory as findCategory, getSubcategory as findSubcategory, categoryImage } from '@/data/categories';
import { products, getProduct as findProduct, getRelatedProducts as findRelated, toCard } from '@/data/products';
import { priceRanges, getPriceRange, inPriceRange } from '@/data/content';

const countIn = (slug) => products.filter((p) => p.categorySlug === slug).length;

const sorters = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
};

/** All categories, each with its image and product count. */
export async function getCategories() {
  return categories.map((category) => ({
    ...category,
    image: categoryImage(category.slug),
    productCount: countIn(category.slug),
  }));
}

export async function getCategory(slug) {
  const category = findCategory(slug);
  return category ? { ...category, image: categoryImage(slug), productCount: countIn(slug) } : null;
}

export async function getSubcategory(categorySlug, subSlug) {
  return findSubcategory(categorySlug, subSlug) ?? null;
}

/**
 * Product cards, filtered and sorted.
 * @param {{ category?: string, subcategory?: string, tag?: 'bestseller' | 'premium', price?: string, sort?: string, limit?: number }} [query]
 */
export async function getProducts({ category, subcategory, tag, price, sort, limit } = {}) {
  const range = price ? getPriceRange(price) : null;

  let list = products.filter((p) => {
    if (category && p.categorySlug !== category) return false;
    if (subcategory && p.subcategorySlug !== subcategory) return false;
    if (tag === 'bestseller' && !p.bestSeller) return false;
    if (tag === 'premium' && !p.premium) return false;
    if (range && !inPriceRange(p.price, range)) return false;
    return true;
  });

  if (sorters[sort]) list = [...list].sort(sorters[sort]);
  if (limit) list = list.slice(0, limit);
  return list.map(toCard);
}

/** One full product (description, specs, all images), or null. */
export async function getProduct(slug) {
  return findProduct(slug) ?? null;
}

export async function getProductSlugs() {
  return products.map((p) => p.slug);
}

export async function getRelatedProducts(slug, limit = 8) {
  const product = findProduct(slug);
  return product ? findRelated(product, limit).map(toCard) : [];
}

/** Price ranges for "shop by price", each with how many products fall in it. */
export async function getPriceRanges() {
  return priceRanges.map((range) => ({
    ...range,
    productCount: products.filter((p) => inPriceRange(p.price, range)).length,
  }));
}

export async function getCatalogueSummary() {
  const prices = products.map((p) => p.price);
  return {
    productCount: products.length,
    categoryCount: categories.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
}
