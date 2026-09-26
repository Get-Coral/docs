---
title: Introduction to Coral
description: What Coral is, how its modules relate to Jellyfin and to each other, and which one to start with.
---

## What is Coral?

Coral is an open-source ecosystem of independent, modular interfaces for [Jellyfin](https://jellyfin.org/) — a free media system that puts you in control of your entertainment.

Each module runs as its own Docker container, reads Jellyfin over its HTTP API,
and does one thing:

| Module | What it does | Status |
|---|---|---|
| [Aurora](/modules/aurora/) | Cinematic video frontend with playback that syncs back to Jellyfin | Shipping |
| [Tide](/modules/tide/) | Torrent client with real queue limits and a memory guard | Shipping |
| [KAPOW!](/modules/kapow/) | Karaoke queue for bars and parties, with phone-based voting | Shipping |
| [Librarian](/modules/librarian/) | Imports finished downloads into your media tree by hardlinking | Early |
| [Fathom](/modules/fathom/) | Cover-first reading room for books, manga, comics and PDFs | Early |
| [Marquee](/modules/marquee/) | Always-on ambient display for a spare TV or tablet | Early |
| [Encore](/modules/encore/) | The module scaffold. Named for a feature that is not built yet | Scaffold |

**Status is not decoration.** *Shipping* means feature-complete for its stated
purpose. *Early* means it runs and does something useful, but the surface is
small and moving. *Scaffold* means the published image serves a placeholder.
Each module page repeats its status and says exactly what is and is not there.

## Why Coral?

Instead of a monolithic media center, Coral provides specialized, best-in-class interfaces for each media type. You can run one module or all of them together, choosing what works best for your needs.

### Key features across all modules:

- **Jellyfin-native** - Uses the Jellyfin API, never duplicates data
- **Type-safe** - Built with TypeScript for better developer experience
- **Self-hosted** - Run on your own infrastructure
- **Modern stack** - TanStack Start, React, Tailwind CSS
- **Independent** - Each module can be deployed separately

## How modules relate to each other

Jellyfin is the source of truth and modules never share a database. What
Jellyfin knows, you read from Jellyfin.

For the few things Jellyfin has no API for — organising a directory, rather
than scanning one — a module can expose a small versioned contract another
module opts into. Three rules keep that narrow:

1. **No link is required.** Every module runs alone and is useful alone.
2. **No link is implicit.** An operator pastes a URL and a token. Nothing is
   discovered or scanned; two modules on the same network that have not been
   introduced stay strangers.
3. **Nothing Jellyfin can already answer gets a contract.**

See [Module contracts](/getting-started/module-contracts/) for the manifest
format, tokens, and the capability list.

## Getting Started

If you want to build a new Coral module, start with the official CLI:

```bash
pnpm create coral@latest
npm create coral@latest
bun create coral@latest
```

That bootstraps the current Coral template with TypeScript, Biome, and release automation already wired in. For the full flow, see [create-coral CLI](/getting-started/create-coral/).

If you want to *run* Coral rather than build on it, start here instead:

- [**Running a stack with Docker Compose**](/getting-started/docker-compose/) —
  Jellyfin, Aurora, Tide and Librarian together, with the mount layout that
  makes hardlinked imports work. This is the page most people want.
- [**Aurora**](/modules/aurora/) — the single most useful module to add to an
  existing Jellyfin server

## Development

All Coral modules are built with:
- [TanStack Start](https://tanstack.com/start) - React SSR framework
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Learn More

- [getcoral.dev](https://getcoral.dev) — what each module is for, and how it
  compares to the alternatives. These docs cover how to run them
- Explore the [Jellyfin API Client](/libraries/jellyfin/) for building with the API
- Use the [create-coral CLI guide](/getting-started/create-coral/) to scaffold a new module
- See [Contributing](/contributing/getting-started/) to build your own module
