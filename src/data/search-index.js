// Compact, searchable list of every product. Loaded on demand (when the navbar search opens,
// or on the shop page), so it is not part of the first-load JavaScript.
import { products, toCard } from './products.js';

export const searchIndex = products.map((p) => ({
  ...toCard(p),
  keywords: [p.name, p.categoryName, p.subcategoryName, ...p.flowers].join(' ').toLowerCase(),
}));

/** Products matching every word of `term`, best matches (name hits) first. */
export function searchProducts(index, term) {
  const tokens = term.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return { tokens, matches: [] };

  const matches = index
    .filter((p) => tokens.every((t) => p.keywords.includes(t)))
    .map((p) => {
      const name = p.name.toLowerCase();
      const score = tokens.reduce((sum, t) => sum + (name.startsWith(t) ? 3 : name.includes(t) ? 2 : 0), 0) + (p.bestSeller ? 0.5 : 0);
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ p }) => p);

  return { tokens, matches };
}
