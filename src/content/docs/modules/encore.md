---
title: Encore
description: The Coral module scaffold. The published image serves a placeholder — the guest music requests it is named for are not built yet.
---

Encore is the reference scaffold for a Coral module: TanStack Start, Tailwind v4,
Biome and release automation, wired together and ready to build on. It is named
for a planned feature — moderated guest music requests against a Jellyfin music
library — that **does not exist yet**.

:::caution[Scaffold — do not deploy this expecting a product]
`getcoral/encore` builds and runs, but `src/` is the unmodified Coral template,
so the container serves a placeholder page that reads *"Coral Module — Ready to
build."* There is no music browsing, no request queue, no host approval, and no
Jellyfin connection of any kind.

If you want a working Coral module today, see [Aurora](/modules/aurora/),
[Tide](/modules/tide/) or [KAPOW!](/modules/kapow/).
:::

## What it is useful for

As a starting point. Encore tracks the current template, so it is a live example
of how a Coral module is laid out — routing, the Node server entrypoint, the
Docker build, and the release workflow.

To start your own module from the same base, use the CLI rather than forking
Encore:

```bash
pnpm create coral@latest
```

See the [create-coral CLI guide](/getting-started/create-coral/) and
[Project templates](/contributing/project-templates/).

## Requirements

- Node.js 24 LTS. Node 22.5 is the hard floor — the template uses the built-in
  `node:sqlite` module, which does not exist on Node 18 or 20.
- pnpm

## Running it

```bash
docker run -p 3000:3000 getcoral/encore:latest
```

Encore serves on port `3000` and exposes `/healthz`.

## Environment

The entire environment surface, verified against `encore/.env.example` and
`encore/src`:

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `HOST` | No | `0.0.0.0` | Interface the server binds to |
| `PORT` | No | `3000` | Port the server listens on |

There are no `JELLYFIN_*` variables. Nothing in Encore reads them, and setting
them has no effect.

## From source

```bash
git clone https://github.com/Get-Coral/encore.git
cd encore
pnpm install
pnpm dev
```

| Script | Purpose |
|---|---|
| `pnpm dev` | Dev server on `:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Run the production server (`node server.mjs`) |
| `pnpm typecheck` | TypeScript check |
| `pnpm check` | Biome lint + format check |
| `pnpm test` | Vitest |

## Related

- [Project templates](/contributing/project-templates/) — what the scaffold contains
- [create-coral CLI](/getting-started/create-coral/) — the supported way to start a module
- [Module contracts](/getting-started/module-contracts/) — how modules talk to each other
- [Get-Coral/encore on GitHub](https://github.com/Get-Coral/encore)
