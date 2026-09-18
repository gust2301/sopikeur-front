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
