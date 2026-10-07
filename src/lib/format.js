const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export function formatPrice(amount) {
  return `₹${inr.format(amount)}`;
}

export function discountPercent(price, mrp) {
  return mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
}

export function formatDate(iso) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}
