---
title: Fathom
description: A cover-first reading interface for the books, manga, comics and PDFs already in your Jellyfin libraries.
---

Fathom is a reading interface for books, manga, comics and PDFs that already
live in Jellyfin. It runs as one Docker container, reads your reading libraries
over the Jellyfin API, and presents them cover-first rather than as rows of
filenames.

:::note[Early]
Browsing works: a featured shelf, recent additions, library and collection
browsing, and a title detail view with contributors and metadata.

There is **no reading-progress tracking, no ratings or reviews, no personal
collections and no recommendation engine**. Fathom is a nicer way to look at a
reading library, not yet a reader.
:::

## Requirements

- A running Jellyfin server with at least one book, comic or mixed library
- A Jellyfin API key and the user's **UUID** (not their username)
- Node.js 24 LTS from source. Node 22.5 is the hard floor — Fathom uses the
  built-in `node:sqlite` module, which does not exist on Node 18 or 20.

## Running it

```bash
docker run -d \
  --name fathom \
  -p 3000:3000 \
  -v ./fathom-data:/data \
  -e FATHOM_DATA_DIR=/data \
  -e JELLYFIN_URL=http://your-server:8096 \
  -e JELLYFIN_API_KEY=your-api-key \
  -e JELLYFIN_USER_ID=your-user-uuid \
  getcoral/fathom:latest
```

Fathom serves on port `3000` and exposes `/healthz`.

Every `JELLYFIN_*` variable is optional. With none set, Fathom sends you to
`/setup` on first run and stores the connection in its own SQLite database. The
environment variables exist so an operator who configures everything through
compose never has to open the UI; `/setup` still lets you override them locally.

## Environment

Verified against `fathom/.env.example` and `fathom/src`.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `JELLYFIN_URL` | No | — | Jellyfin base URL. Must resolve from inside the container |
| `JELLYFIN_API_KEY` | No | — | API key from **Dashboard → API Keys** |
| `JELLYFIN_USER_ID` | No | — | The user's UUID, not their username |
| `JELLYFIN_USERNAME` | No | — | Optional. Opens a real playback session |
| `JELLYFIN_PASSWORD` | No | — | Optional, paired with `JELLYFIN_USERNAME` |
| `FATHOM_DATA_DIR` | No | `./data` | Where `fathom.sqlite` lives |
| `HOST` | No | `0.0.0.0` | Interface the server binds to |
| `PORT` | No | `3000` | Port the server listens on |

## Storage

Fathom keeps its Jellyfin connection and local overrides in a SQLite database at
`./data/fathom.sqlite`, or under `FATHOM_DATA_DIR` if you set it. In the
published image that is `/data` — mount it, or you will redo setup on every
container replacement.

## Library layout

Fathom reads whatever Jellyfin already exposes as a book or mixed-content
library. It does not scan the filesystem itself and does not write to your
media, so how you organise files on disk is entirely Jellyfin's business.

## From source

```bash
git clone https://github.com/Get-Coral/fathom.git
cd fathom
pnpm install
cp .env.example .env
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

`pnpm start` is the production entrypoint and is what the Docker image runs.
`pnpm preview` serves the Vite build and is for local inspection only.

## Related

- [Fathom vs Kavita and Komga](https://getcoral.dev/compare/fathom-vs-kavita-komga) — whether your books belong in Jellyfin at all
- [Aurora](/modules/aurora/) — the same idea for video
- [Jellyfin API Client](/libraries/jellyfin/) — the typed client Fathom is built on
- [Get-Coral/fathom on GitHub](https://github.com/Get-Coral/fathom)
