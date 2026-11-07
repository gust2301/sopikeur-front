# Sopiker Frontend

Public Angular storefront for Sopiker.

## Stack

- Angular 17
- Angular SSR / Express
- Tailwind CSS
- Cloudflare Turnstile on public lead forms

## Development server

Run `npm start` for a dev server with the local API proxy. Navigate to `http://localhost:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute unit tests via [Karma](https://karma-runner.github.io).

## Asset URL configuration

- DEV: `assetBaseUrl = '/assets'`.
- PROD: `assetBaseUrl = 'https://assets.sopikeur.sn'`.

## SEO build and release

Use Node 20 (`.nvmrc`) and `npm run build` for the production Cloudflare Pages build command (output: `dist/frontend/browser`). The prebuild step queries the public production catalog and articles API, then regenerates both `src/sitemap.xml` and `prerender-routes.txt`. The build prerenders these dynamic routes; postbuild checks the HTML, canonicals, unique titles and structured data. Discovery/API failures must stop a release rather than silently publish incomplete product pages.

If Cloudflare is configured to run `ng build` directly, change its build command to `npm run build` so catalog discovery and verification run on every release. Generated sitemap/routes are committed as a reviewable snapshot. Rerun `npm run seo:generate` when publishing or removing products/articles, then rebuild and redeploy. Catalog prices and stock in prerendered HTML are snapshots too; rebuild after changes.

Run `npm run seo:verify` independently after a build. See `SEO_AUDIT_2026-11-07.md` for baseline measurements, remaining checks and Search Console follow-up.
