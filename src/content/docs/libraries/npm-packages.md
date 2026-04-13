---
title: NPM Packages
description: Official Coral packages published to npm
---

Coral publishes reusable packages for app scaffolding, Jellyfin integration, and shared tooling.

## Package Catalog

| Package | Current Version | Purpose |
|---|---:|---|
| [create-coral](https://www.npmjs.com/package/create-coral) | 1.0.3 | CLI to scaffold a new Coral module from the official template |
| [@get-coral/jellyfin](https://www.npmjs.com/package/@get-coral/jellyfin) | 1.4.0 | Typed Jellyfin API client for Node, browser, and edge runtimes |
| [@get-coral/tsconfig](https://www.npmjs.com/package/@get-coral/tsconfig) | 0.2.0 | Shared TypeScript config presets for Coral repositories |
| [@get-coral/biome-config](https://www.npmjs.com/package/@get-coral/biome-config) | 0.2.0 | Shared Biome lint/format configuration for Coral repositories |

## Installation

### Scaffold a new module

```bash
pnpm create coral@latest
# or
npm create coral@latest
```

### Add shared tooling presets

```bash
pnpm add -D @get-coral/tsconfig @get-coral/biome-config
# or
npm install --save-dev @get-coral/tsconfig @get-coral/biome-config
```

### Add the Jellyfin client

```bash
pnpm add @get-coral/jellyfin
# or
npm install @get-coral/jellyfin
```

## Related

- [create-coral CLI](/getting-started/create-coral/)
- [Jellyfin API Client](/libraries/jellyfin/)
