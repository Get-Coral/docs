---
title: NPM Packages
description: The five published Coral packages — what each one is for, which you need, and how they fit together.
---

Coral publishes five packages to npm: one scaffolder, two runtime libraries, and
two shared tooling presets. Everything else in the ecosystem is a Docker image,
not a package.

## Package catalog

Version badges are live, so this table cannot go stale.

| Package | Version | Purpose |
|---|---|---|
| [create-coral](https://www.npmjs.com/package/create-coral) | ![npm](https://img.shields.io/npm/v/create-coral?color=2dd4bf&labelColor=0b1820&label=) | CLI to scaffold a new Coral module from the official template |
| [@get-coral/jellyfin](https://www.npmjs.com/package/@get-coral/jellyfin) | ![npm](https://img.shields.io/npm/v/%40get-coral%2Fjellyfin?color=2dd4bf&labelColor=0b1820&label=) | Typed Jellyfin API client for Node, browser and edge runtimes |
| [@get-coral/ui](https://www.npmjs.com/package/@get-coral/ui) | ![npm](https://img.shields.io/npm/v/%40get-coral%2Fui?color=2dd4bf&labelColor=0b1820&label=) | Shared React component library and design tokens |
| [@get-coral/tsconfig](https://www.npmjs.com/package/@get-coral/tsconfig) | ![npm](https://img.shields.io/npm/v/%40get-coral%2Ftsconfig?color=2dd4bf&labelColor=0b1820&label=) | Shared TypeScript config presets |
| [@get-coral/biome-config](https://www.npmjs.com/package/@get-coral/biome-config) | ![npm](https://img.shields.io/npm/v/%40get-coral%2Fbiome-config?color=2dd4bf&labelColor=0b1820&label=) | Shared Biome lint and format configuration |

## Which do you need?

**Building a Coral module?** Run `pnpm create coral@latest`. The template already
depends on all four of the others; you do not install them by hand.

**Talking to Jellyfin from your own project?** You only need
`@get-coral/jellyfin`. It has zero runtime dependencies and no React, so it works
in a script, a worker or a server as happily as in an app.

**Matching Coral's look?** Add `@get-coral/ui`. It needs React 19.

**Matching Coral's tooling in an unrelated repo?** `@get-coral/tsconfig` and
`@get-coral/biome-config` are standalone and useful on their own.

## Installation

### Scaffold a new module

```bash
pnpm create coral@latest
# or
npm create coral@latest
```

### Add the Jellyfin client

```bash
pnpm add @get-coral/jellyfin
```

### Add shared UI components

```bash
pnpm add @get-coral/ui
```

### Add shared tooling presets

```bash
pnpm add -D @get-coral/tsconfig @get-coral/biome-config
```

Then extend them. In `tsconfig.json`:

```json
{ "extends": "@get-coral/tsconfig" }
```

And in `biome.json`:

```json
{ "extends": ["@get-coral/biome-config"] }
```

## Releases

Every package uses Release Please: conventional commits on `main` open a release
PR, and merging it publishes. Publishing uses **npm trusted publishing (OIDC)
with provenance**, so there is no long-lived `NPM_TOKEN` in any repository.

The two tooling presets live together in
[Get-Coral/dev-standards](https://github.com/Get-Coral/dev-standards); the other
three have their own repositories.

## Related

- [create-coral CLI](/getting-started/create-coral/) — flags and the full flow
- [Jellyfin API client](/libraries/jellyfin/) — the API surface
- [Coral UI](/libraries/coral-ui/) — component reference
- [Project templates](/contributing/project-templates/)
