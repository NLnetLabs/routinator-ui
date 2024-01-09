# Routinator user interface


## Architecture

This SPA front-end application is written using two main dependencies, namely [React](https://reactjs.org/) as a rendering engine.

## Requirements

Install a recent version of [yarn](https://yarnpkg.com/).

## Run in development

```sh
yarn
yarn dev
```

Navigate to [http://localhost:5173](http://localhost:5173).

Example search: http://localhost:5173/?prefix=104.154.0.0%2F15&validate-bgp=true

## Build for production

```sh
yarn
yarn build
```

## Linting

```sh
yarn lint
```

## Formatting

```sh
npx prettier --write "**/*.(ts|tsx)"
```

## Browser tests

```sh
yarn playwright install --with-deps chromium
yarn test
```

## Resources

De huidige UI source code:
https://github.com/NLnetLabs/routinator-ui

Een voorbeeld van de UI staat hier live:
https://routinator.nlnetlabs.nl/

De data wordt weergegeven op basis van deze API endpoints:
https://routinator.do.nlnetlabs.nl/api/v1/status
https://rest.bgp-api.net/api/v1/

De documentatie staat hier:
https://routinator.docs.nlnetlabs.nl/en/stable/monitoring.html
https://routinator.docs.nlnetlabs.nl/en/stable/json-metrics.html
