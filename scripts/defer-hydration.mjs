// Post-build step: let the page paint before React loads and hydrates.
//
// Next.js puts its JavaScript in <script async> tags in the <head>, so the framework is
// downloaded and executed in competition with the first paint. This script edits the
// prerendered HTML so those files are requested only once the first frame has been painted,
// or immediately on the visitor's first tap / key press / scroll, whichever comes first.
// The page content and its links work before that (it is all server-rendered HTML).
//
// Effect: the hero image (the LCP element) gets the network and the main thread to itself, so
// it paints sooner, especially on slow phones and connections.
// Trade-off: the page becomes interactive a moment later, because the scripts start
// downloading after the first paint instead of alongside it. Pass --preload to download them
// in parallel again (hydration then starts right after paint, but they compete with the hero).
//
// It is safe to remove: use `npm run build:plain` to build without it.
// If a future Next.js version changes its markup, this script simply finds nothing to do.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');

const SCRIPT = /<script src="(\/_next\/static\/chunks\/[^"]+\.js)"(?: id="([^"]*)")? async=""><\/script>/g;
const MARKER = 'data-defer-hydration';
const preload = process.argv.includes('--preload');

const loader = (scripts) =>
  `<script ${MARKER}="">(function(){var s=${JSON.stringify(scripts)},done=0,timer;` +
  `function go(){if(done)return;done=1;clearTimeout(timer);for(var i=0;i<s.length;i++){var e=document.createElement("script");e.src=s[i][0];if(s[i][1])e.id=s[i][1];e.async=true;document.head.appendChild(e)}}` +
  `function painted(){requestAnimationFrame(function(){setTimeout(go,0)})}` +
  `if(document.visibilityState!=="visible"){go();return}` +
  `["largest-contentful-paint","paint"].forEach(function(type){try{new PerformanceObserver(function(list,o){o.disconnect();painted()}).observe({type:type,buffered:true})}catch(e){}});` +
  `timer=setTimeout(go,2500);` +
  `["pointerdown","keydown","touchstart","wheel"].forEach(function(n){addEventListener(n,go,{once:true,passive:true,capture:true})});` +
  `document.addEventListener("visibilitychange",go,{once:true})})()</script>`;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

let changed = 0;
let skipped = 0;

for await (const file of htmlFiles(appDir)) {
  const html = await readFile(file, 'utf8');
  if (html.includes(MARKER)) {
    skipped++;
    continue;
  }

  const scripts = [];
  let first = -1;
  const stripped = html.replace(SCRIPT, (match, src, id, offset) => {
    if (first === -1) first = offset;
    scripts.push([src, id || '']);
    return '';
  });

  if (scripts.length === 0) {
    skipped++;
    continue;
  }

  const preloads = preload ? scripts.map(([src]) => `<link rel="preload" as="script" fetchPriority="low" href="${src}"/>`).join('') : '';
  const output = stripped.slice(0, first) + preloads + loader(scripts) + stripped.slice(first);
  await writeFile(file, output);
  changed++;
}

console.log(`defer-hydration: ${changed} pages updated${skipped ? `, ${skipped} left as they were` : ''}`);
if (changed === 0) console.warn('defer-hydration: no <script async> tags found. Next.js may have changed its markup; pages were left untouched.');
