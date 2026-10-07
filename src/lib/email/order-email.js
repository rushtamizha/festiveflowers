// Order emails: one for the customer ("thank you") and one for the shop ("new order").
//
// Email clients are far stricter than browsers, so this is deliberately old-school HTML:
// tables for layout, inline styles only, no JavaScript, system fonts as fallback.
// Everything typed by the customer is escaped before it goes into the markup.

import { site } from '../../config/site.js';
import { formatPrice } from '../format.js';
import { formatEventDate } from '../order.js';

const C = {
  brand: '#d81b66',
  brandDark: '#b8115a',
  brandTint: '#fff1f6',
  ink: '#0b0b0c',
  body: '#3d3d3d',
  muted: '#6f6f6f',
  line: '#e0e0e0',
  paper: '#f6f6f6',
  success: '#0f7134',
  successTint: '#e9f8ef',
};

const FONT = `'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const digits = (value) => String(value ?? '').replace(/\D/g, '');

/** A bulletproof pill button (works in Outlook too, where it falls back to a rectangle). */
const button = (href, label, { bg = C.brand, color = '#ffffff', border = bg } = {}) =>
  `<a href="${esc(href)}" style="display:inline-block;padding:14px 26px;border-radius:999px;background:${bg};border:1px solid ${border};color:${color};font-family:${FONT};font-size:14px;font-weight:700;line-height:1;text-decoration:none;">${label}</a>`;

const label = (text, color = C.muted) =>
  `<p style="margin:0 0 6px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${color};">${text}</p>`;

// Product photos go through the site's image optimiser: a small resized copy instead of the
// full-size original, in a format the email client accepts (it falls back to PNG/JPEG for
// clients such as Outlook that cannot show WebP or AVIF).
function emailImage(src, origin) {
  return `${origin}/_next/image?url=${encodeURIComponent(src)}&w=200&q=75`;
}

function itemRows(order, origin) {
  return order.items
    .map(
      (item, index) => `
      <tr>
        <td width="64" valign="top" style="padding:14px 0;${index ? `border-top:1px solid ${C.line};` : ''}">
          <img src="${esc(emailImage(item.image, origin))}" width="56" height="70" alt="" style="display:block;width:56px;height:70px;border-radius:10px;border:1px solid ${C.line};object-fit:cover;background:${C.paper};" />
        </td>
        <td valign="top" style="padding:14px 12px 14px 4px;${index ? `border-top:1px solid ${C.line};` : ''}">
          <p style="margin:0;font-family:${FONT};font-size:14px;font-weight:700;line-height:1.35;color:${C.ink};">${esc(item.name)}</p>
          <p style="margin:4px 0 0;font-family:${FONT};font-size:12px;color:${C.muted};">${item.qty} × ${formatPrice(item.price)}</p>
        </td>
        <td valign="top" align="right" style="padding:14px 0;white-space:nowrap;${index ? `border-top:1px solid ${C.line};` : ''}">
          <p style="margin:0;font-family:${FONT};font-size:14px;font-weight:700;color:${C.ink};">${formatPrice(item.price * item.qty)}</p>
        </td>
      </tr>`,
    )
    .join('');
}

function billRows(totals) {
  const row = (name, value, { color = C.body, strike = false } = {}) => `
      <tr>
        <td style="padding:5px 0;font-family:${FONT};font-size:13px;color:${C.muted};">${name}</td>
        <td align="right" style="padding:5px 0;font-family:${FONT};font-size:13px;font-weight:600;color:${color};${strike ? 'text-decoration:line-through;font-weight:400;' : ''}">${value}</td>
      </tr>`;

  return [
    totals.savings > 0 ? row('Total MRP', formatPrice(totals.mrpTotal), { color: C.muted, strike: true }) : '',
    totals.savings > 0 ? row('Discount', `− ${formatPrice(totals.savings)}`, { color: C.success }) : '',
    row('Item total', formatPrice(totals.subtotal)),
    totals.gstPercent > 0 ? row(`GST (${totals.gstPercent}%)`, formatPrice(totals.gst)) : '',
    row('Delivery', totals.delivery === 0 ? 'FREE' : formatPrice(totals.delivery), totals.delivery === 0 ? { color: C.success } : {}),
    `
      <tr>
        <td style="padding:12px 0 0;border-top:1px solid ${C.line};font-family:${FONT};font-size:15px;font-weight:700;color:${C.ink};">To pay</td>
        <td align="right" style="padding:12px 0 0;border-top:1px solid ${C.line};font-family:${FONT};font-size:22px;font-weight:700;letter-spacing:-0.5px;color:${C.brand};">${formatPrice(totals.total)}</td>
      </tr>`,
  ].join('');
}

function layout({ preheader, intro, body, origin }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${esc(site.name)}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

        <!-- Brand bar -->
        <tr>
          <td style="padding:0 8px 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:36px;height:36px;border-radius:12px;background:${C.brand};text-align:center;font-family:${FONT};font-size:18px;line-height:36px;color:#ffffff;">&#10047;</td>
                <td style="padding-left:10px;font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:-0.4px;color:${C.ink};">${esc(site.name)}<span style="color:${C.brand};">.</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#ffffff;border:1px solid ${C.line};border-radius:22px;overflow:hidden;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:${C.ink};background-image:radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);background-size:16px 16px;padding:34px 32px 30px;border-radius:21px 21px 0 0;">
                  ${intro}
                </td>
              </tr>
              <tr>
                <td style="height:4px;line-height:4px;font-size:0;background:${C.brand};">&nbsp;</td>
              </tr>
              ${body}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:22px 16px 6px;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">
            ${esc(site.name)} · Fresh flowers, handcrafted to order<br />
            <a href="${esc(origin)}" style="color:${C.brandDark};font-weight:700;text-decoration:none;">${esc(origin.replace(/^https?:\/\//, ''))}</a>
            ${site.phone ? ` · ${esc(site.phone)}` : ''}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

const section = (content, { tint = false } = {}) =>
  `<tr><td style="padding:26px 32px;${tint ? `background:${C.paper};` : ''}border-top:1px solid ${C.line};">${content}</td></tr>`;

function details(order) {
  const c = order.customer;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="top" width="58%" style="padding-right:16px;">
          ${label('Deliver to')}
          <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.55;color:${C.body};">
            <strong style="color:${C.ink};">${esc(c.name)}</strong><br />
            ${esc(c.address)}<br />
            ${esc(c.city)} – ${esc(c.pincode)}
          </p>
        </td>
        <td valign="top" width="42%">
          ${label('Function date')}
          <p style="margin:0 0 14px;font-family:${FONT};font-size:14px;font-weight:700;line-height:1.4;color:${C.ink};">${esc(formatEventDate(c.eventDate))}</p>
          ${label('Phone')}
          <p style="margin:0;font-family:${FONT};font-size:14px;color:${C.body};">${esc(c.phone)}</p>
        </td>
      </tr>
    </table>
    ${
      c.notes
        ? `<div style="margin-top:18px;padding:12px 14px;border-radius:12px;background:${C.brandTint};border:1px solid #ffc8dd;font-family:${FONT};font-size:13px;line-height:1.55;color:#6d0d3a;"><strong>Note:</strong> ${esc(c.notes)}</div>`
        : ''
    }`;
}

function orderBlock(order, origin, heading = 'Your items') {
  return (
    section(`
      ${label(`${heading} (${order.totals.count})`)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${itemRows(order, origin)}</table>`) +
    section(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${billRows(order.totals)}</table>`,
      { tint: true },
    ) +
    section(details(order))
  );
}

function plainText(order, heading) {
  const t = order.totals;
  const c = order.customer;
  return [
    heading,
    '',
    ...order.items.map((i) => `${i.qty} x ${i.name} — ${formatPrice(i.price * i.qty)}`),
    '',
    `Item total: ${formatPrice(t.subtotal)}`,
    t.gstPercent > 0 ? `GST (${t.gstPercent}%): ${formatPrice(t.gst)}` : null,
    `Delivery: ${t.delivery === 0 ? 'FREE' : formatPrice(t.delivery)}`,
    `To pay: ${formatPrice(t.total)}`,
    '',
    `${c.name}, ${c.phone}`,
    `${c.address}, ${c.city} - ${c.pincode}`,
    `Function date: ${formatEventDate(c.eventDate)}`,
    c.notes ? `Notes: ${c.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

/**
 * @param {{ order: object, audience: 'customer' | 'shop', origin: string }} input
 * @returns {{ subject: string, html: string, text: string }}
 */
export function renderOrderEmail({ order, audience, origin }) {
  const c = order.customer;
  const firstName = esc(c.name.trim().split(/\s+/)[0]);
  const total = formatPrice(order.total);
  const pill = `<span style="display:inline-block;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.4px;color:#ffffff;">Order ${esc(order.id)}</span>`;

  if (audience === 'shop') {
    const wa = `https://wa.me/${digits(c.phone).length === 10 ? `91${digits(c.phone)}` : digits(c.phone)}?text=${encodeURIComponent(`Hello ${c.name}, thank you for your order ${order.id} with ${site.name}.`)}`;
    const intro = `
      ${label('New order received', '#ff9dc1')}
      <h1 style="margin:0 0 14px;font-family:${FONT};font-size:30px;line-height:1.12;font-weight:700;letter-spacing:-0.9px;color:#ffffff;">${esc(c.name)} · ${total}</h1>
      ${pill}
      <p style="margin:16px 0 0;font-family:${FONT};font-size:14px;line-height:1.55;color:rgba(255,255,255,0.72);">For <strong style="color:#ffffff;">${esc(formatEventDate(c.eventDate))}</strong> in ${esc(c.city)}. Confirm availability and delivery time with the customer.</p>`;

    const actions = section(`
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:0 8px 8px 0;">${button(wa, 'Reply on WhatsApp')}</td>
          <td style="padding:0 8px 8px 0;">${button(`tel:${digits(c.phone)}`, `Call ${esc(c.phone)}`, { bg: '#ffffff', color: C.ink, border: C.line })}</td>
        </tr>
      </table>
      <p style="margin:6px 0 0;font-family:${FONT};font-size:13px;color:${C.muted};">Customer email: <a href="mailto:${esc(c.email)}" style="color:${C.brandDark};font-weight:700;text-decoration:none;">${esc(c.email)}</a></p>`);

    return {
      subject: `New order ${order.id} · ${total} · ${c.name}`,
      html: layout({
        origin,
        preheader: `${c.name} ordered ${order.totals.count} item${order.totals.count === 1 ? '' : 's'} for ${formatEventDate(c.eventDate)}.`,
        intro,
        body: actions + orderBlock(order, origin, 'Items ordered'),
      }),
      text: plainText(order, `New order ${order.id} from ${c.name} (${c.email})`),
    };
  }

  const intro = `
      ${label('Order received', '#ff9dc1')}
      <h1 style="margin:0 0 14px;font-family:${FONT};font-size:32px;line-height:1.1;font-weight:700;letter-spacing:-1px;color:#ffffff;">Thank you, ${firstName}.</h1>
      ${pill}
      <p style="margin:16px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:rgba(255,255,255,0.72);">We have your order for <strong style="color:#ffffff;">${esc(formatEventDate(c.eventDate))}</strong>. We will confirm availability, delivery time and payment with you shortly. Nothing is charged online.</p>`;

  const steps = [
    ['We confirm', 'We check the flowers for your date and confirm by phone or WhatsApp.'],
    ['We craft it fresh', 'Your flowers are bought that morning and strung by hand to order.'],
    ['Delivered to you', 'Packed cool and delivered in time for the ceremony.'],
  ];
  const next = section(
    `${label('What happens next')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${steps
        .map(
          ([title, text], index) => `
      <tr>
        <td width="40" valign="top" style="padding:8px 0;">
          <div style="width:28px;height:28px;border-radius:999px;background:${C.brand};font-family:${FONT};font-size:13px;font-weight:700;line-height:28px;text-align:center;color:#ffffff;">${index + 1}</div>
        </td>
        <td valign="top" style="padding:8px 0;font-family:${FONT};font-size:13px;line-height:1.55;color:${C.muted};">
          <strong style="display:block;font-size:14px;color:${C.ink};">${title}</strong>${text}
        </td>
      </tr>`,
        )
        .join('')}
    </table>`,
    { tint: true },
  );

  const hasWa = site.whatsapp && !/0{8}/.test(site.whatsapp);
  const help = section(`
      <p style="margin:0 0 14px;font-family:${FONT};font-size:14px;line-height:1.55;color:${C.body};">Need to change something? Reply to this email or reach us directly.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${hasWa ? `<td style="padding:0 8px 8px 0;">${button(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello ${site.name}, about my order ${order.id}`)}`, 'Chat on WhatsApp')}</td>` : ''}
          <td style="padding:0 8px 8px 0;">${button(`${origin}/shop`, 'Continue shopping', { bg: '#ffffff', color: C.ink, border: C.line })}</td>
        </tr>
      </table>`);

  return {
    subject: `Your order ${order.id} is received — ${site.name}`,
    html: layout({
      origin,
      preheader: `We have your order for ${formatEventDate(c.eventDate)}. Total ${total}.`,
      intro,
      body: orderBlock(order, origin) + next + help,
    }),
    text: plainText(order, `Thank you, ${c.name.trim().split(/\s+/)[0]}. Your order ${order.id} with ${site.name} is received.`),
  };
}
