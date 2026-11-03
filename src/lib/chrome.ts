// Shared page chrome taken from the home page markup, with real links filled in.
import home from '../components/home.html?raw';

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
export const base = BASE;
export const url = (p: string) => BASE + p.replace(/^\/+/, '');

/** Prefix a relative asset path (img/...) with the site base so it works on every page. */
export const asset = (p?: string) => (!p ? '' : /^(https?:)?\/\//.test(p) ? p : url(p));

export function header(active?: 'lablog'): string {
  let h = (home.match(/<header[\s\S]*?<\/header>/) || [''])[0];
  h = h.replace(/<a class="hlogo" href="[^"]*"/, `<a class="hlogo" href="${BASE}"`);
  h = h.replace(/<img src="img\//g, `<img src="${BASE}img/`);
  h = h.replace('<a class="hc" href="#">Lab log',
    `<a class="hc${active === 'lablog' ? ' hc-on' : ''}" href="${url('lablog/')}"${active === 'lablog' ? ' aria-current="page"' : ''}>Lab log`);
  return h;
}

export function footer(): string {
  let f = (home.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  return f.replace(/src="img\//g, `src="${BASE}img/`);
}

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Plain-text teaser from Markdown. */
export function teaser(md: string, n = 170): string {
  const t = md.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + ' …' : t;
}

export const ym = (d: Date) => d.toISOString().slice(0, 7);
export const ymd = (d: Date) => d.toISOString().slice(0, 10);
