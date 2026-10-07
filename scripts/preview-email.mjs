// Renders the two order emails with sample data so the design can be checked in a browser.
//   node scripts/preview-email.mjs   → writes email-preview-customer.html / email-preview-shop.html

import { writeFile } from 'node:fs/promises';
import { products } from '../src/data/products.js';
import { computeTotals } from '../src/lib/order.js';
import { renderOrderEmail } from '../src/lib/email/order-email.js';

const pick = (index, qty) => {
  const p = products[index];
  return { id: p.id, slug: p.slug, name: p.name, price: p.price, mrp: p.mrp, image: p.images[0], qty };
};

const items = [pick(0, 2), pick(10, 1), pick(22, 3)];
const totals = computeTotals(items);
const order = {
  id: 'WG-SAMPLE01',
  placedAt: new Date().toISOString(),
  items,
  totals,
  total: totals.total,
  customer: {
    name: 'Sample Customer',
    phone: '90000 00000',
    email: 'customer@example.com',
    eventDate: '2026-12-01',
    address: '12 Sample Street, Sample Nagar',
    city: 'Sampleville',
    pincode: '600001',
    notes: 'Please match the garlands to a maroon silk saree.',
  },
};

const origin = process.argv[2] || 'http://localhost:3000';
for (const audience of ['customer', 'shop']) {
  const { subject, html } = renderOrderEmail({ order, audience, origin });
  await writeFile(`email-preview-${audience}.html`, html);
  console.log(`${audience}: ${subject}`);
}
