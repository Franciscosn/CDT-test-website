# CDT CASCADE Detector Technologies – test website

Test version of the new company website, built with [Astro](https://astro.build) and published with GitHub Pages.
For now it contains only the home page; the menu and product links do not lead anywhere yet.

## Where things are

| What | File |
|---|---|
| Page frame (head, fonts, scripts) | `src/pages/index.astro` |
| Home page markup | `src/components/home.html` |
| Styles | `public/css/home.css` |
| Neutron events, image changer, cursor | `public/js/home.js` |
| Products and their images | `public/js/products.js` |
| Images | `public/img/` |

## Publishing

Every push to `main` builds the site and publishes it (`.github/workflows/deploy.yml`).
In the repository settings, *Pages → Build and deployment → Source* must be set to **GitHub Actions** once.

## Working locally

```
npm install
npm run dev      # preview at http://localhost:4321/CDT-test-website/
npm run build    # static files in dist/
```
