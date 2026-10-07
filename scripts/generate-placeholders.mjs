// Generates illustrated placeholder images for banners, categories, services and products,
// so the site looks complete before real photography is added.
//
//   npm run placeholders            → creates only the images that are missing
//   npm run placeholders -- --force → regenerates banners, services and icons (overwrites!)
//                                      Product and category photos that exist are never replaced.
//   npm run placeholders -- --brand → regenerates only banners, share image and icons
//
// Your own photos are never overwritten unless you pass --force.

import sharp from 'sharp';
import { mkdir, access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../src/data/products.js';
import { categories, categoryImage } from '../src/data/categories.js';
import { services, banners } from '../src/data/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Image paths in the data carry a ?v= cache-busting suffix; strip it to get the file on disk.
const pub = (p) => path.join(root, 'public', decodeURIComponent(p.split('?')[0]));
const force = process.argv.includes('--force');
// --brand regenerates only the banners, share image and app icons (use after changing colours or type).
const brandArt = process.argv.includes('--brand');

const W = 1000;
const H = 1250;

/* ------------------------------ helpers ------------------------------ */

function hash(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function rng(seed) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Number(n.toFixed(1));
const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

const PAL = {
  redRose: { colors: ['#c8173f', '#e0395c', '#a30f33'], center: '#7d0a26', petals: 7 },
  pinkRose: { colors: ['#f06aa6', '#f78fbd', '#e24d92'], center: '#c2337a', petals: 7 },
  blush: { colors: ['#fbd0df', '#fde4ec', '#f7b6cd'], center: '#f08fb3', petals: 7 },
  white: { colors: ['#fffdf8', '#fff8ea', '#f6efe0'], center: '#f1d98a', petals: 6, light: true },
  marigold: { colors: ['#f59e0b', '#fbb424', '#f2800d'], center: '#d96a06', petals: 10 },
  lotus: { colors: ['#f7a1c4', '#fbc4da', '#ee7fae'], center: '#f6d36b', petals: 9 },
  orchid: { colors: ['#a24bdc', '#c07bee', '#8a2fc4'], center: '#fbe38a', petals: 5 },
  whiteOrchid: { colors: ['#ffffff', '#fbf5ff', '#f3e9fb'], center: '#b05fd8', petals: 5, light: true },
  carnation: { colors: ['#e11d58', '#f45c86', '#f98fad'], center: '#b81046', petals: 11 },
  orange: { colors: ['#fb8a3c', '#f9731a', '#fdb274'], center: '#d95a0b', petals: 5 },
  yellow: { colors: ['#fde047', '#facc15', '#fef08a'], center: '#e3a008', petals: 12 },
  green: { colors: ['#5c8f4e', '#7aa868', '#48773d'], center: '#3c6332', petals: 4 },
  gold: { colors: ['#d9b55a', '#eccd7f', '#c59d3f'], center: '#a57f25', petals: 8 },
};

function paletteFor(name) {
  const n = name.toLowerCase();
  if (n.includes('white orchid')) return PAL.whiteOrchid;
  if (n.includes('orchid')) return PAL.orchid;
  if (n.includes('red rose')) return PAL.redRose;
  if (n.includes('blush')) return PAL.blush;
  if (n.includes('white rose') || n.includes('white lotus') || n.includes('lily')) return PAL.white;
  if (n.includes('pink rose')) return PAL.pinkRose;
  if (n.includes('lotus')) return PAL.lotus;
  if (n.includes('jasmine') || n.includes('mullai') || n.includes('tuberose') || n.includes('baby')) return PAL.white;
  if (n.includes('marigold')) return PAL.marigold;
  if (n.includes('carnation')) return PAL.carnation;
  if (n.includes('kanakambaram')) return PAL.orange;
  if (n.includes('chrysanthemum')) return PAL.yellow;
  if (n.includes('gold')) return PAL.gold;
  if (n.includes('tulsi') || n.includes('leaf')) return PAL.green;
  return PAL.pinkRose;
}

const BACKDROPS = {
  blush: ['#fff7fa', '#fbd0df'],
  cream: ['#fffbf3', '#f2dfc0'],
  sage: ['#f6faf3', '#d3e2c9'],
  rose: ['#fce3ec', '#ee9fbe'],
  wine: ['#9b1d5b', '#4f0a2e'],
};

/* ------------------------------ drawing ------------------------------ */

function flower(x, y, r, pal, rnd) {
  const rot = f(rnd() * 360);
  const outer = pick(pal.colors, rnd);
  const inner = pick(pal.colors, rnd);
  const n = pal.petals;
  const step = 360 / n;
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})" stroke="#3a0620" stroke-opacity=".07" stroke-width="1">`;
  for (let i = 0; i < n; i++) {
    s += `<ellipse cy="${f(-r * 0.52)}" rx="${f(r * 0.36)}" ry="${f(r * 0.52)}" fill="${outer}" transform="rotate(${f(i * step)})"/>`;
  }
  for (let i = 0; i < n; i++) {
    s += `<ellipse cy="${f(-r * 0.28)}" rx="${f(r * 0.22)}" ry="${f(r * 0.3)}" fill="${inner}" transform="rotate(${f(i * step + step / 2)})"/>`;
  }
  return `${s}<circle r="${f(r * 0.15)}" fill="${pal.center}" stroke="none"/></g>`;
}

function leaf(x, y, r, rnd) {
  return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.4)}" fill="${pick(PAL.green.colors, rnd)}" transform="rotate(${f(rnd() * 360)} ${f(x)} ${f(y)})"/>`;
}

function choosePal(pals, t, band, rnd) {
  if (pals.length === 1) return pals[0];
  if (band && Math.floor(t * band * 2) % 4 === 3) return pals[1];
  const roll = rnd();
  if (pals.length > 2 && roll > 0.9) return pals[2];
  if (!band && roll > 0.62) return pals[1];
  return pals[0];
}

// Flowers scattered along a path. `fn(t)` returns [x, y] for t in 0..1.
function strand(fn, { count, size, spread, pals, rnd, band = 0, leaves = 0.12 }) {
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const [x, y] = fn(t);
    pts.push([x + (rnd() - 0.5) * spread, y + (rnd() - 0.5) * spread, t]);
  }
  let out = '';
  for (const [x, y] of pts) {
    if (rnd() < leaves) out += leaf(x + (rnd() - 0.5) * size * 2, y + (rnd() - 0.5) * size * 2, size, rnd);
  }
  for (const [x, y, t] of pts) {
    out += flower(x, y, size * (0.8 + rnd() * 0.4), choosePal(pals, t, band, rnd), rnd);
  }
  return out;
}

const uCurve = (cx, top, rx, ry) => (t) => {
  const a = -Math.PI / 2 + Math.PI * t;
  return [cx + rx * Math.sin(a), top + ry * Math.cos(a)];
};

function cluster(cx, cy, R, n, size, pals, rnd, withLeaves = true) {
  let out = '';
  if (withLeaves) {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      out += leaf(cx + Math.cos(a) * R * 0.98, cy + Math.sin(a) * R * 0.98, size * 1.1, rnd);
    }
  }
  const pts = [];
  for (let k = 0; k < n; k++) {
    const r = R * Math.sqrt((k + 0.5) / n);
    const a = k * 2.39996;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  // draw the rim first so the centre sits on top
  for (const [x, y] of pts.reverse()) {
    out += flower(x, y, size * (0.85 + rnd() * 0.3), choosePal(pals, rnd(), 0, rnd), rnd);
  }
  return out;
}

function tassels(cx, y, rnd, pals) {
  let out = '';
  for (const dx of [-46, 0, 46]) {
    const len = 120 + rnd() * 50;
    out += `<line x1="${cx + dx}" y1="${y}" x2="${cx + dx}" y2="${f(y + len)}" stroke="#c59d3f" stroke-width="5"/>`;
    out += flower(cx + dx, y + len, 30, pals[pals.length > 1 ? 1 : 0], rnd);
    out += `<circle cx="${cx + dx}" cy="${f(y + len + 40)}" r="12" fill="#d9b55a"/>`;
  }
  return out;
}

function garland(cx, top, rx, ry, size, pals, rnd, { pendant = true } = {}) {
  let out = '';
  const count = Math.round((rx + ry * 2) / (size * 0.36));
  // sides rising out of frame, as if worn around the neck
  for (const side of [-1, 1]) {
    out += strand((t) => [cx + side * rx, -40 + t * (top + 40)], {
      count: Math.round((top + 40) / (size * 0.4)),
      size,
      spread: size * 1.05,
      pals,
      rnd,
      band: 2,
    });
  }
  out += strand(uCurve(cx, top, rx, ry), { count, size, spread: size * 1.05, pals, rnd, band: 7 });
  if (pendant) {
    out += tassels(cx, top + ry + size * 1.6, rnd, pals);
    out += cluster(cx, top + ry + size * 0.4, size * 1.9, 9, size * 1.25, pals.length > 1 ? [pals[1], pals[0]] : pals, rnd, false);
  }
  return out;
}

/* ---------------------------- compositions ---------------------------- */

const comps = {
  hang: ({ pals, rnd }) => garland(500, 150, 300, 760, 44, pals, rnd),

  pair: ({ pals, rnd }) =>
    garland(285, 170, 165, 640, 31, pals, rnd) + garland(715, 170, 165, 640, 31, pals, rnd),

  closeup: ({ pals, rnd }) => {
    let out = '';
    const r = 96;
    let row = 0;
    for (let y = -r; y < H + r; y += r * 1.42, row++) {
      for (let x = -r + (row % 2 ? r * 0.82 : 0); x < W + r; x += r * 1.64) {
        if (rnd() < 0.35) out += leaf(x + r * 0.8, y + r * 0.7, r * 0.8, rnd);
      }
    }
    row = 0;
    for (let y = -r; y < H + r; y += r * 1.42, row++) {
      for (let x = -r + (row % 2 ? r * 0.82 : 0); x < W + r; x += r * 1.64) {
        const t = ((x + y) / 520) % 1;
        const pal = pals.length > 1 && t > 0.62 ? pals[1 + (Math.floor((x + y) / 520) % (pals.length - 1))] : pals[0];
        out += flower(x + (rnd() - 0.5) * 30, y + (rnd() - 0.5) * 30, r * (0.92 + rnd() * 0.25), pal, rnd);
      }
    }
    return out;
  },

  wreath: ({ pals, rnd }) => {
    let out = '';
    for (let i = 0; i < 34; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      if (Math.hypot(x - 500, y - 610) < 400) continue;
      out += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="16" ry="9" fill="${pick(pals[0].colors, rnd)}" opacity=".85" transform="rotate(${f(rnd() * 360)} ${f(x)} ${f(y)})"/>`;
    }
    out += strand((t) => [500 + 300 * Math.cos(t * Math.PI * 2), 610 + 300 * Math.sin(t * Math.PI * 2)], {
      count: 120,
      size: 44,
      spread: 52,
      pals,
      rnd,
      band: 6,
      leaves: 0.2,
    });
    return out;
  },

  dome: ({ pals, rnd }) => cluster(500, 625, 410, 90, 66, pals, rnd),

  bouquet: ({ pals, rnd }) => {
    let out = '';
    for (const dx of [-34, -12, 12, 34]) {
      out += `<line x1="${500 + dx}" y1="1050" x2="${500 + dx * 1.5}" y2="1190" stroke="#5c8f4e" stroke-width="12" stroke-linecap="round"/>`;
    }
    out += `<path d="M225 520 L775 520 L585 1085 L415 1085 Z" fill="#f9dbe6"/>`;
    out += `<path d="M225 520 L500 700 L415 1085 Z" fill="#f4c5d6"/><path d="M775 520 L500 700 L585 1085 Z" fill="#fbe7ee"/>`;
    out += cluster(500, 430, 300, 64, 56, pals, rnd);
    out += `<g fill="#b8115a"><ellipse cx="440" cy="925" rx="66" ry="30" transform="rotate(-18 440 925)"/><ellipse cx="560" cy="925" rx="66" ry="30" transform="rotate(18 560 925)"/><circle cx="500" cy="930" r="24"/><path d="M490 945 L455 1060 L485 1045 Z"/><path d="M510 945 L545 1060 L515 1045 Z"/></g>`;
    return out;
  },

  strings: ({ pals, rnd }) => {
    let out = '';
    for (let j = 0; j < 6; j++) {
      const y0 = 190 + j * 165;
      const fn = (t) => [-40 + t * (W + 80), y0 + 80 * Math.sin(Math.PI * t)];
      out += strand(fn, { count: 44, size: 30, spread: 12, pals: [pals[j % pals.length]], rnd, leaves: 0 });
    }
    return out;
  },

  braid: ({ pals, rnd }) => {
    let out = '';
    out += tassels(500, 1010, rnd, pals);
    for (const off of [-78, 0, 78]) {
      out += strand((t) => [500 + off * (1 - 0.5 * t) + 16 * Math.sin(t * 16), 230 + t * 790], {
        count: 60,
        size: 38,
        spread: 22,
        pals,
        rnd,
        band: 6,
        leaves: 0,
      });
    }
    out += cluster(500, 190, 135, 22, 44, pals.length > 1 ? [pals[1], pals[0]] : pals, rnd);
    return out;
  },

  jewel: ({ pals, rnd }) => {
    let out = '';
    const small = { pals, rnd, leaves: 0 };
    // maang tikka
    out += `<line x1="500" y1="40" x2="500" y2="150" stroke="#c59d3f" stroke-width="5"/>`;
    out += cluster(500, 170, 42, 6, 26, pals, rnd, false);
    // earrings
    for (const x of [175, 825]) {
      out += cluster(x, 170, 46, 7, 26, pals, rnd, false);
      out += `<line x1="${x}" y1="205" x2="${x}" y2="275" stroke="#c59d3f" stroke-width="5"/>`;
      out += flower(x, 290, 26, pals[pals.length > 1 ? 1 : 0], rnd);
    }
    // long haar and necklace
    out += strand(uCurve(500, 330, 330, 560), { ...small, count: 110, size: 22, spread: 8, band: 9 });
    out += flower(500, 905, 46, pals[0], rnd);
    out += strand(uCurve(500, 330, 215, 330), { ...small, count: 70, size: 27, spread: 9, band: 5 });
    out += flower(500, 672, 40, pals[pals.length > 1 ? 1 : 0], rnd);
    // bangles
    for (const x of [185, 815]) {
      out += strand((t) => [x + 82 * Math.cos(t * Math.PI * 2), 1075 + 82 * Math.sin(t * Math.PI * 2)], {
        ...small,
        count: 30,
        size: 21,
        spread: 6,
        band: 3,
      });
    }
    return out;
  },

  car: ({ pals, rnd }) => {
    let out = '';
    out += `<path d="M90 1300 V760 Q90 560 290 530 L710 530 Q910 560 910 760 V1300 Z" fill="#ffffff" opacity=".6"/>`;
    out += `<path d="M225 530 Q500 300 775 530" fill="#ffffff" opacity=".35"/>`;
    out += `<path d="M225 530 Q500 300 775 530" fill="none" stroke="#ffffff" stroke-width="16" opacity=".8"/>`;
    out += `<g stroke="#f7b6cd" stroke-width="18" stroke-linecap="round" fill="none"><path d="M215 560 L500 1040"/><path d="M785 560 L500 1040"/></g>`;
    out += cluster(215, 560, 62, 9, 36, pals, rnd);
    out += cluster(785, 560, 62, 9, 36, pals, rnd);
    out += cluster(500, 880, 190, 34, 56, pals, rnd);
    return out;
  },

  money: ({ pals, rnd }) => {
    let out = '';
    const curve = uCurve(500, 150, 300, 760);
    for (let i = 1; i < 14; i++) {
      const t = i / 14;
      const [x, y] = curve(t);
      const a = -Math.PI / 2 + Math.PI * t;
      const nx = Math.sin(a);
      const ny = Math.cos(a) * (760 / 300);
      const len = Math.hypot(nx, ny);
      const ox = x + (nx / len) * 78;
      const oy = y + (ny / len) * 78;
      const deg = f((Math.atan2(ny, nx) * 180) / Math.PI);
      out += `<g transform="translate(${f(ox)} ${f(oy)}) rotate(${deg})"><rect x="-82" y="-40" width="164" height="80" rx="6" fill="#dff0dc" stroke="#6aa36a" stroke-width="4"/><ellipse rx="30" ry="24" fill="none" stroke="#6aa36a" stroke-width="4"/><rect x="-70" y="-28" width="140" height="56" rx="3" fill="none" stroke="#9cc79c" stroke-width="2"/></g>`;
    }
    return out + garland(500, 150, 300, 760, 38, pals, rnd);
  },
};

const VARIANTS = {
  garland: ['hang', 'closeup', 'pair', 'wreath'],
  braid: ['braid', 'closeup', 'wreath', 'strings'],
  bouquet: ['bouquet', 'closeup', 'dome', 'wreath'],
  car: ['car', 'closeup', 'dome', 'wreath'],
  strings: ['strings', 'closeup', 'wreath', 'hang'],
  jewel: ['jewel', 'closeup', 'dome', 'wreath'],
  money: ['money', 'closeup', 'pair', 'wreath'],
};

const DEFS = `<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dy="12" result="b"/><feFlood flood-color="#3a0620" flood-opacity=".26"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

function art(comp, pals, seed) {
  return `<g filter="url(#sh)">${comps[comp]({ pals, rnd: rng(seed) })}</g>`;
}

function backdropFor(pals, seed, comp) {
  if (pals[0].light) return comp === 'hang' || comp === 'pair' ? BACKDROPS.wine : BACKDROPS.rose;
  return BACKDROPS[['blush', 'cream', 'sage'][hash(seed) % 3]];
}

function portrait(comp, pals, seed) {
  const [inner, outer] = backdropFor(pals, seed, comp);
  const arch =
    comp === 'closeup'
      ? ''
      : `<path d="M130 ${H} V560 A370 370 0 0 1 870 560 V${H} Z" fill="#ffffff" opacity=".28"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${DEFS}<radialGradient id="bg" cx="50%" cy="36%" r="80%"><stop offset="0" stop-color="${inner}"/><stop offset="1" stop-color="${outer}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#bg)"/>${arch}${art(comp, pals, seed)}</svg>`;
}

/* ------------------------------- banners ------------------------------- */

const SANS = `'Avenir Next', 'Helvetica Neue', Helvetica, Arial, sans-serif`;

const BANNER_ART = [
  {
    bg: ['#e0246f', '#b8115a'],
    ink: '#ffffff',
    accent: '#ffd0e0',
    soft: '#ffe3ee',
    button: ['#ffffff', '#0b0b0c'],
    eyebrow: 'FRESH · HANDCRAFTED · MADE TO ORDER',
    lines: ['Wedding garlands', 'for your big day'],
    sub: 'Rose, jasmine, lotus and orchid, strung fresh.',
    cta: 'Shop garlands',
    comp: 'pair',
    pals: [PAL.redRose, PAL.white],
  },
  {
    bg: ['#1a1a1a', '#0b0b0c'],
    ink: '#ffffff',
    accent: '#fb6f9f',
    soft: '#c7c7c7',
    button: ['#d81b66', '#ffffff'],
    eyebrow: 'THE PREMIUM COLLECTION',
    lines: ['Orchid, lotus &', 'designer garlands'],
    sub: 'Statement pieces for receptions and temple weddings.',
    cta: 'Explore premium',
    comp: 'hang',
    pals: [PAL.orchid, PAL.whiteOrchid, PAL.gold],
  },
  {
    bg: ['#fff1f6', '#ffc8dd'],
    ink: '#0b0b0c',
    accent: '#b8115a',
    soft: '#5c5c5c',
    button: ['#0b0b0c', '#ffffff'],
    eyebrow: 'HALDI · MEHENDI · WEDDING DAY',
    lines: ['Bridal flowers &', 'floral jewellery'],
    sub: 'Poo jadai, veni and fresh flower jewellery sets.',
    cta: 'Shop bridal',
    comp: 'jewel',
    pals: [PAL.pinkRose, PAL.white, PAL.yellow],
  },
];

function bannerSvg(b, seed, mobile) {
  const w = mobile ? 1000 : 1920;
  const h = mobile ? 640 : 720;
  const tx = mobile ? 64 : 150;
  const big = mobile ? 76 : 100;
  const y0 = mobile ? 150 : 215;
  const artBox = mobile
    ? `<svg x="560" y="-10" width="520" height="650" viewBox="0 0 ${W} ${H}">${art(b.comp, b.pals, seed)}</svg>`
    : `<svg x="1120" y="-70" width="700" height="875" viewBox="0 0 ${W} ${H}">${art(b.comp, b.pals, seed)}</svg>`;
  const btnW = 300;
  const btnH = mobile ? 84 : 72;
  const btnY = y0 + big * 2 + (mobile ? 56 : 104);
  const circle = mobile
    ? `<circle cx="820" cy="320" r="330" fill="#ffffff" opacity=".12"/>`
    : `<circle cx="1470" cy="360" r="430" fill="#ffffff" opacity=".12"/><circle cx="1470" cy="360" r="330" fill="#ffffff" opacity=".1"/>`;
  const esc = (t) => t.replace('&', '&amp;');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${DEFS}<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.bg[0]}"/><stop offset="1" stop-color="${b.bg[1]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>${circle}${artBox}
<text x="${tx}" y="${y0}" font-family="${SANS}" font-size="22" font-weight="700" letter-spacing="${mobile ? 3 : 5}" fill="${b.accent}">${b.eyebrow}</text>
<text x="${tx}" y="${y0 + big + 6}" font-family="${SANS}" font-weight="700" font-size="${big}" letter-spacing="-2.5" fill="${b.ink}">${esc(b.lines[0])}</text>
<text x="${tx}" y="${y0 + big * 2 + 10}" font-family="${SANS}" font-weight="700" font-size="${big}" letter-spacing="-2.5" fill="${b.ink}">${esc(b.lines[1])}</text>
${mobile ? '' : `<text x="${tx}" y="${y0 + big * 2 + 70}" font-family="${SANS}" font-size="30" fill="${b.soft}">${b.sub}</text>`}
<rect x="${tx}" y="${btnY}" width="${btnW}" height="${btnH}" rx="${btnH / 2}" fill="${b.button[0]}"/>
<text x="${tx + btnW / 2}" y="${btnY + btnH / 2 + 10}" text-anchor="middle" font-family="${SANS}" font-size="${mobile ? 30 : 26}" font-weight="700" fill="${b.button[1]}">${b.cta}</text>
</svg>`;
}

/* -------------------------------- output -------------------------------- */

let made = 0;
let skipped = 0;

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function render(svg, file, { width, height, format = 'webp', quality = 80, overwrite = false }) {
  if (!force && !overwrite && (await exists(file))) {
    skipped++;
    return;
  }
  await mkdir(path.dirname(file), { recursive: true });
  let img = sharp(Buffer.from(svg)).resize(width, height, { fit: 'cover' });
  if (format === 'webp') img = img.webp({ quality, effort: 5 });
  if (format === 'jpg') img = img.jpeg({ quality, mozjpeg: true });
  if (format === 'png') img = img.png({ compressionLevel: 9 });
  await img.toFile(file);
  made++;
}

const kindOf = Object.fromEntries(categories.map((c) => [c.slug, c.kind]));

// Products: a placeholder only where a product's photo file does not exist yet. Real photos
// are never touched, not even with --force.
for (const p of products) {
  const pals = p.flowers.map(paletteFor);
  const variants = VARIANTS[kindOf[p.categorySlug]];
  for (const [i, src] of p.images.entries()) {
    if (/^https?:/.test(src) || (await exists(pub(src)))) continue;
    await render(portrait(variants[i % variants.length], pals, `${p.slug}-${i}`), pub(src), { width: 800, height: 1000, quality: 78 });
  }
}

// Categories: the lead view of the category's first product, on its own seed
for (const c of categories) {
  const src = categoryImage(c.slug);
  if (/^https?:/.test(src) || (await exists(pub(src)))) continue; // has a real photo: never touched
  const first = products.find((p) => p.categorySlug === c.slug);
  const pals = first.flowers.map(paletteFor);
  await render(portrait(VARIANTS[c.kind][0], pals, `category-${c.slug}`), pub(src), { width: 640, height: 800, quality: 78 });
}

// Services
const SERVICE_ART = [
  ['pair', [PAL.redRose, PAL.white]],
  ['braid', [PAL.white, PAL.pinkRose]],
  ['car', [PAL.pinkRose, PAL.white]],
  ['hang', [PAL.marigold, PAL.green]],
  ['bouquet', [PAL.blush, PAL.pinkRose, PAL.white]],
  ['strings', [PAL.white, PAL.orange, PAL.yellow]],
];
for (const [i, s] of services.entries()) {
  const [comp, pals] = SERVICE_ART[i % SERVICE_ART.length];
  await render(portrait(comp, pals, `service-${s.id}`), pub(s.image), { width: 720, height: 900, quality: 78 });
}

// Banners
for (const [i, b] of banners.entries()) {
  const a = BANNER_ART[i % BANNER_ART.length];
  await render(bannerSvg(a, b.id, false), pub(b.desktop), { width: 1920, height: 720, quality: 82, overwrite: brandArt });
  await render(bannerSvg(a, b.id, true), pub(b.mobile), { width: 1000, height: 640, quality: 82, overwrite: brandArt });
}

// Social share image and app icons
await render(bannerSvg(BANNER_ART[0], 'og', false), pub('/og.jpg'), { width: 1200, height: 630, format: 'jpg', quality: 84, overwrite: brandArt });

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#d81b66"/><g transform="translate(32 32)" fill="#fff5f8">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cy="-13" rx="8.5" ry="13" transform="rotate(${a})"/>`).join('')}<circle r="6.5" fill="#d81b66"/></g></svg>`;
if (force || brandArt || !(await exists(path.join(root, 'src/app/icon.svg')))) {
  await writeFile(path.join(root, 'src/app/icon.svg'), iconSvg);
}
await render(iconSvg, path.join(root, 'src/app/apple-icon.png'), { width: 180, height: 180, format: 'png', overwrite: brandArt });
await render(iconSvg, pub('/icon-192.png'), { width: 192, height: 192, format: 'png', overwrite: brandArt });
await render(iconSvg, pub('/icon-512.png'), { width: 512, height: 512, format: 'png', overwrite: brandArt });

console.log(`Placeholders: ${made} created, ${skipped} already present${force ? '' : ' (use --force to regenerate)'}`);
