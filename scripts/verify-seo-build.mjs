import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../dist/frontend/browser/', import.meta.url);
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
assert(urls.length > 16, 'Sitemap must include API-backed pages');
const titles = new Set();
for (const url of urls) {
  const html = await readFile(new URL(`.${url.pathname}index.html`, root), 'utf8');
  const canonical = html.match(/<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="([^"]+)")[^>]*>/)?.[1];
  assert.equal(canonical, url.href, `Canonical mismatch: ${url.pathname}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one H1: ${url.pathname}`);
  assert(!/<meta\b(?=[^>]*name="robots")(?=[^>]*content="[^"]*noindex)/.test(html), `Indexable route has noindex: ${url.pathname}`);
  assert(!/href="\/product\/[^"]+\/"/.test(html), `Product router link has an empty final segment: ${url.pathname}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title, `Missing title: ${url.pathname}`);
  assert(!titles.has(title), `Duplicate title: ${url.pathname}`);
  titles.add(title);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  if (url.pathname === '/') {
    assert((html.match(/href="\/product\//g) || []).length >= 11, 'Home must expose product links before JavaScript');
  }
  if (url.pathname.startsWith('/product/')) {
    const product = schemas.find(data => data['@type'] === 'Product');
    assert(product?.name && product?.image?.length, `Missing product data: ${url.pathname}`);
    assert.equal(product.offers?.priceCurrency, 'XOF');
    assert(product.offers.price > 0, `Invalid price: ${url.pathname}`);
    assert.equal(product.url, url.href);
  }
  if (url.pathname.startsWith('/blog/') && url.pathname !== '/blog/') {
    assert(schemas.some(data => data['@type'] === 'BlogPosting'), `Missing article data: ${url.pathname}`);
  }
}
for (const path of ['panier/', 'precommande/']) {
  const html = await readFile(new URL(`${path}index.html`, root), 'utf8');
  assert(/<meta\b(?=[^>]*name="robots")(?=[^>]*content="noindex, follow")/.test(html), `Missing noindex: ${path}`);
}
console.log(`SEO verified: ${urls.length} prerendered pages, unique titles, canonical URLs, H1s, product/article JSON-LD, transactional noindex.`);
