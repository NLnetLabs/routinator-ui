# Routinator user interface

## About

User Interface for [Routinator](https://nlnetlabs.nl/projects/rpki/routinator/).

Routinator 3000 is free, open source RPKI Relying Party software written in the Rust programming language. The application is designed to be secure and have great portability. It is a lightweight implementation that can run effortlessly on almost any operating system using minimalist hardware.

Routinator is a full-featured RPKI Relying Party software package that runs as a service which periodically downloads and verifies RPKI data. Routers can connect to Routinator to fetch verified data via the RPKI-to-Router (RTR) protocol. The built-in HTTP server offers a user interface and API endpoints for the various file formats, as well as logging, status and Prometheus metrics.

The user interface allows users to validate prefixes against ASNs found in BGP announcements. Next to that it allows users to lookup related prefixes for the prefix they're searching for. These related prefixes can be more- or less-specific prefixes, routed in BGP or prefixes that are allocated by one of the five Regional Internet Registries.

## Architecture

This SPA front-end application is written using only one dependency, namely [React](https://reactjs.org/).

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
npx format
```

## Unit tests

```sh
yarn test
```

## Resources

## Specify API hosts

The API hosts to use can be specified at runtime or at build time. By default
the current host is used for the Routinator API endpoints and https://rest.bgp-api.net
for the Roto API.

### Runtime

The `index.html` file contains the following fragment:

```javascript
    window.ROTO_API_HOST = 'ROTO_API_HOST_PLACEHOLDER';
    window.ROUTINATOR_API_HOST = 'ROUTINATOR_API_HOST_PLACEHOLDER';
```

The respective endpoints can be configured by replacing the string
`ROTO_API_HOST_PLACEHOLDER` and/or the string `ROUTINATOR_API_HOST_PLACEHOLDER`
before serving the content of `index.html`. If these are not configured at runtime
the build time variables or the defaults will be used.

### Build time

By specifying `ROTO_API_HOST` and/or `ROUTINATOR_API_HOST` as environment variables
these can be configured at build time. For example:

```sh
ROTO_API_HOST=https://rest.bgp-api.net ROUTINATOR_API_HOST=https://routinator.do.nlnetlabs.nl yarn build
```

## Endpoint documentation

* https://routinator.docs.nlnetlabs.nl/en/stable/monitoring.html
* https://routinator.docs.nlnetlabs.nl/en/stable/json-metrics.html
