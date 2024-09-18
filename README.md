# Inzicht in inkomsten belasting.

Dit is de broncode van de webpagina voor inzicht in inkomsten belasting.
Deze webpagina is te vinden op https://hilbrand.github.io/ib

De broncode is beschikbaar onder de AGPL3.0 licentie.

# Technische informatie

[![Bouw broncode](https://github.com/Hilbrand/ib-broncode/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hilbrand/ib-broncode/actions/workflows/deploy.yml)
[![Uitrol naar GitHub pages](https://github.com/Hilbrand/ib/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Hilbrand/ib/actions/workflows/pages/pages-build-deployment)

# Kengetallen

## Inkomsten belasting

Categorieen van en tot, met per groep een percentage.
Wet Inkomstenbelasting 2001
https://wetten.overheid.nl/BWBR0011353/2024-04-30/0

## Arbeidskorting (AK)

Arbeidsinkomen, grenzen, afbouwpunt, afbouwfactor (afbouwpercentage als factor).

Arbeidskorting is alleen van toepassing bij inkomen.
Dus bij AOW en geen inkomen of uitkering geen arbeidskorting.
Bij AOW en geen inkomen wel weer ouderenkorting.
Grafieken gaan nu uit van inkomen en AOW-leeftijd met inkomen.

## Algemene Heffingskorting (AHK)

Inkomen uit werk en woning, maximaal, afbouwpunt, afbouwfactor (afbouwpercentage als factor).

## Inkomsten afhankelijk combinatie korting (IACK)

Maximaal, inkomensgrens, opbouwpercentage.

## Kindgebonden budget

https://wetten.overheid.nl/BWBR0022751/2024-01-01

## Kinderbijslag

## Huurtoeslag

https://wetten.overheid.nl/BWBR0008659/2024-01-01

## Hyptoheekaftrek

## Eigenwoningforfait

## Zorgtoeslag


# Sotfware Ontwikkelomgeving

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Run Prettier

```sh
npx prettier -w src test
```

### Run tests

```sh
npx vitest
```
