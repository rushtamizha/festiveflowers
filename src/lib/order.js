// Order maths and the WhatsApp order message. Used in the browser (cart, checkout) and on the
// server (the email route recomputes every total from the catalogue, so prices cannot be
// tampered with in the browser).

import { site } from '../config/site.js';
import { formatPrice } from './format.js';

/** The bill for a list of cart lines ({ price, mrp, qty }). */
export function computeTotals(items) {
  const { minimumValue, freeDeliveryAbove, deliveryFee, gstPercent } = site.order;

  const subtotal = items.reduce((sum, line) => sum + line.price * line.qty, 0);
  const mrpTotal = items.reduce((sum, line) => sum + (line.mrp || line.price) * line.qty, 0);
  const count = items.reduce((sum, line) => sum + line.qty, 0);

  const shortfall = Math.max(0, minimumValue - subtotal);
  const freeDelivery = freeDeliveryAbove > 0 && subtotal >= freeDeliveryAbove;
  const delivery = subtotal === 0 || freeDelivery ? 0 : deliveryFee;
  const gst = Math.round((subtotal * gstPercent) / 100);

  return {
    count,
    subtotal,
    mrpTotal,
    savings: mrpTotal - subtotal,
    gst,
    gstPercent,
    delivery,
    total: subtotal + gst + delivery,
    shortfall,
    meetsMinimum: shortfall === 0,
    freeDelivery,
    freeDeliveryShortfall: Math.max(0, freeDeliveryAbove - subtotal),
  };
}

export function formatEventDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

/**
 * The order as a WhatsApp message: sectioned, with *bold* headings (WhatsApp formatting),
 * so it reads clearly on a phone and nothing has to be retyped.
 */
export function orderWhatsAppText(order) {
  const { customer: c, totals: t } = order;

  const lines = order.items.flatMap((item, index) => [
    `${index + 1}. ${item.name}`,
    `    ${item.qty} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.qty)}`,
  ]);

  return [
    `*New order ${order.id}*`,
    site.name,
    '',
    `*Items (${t.count})*`,
    ...lines,
    '',
    '*Bill*',
    `Item total: ${formatPrice(t.subtotal)}`,
    t.savings > 0 ? `You save: ${formatPrice(t.savings)}` : null,
    t.gstPercent > 0 ? `GST (${t.gstPercent}%): ${formatPrice(t.gst)}` : null,
    `Delivery: ${t.delivery === 0 ? 'FREE' : formatPrice(t.delivery)}`,
    `*To pay: ${formatPrice(t.total)}*`,
    '',
    '*Deliver to*',
    c.name,
    `Phone: ${c.phone}`,
    c.email ? `Email: ${c.email}` : null,
    `${c.address}, ${c.city} - ${c.pincode}`,
    `Function date: ${formatEventDate(c.eventDate)}`,
    c.notes ? `Notes: ${c.notes}` : null,
    '',
    'Please confirm availability and delivery time. Thank you!',
  ]
    .filter((line) => line !== null)
    .join('\n');
}
