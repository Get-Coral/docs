---
title: Introduction to Coral
description: Get started with the Coral ecosystem
---

## What is Coral?

Coral is an open-source ecosystem of independent, modular interfaces for [Jellyfin](https://jellyfin.org/) — a free media system that puts you in control of your entertainment.

Each Coral module is purpose-built for a specific use case:

- **Aurora** - Full-featured video client with personalized home, search, and playback
- **Fathom** - Elegent reading interface for books, manga, comics, and PDFs
- **Librarian** - Tools for organizing and enriching your media libraries
- **KAPOW** - Interactive song selection and voting for group karaoke

## Why Coral?

Instead of a monolithic media center, Coral provides specialized, best-in-class interfaces for each media type. You can run one module or all of them together, choosing what works best for your needs.

### Key features across all modules:

- **Jellyfin-native** - Uses the Jellyfin API, never duplicates data
- **Type-safe** - Built with TypeScript for better developer experience
- **Self-hosted** - Run on your own infrastructure
- **Modern stack** - TanStack Start, React, Tailwind CSS
- **Independent** - Each module can be deployed separately

## Getting Started

If you want to build a new Coral module, start with the official CLI:

```bash
pnpm create coral@latest
npm create coral@latest
bun create coral@latest
```

That bootstraps the current Coral template with TypeScript, Biome, and release automation already wired in. For the full flow, see [create-coral CLI](/getting-started/create-coral/).

Choose a module to explore:

- [**Aurora**](/modules/aurora/) - Start building with the video client
- [**Fathom**](/modules/fathom/) - Set up your reading interface
- [**Librarian**](/modules/librarian/) - Organize your media
- [**KAPOW**](/modules/kapow/) - Create the ultimate karaoke experience
- [**Encore**](/modules/encore/) - Template for building custom modules
- [**Marquee**](/modules/marquee/) - Template for building custom modules

## Development

All Coral modules are built with:
- [TanStack Start](https://tanstack.com/start) - React SSR framework
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Learn More

- Visit [getcoral.dev](https://getcoral.dev) for the main website
- Explore the [Jellyfin API Client](/libraries/jellyfin/) for building with the API
- Use the [create-coral CLI guide](/getting-started/create-coral/) to scaffold a new module
- See [Contributing](/contributing/getting-started/) to build your own module
