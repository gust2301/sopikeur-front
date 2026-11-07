import { writeFile } from 'node:fs/promises';

const origin = 'https://sopikeur.sn';
const api = 'https://api.sopikeur.sn/api/v1';
const staticRoutes = [
  '/', '/spc/', '/panneaux/', '/inspirations/', '/blog/', '/contact/', '/devis/',
  '/guide-installation-panneaux/', '/guide-installation-spc/', '/faq/',
  '/notre-equipe/', '/nos-valeurs/', '/engagement-qualite/', '/cgv/',
  '/mentions-legales/', '/confidentialite/',
];

async function get(path) {
  const response = await fetch(`${api}${path}`, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`SEO discovery ${path}: HTTP ${response.status}`);
  return response.json();
}

async function products(type) {
  const results = [];
  for (let page = 1; page <= 100; page++) {
    const response = await get(`/products?type=${type}&page=${page}&size=100`);
    const items = Array.isArray(response) ? response : response.products ?? response.items ?? response.data;
    if (!Array.isArray(items)) throw new Error('Unexpected product API shape');
    results.push(...items);
    if (items.length < 100 || (typeof response.total === 'number' && results.length >= response.total)) return results;
  }
  throw new Error('Product pagination did not terminate');
}

// Fail before writing anything if discovery fails; never silently publish a partial sitemap.
const [spc, panels, articles] = await Promise.all([products('SPC'), products('PANEL'), get('/articles')]);
if (!Array.isArray(articles)) throw new Error('Unexpected articles API shape');
const segment = value => {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Missing SEO slug');
  return encodeURIComponent(value);
};
const dynamicRoutes = [
  ...spc.map(product => `/product/spc/${segment(product.slug)}/`),
  ...panels.map(product => `/product/acoustic/${segment(product.slug)}/`),
  ...articles.map(article => `/blog/${segment(article.slug)}/`),
];
const routes = [...new Set([...staticRoutes, ...dynamicRoutes])];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('../src/sitemap.xml', import.meta.url), xml);
await writeFile(new URL('../prerender-routes.txt', import.meta.url), routes.join('\n') + '\n');
console.log(`SEO: ${routes.length} URLs (${dynamicRoutes.length} product/article pages) in sitemap and prerender routes.`);
