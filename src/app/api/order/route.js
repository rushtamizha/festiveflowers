// POST /api/order — emails a placed order to the shop and to the customer.
//
// This is the one server-side piece of the site. The browser sends only the customer's
// details and the product ids + quantities; every price and total is recomputed here from
// the catalogue, so an order cannot be re-priced by editing the request.
//
// Sending is done through your own mailbox over SMTP. Set these in .env.local (see
// .env.example). Until they are set the route answers `emailed: false` and nothing is sent:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   mail account that sends the emails
//   ORDER_EMAIL_FROM   optional "Name <address>" shown as the sender (default: SMTP_USER)
//   ORDER_EMAIL_TO     optional inbox for new-order emails (default: SMTP_USER)

import nodemailer from 'nodemailer';
import { site } from '@/config/site';
import { products } from '@/data/products';
import { computeTotals } from '@/lib/order';
import { renderOrderEmail } from '@/lib/email/order-email';

export const runtime = 'nodejs';

const json = (data, status = 200) => Response.json(data, { status });
const clean = (value, max) => String(value ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);

// A light per-address throttle. Serverless instances do not share memory, so treat this as a
// speed bump, not real protection: add a CAPTCHA or an edge rate limit if spam becomes a problem.
const recent = new Map();
function throttled(key) {
  const now = Date.now();
  const hits = (recent.get(key) || []).filter((time) => now - time < 60_000);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 500) recent.clear();
  // Generous on purpose: many phone customers share one address behind their carrier.
  return hits.length > 20;
}

function parseCustomer(input = {}) {
  const customer = {
    name: clean(input.name, 80),
    phone: clean(input.phone, 20),
    email: clean(input.email, 120).toLowerCase(),
    eventDate: clean(input.eventDate, 10),
    address: clean(input.address, 300),
    city: clean(input.city, 80),
    pincode: clean(input.pincode, 6),
    notes: clean(input.notes, 500),
  };

  const valid =
    customer.name.length > 1 &&
    /^[0-9+ ()-]{8,16}$/.test(customer.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) &&
    /^\d{4}-\d{2}-\d{2}$/.test(customer.eventDate) &&
    customer.address.length > 3 &&
    customer.city.length > 1 &&
    /^\d{6}$/.test(customer.pincode);

  return valid ? customer : null;
}

function parseItems(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > 60) return null;
  const lines = [];
  for (const entry of input) {
    const product = products.find((p) => p.id === entry?.id);
    const qty = Number(entry?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 99) return null;
    lines.push({ id: product.id, slug: product.slug, name: product.name, price: product.price, mrp: product.mrp, image: product.images[0], qty });
  }
  return lines;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (throttled(ip)) return json({ ok: false, error: 'Too many requests. Please try again in a minute.' }, 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const customer = parseCustomer(body?.customer);
  const items = parseItems(body?.items);
  if (!customer || !items) return json({ ok: false, error: 'Some order details are missing or invalid.' }, 400);

  const totals = computeTotals(items);
  if (!totals.meetsMinimum) return json({ ok: false, error: 'Order is below the minimum order value.' }, 400);

  const order = {
    id: /^WG-[A-Z0-9]{4,16}$/.test(body?.id) ? body.id : `WG-${Date.now().toString(36).toUpperCase()}`,
    placedAt: new Date().toISOString(),
    items,
    totals,
    total: totals.total,
    customer,
  };

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ORDER_EMAIL_FROM, ORDER_EMAIL_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return json({ ok: true, emailed: false, reason: 'Email is not configured on the server.' });
  }

  // Links and images in the email need absolute URLs. Use the configured domain, or the
  // address this request came in on while the domain is still the placeholder.
  const origin = /example\.com/.test(site.url) ? new URL(request.url).origin : site.url;

  const port = Number(SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const from = ORDER_EMAIL_FROM || `${site.name} <${SMTP_USER}>`;
  const shopInbox = ORDER_EMAIL_TO || SMTP_USER;
  const forShop = renderOrderEmail({ order, audience: 'shop', origin });
  const forCustomer = renderOrderEmail({ order, audience: 'customer', origin });

  const [shop, buyer] = await Promise.allSettled([
    transport.sendMail({ from, to: shopInbox, replyTo: customer.email, ...forShop }),
    transport.sendMail({ from, to: customer.email, replyTo: shopInbox, ...forCustomer }),
  ]);

  if (shop.status === 'rejected') console.error('Order email to shop failed:', shop.reason?.message);
  if (buyer.status === 'rejected') console.error('Order email to customer failed:', buyer.reason?.message);

  if (shop.status === 'rejected' && buyer.status === 'rejected') {
    return json({ ok: false, error: 'The order emails could not be sent.' }, 502);
  }

  return json({ ok: true, emailed: { shop: shop.status === 'fulfilled', customer: buyer.status === 'fulfilled' } });
}
