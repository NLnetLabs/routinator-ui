
# Routinator UI

The project consists of:
 - A [Vue.js](https://vuejs.org/) App, that uses [Element](https://element.eleme.io/) as a UI library.
 - A Rust `cargo` crate, that lives under `/cargo-publish`.

 You can either make a built for inclusion with `routinator` (through the `routinator-ui` crate) or a stand-alone UI that uses
 a (publicly) hosted `routinator` API and a (publicly) hosted roto-api API somewhere. 

 The cargo crate does **not** contain actual asset files (js, html, css), but gets them either by downloading them from Github,
 or using locally built asset files under `/dist`. See the [README](cargo-publish/README.md) under `cargo-publish` for more info.

## Requirements
* Node.js >= 14

## Dev setup
To get all the required js libraries in, run

```bash
npm install
```

and then 

```bash
npm run serve
```

to start the dev-server. See settings in `vue.config.js` for configurable settings (most notably where API calls are proxied to).

### Compiles and hot-reloads for development
Useful during development to instantaneously see the changes on screen

```bash
npm run serve
```
and then open [http://localhost:8080/ui](http://localhost:8080/ui)

## Compiling the assets
All compiled bundles will go in to `/dist`

### production
```bash
npm run build
```

main feature is that the `publicUrl` is set to `/ui` to correspond with the expectations of routinator.

See `.env.production` for all settings

Note that production is updated when `npm version` is issued (seel below).

### stand-alone UI build (for AWS S3 mainly)

```bash
npm run build s3
```

This build is using `/` is its `publicUrl`

See `.env.s3` for all settings.

### Stand-alone develepment build

```bash
npm run build-dev
```

This build is used on the dev VM on `https://roto-api-dev.do.nlnetlabs.nl/`

Builds on this VM should be installed manually by issuing the command. A n`nginx` instance takes care of the rest.

See `.env.development`

## Automated builds with Github Actions

- On each push to the `main` branch a new development build and a .tar.gz with all assets are produced and available as downloads
  from Github. 
- On each git tag that starts with `v` a production build and a .tar.gz with assets are produced and availables as a download from Github. The cargo crate is updated as well.

## Creating a new Release

A new release should be created by issuing:

```bash
npm version [patch|minor|major] -m <RELEASE NAME>
```

This will bump the version in `package.json` and `Cargo.toml`, create the git tag and push the repo. The Github Action for the tag (described above) will take care of creating the builds and pushing them.

You should never need to update `package.json` or `Cargo.toml` versions manually in this repo!