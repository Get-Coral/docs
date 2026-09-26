---
title: Librarian
description: Import finished downloads into your Jellyfin media tree by hardlinking them — zero extra disk, and the torrent keeps seeding.
---

Librarian imports finished downloads into your media tree by hardlinking them,
so the file appears in your library at zero extra bytes and the torrent carries
on seeding the same data. It runs as one Docker container, reads Jellyfin over
its HTTP API, and never takes ownership of your library away from Jellyfin.

:::note[Early]
The import workflow is real and in daily use: filesystem roots, import plans
with a preview, hardlink-with-copy-fallback, path mappings, and scan jobs.

Duplicate detection, bulk metadata editing, backup export and library analytics
are **on the product direction, not in the code**. If you need those today,
Librarian is not the tool yet.
:::

:::caution[It signs you in by default]
Unlike the read-only Coral modules, Librarian moves and deletes files, so it
requires a Jellyfin sign-in out of the box. Anything touching the filesystem
additionally requires the signed-in user to be a Jellyfin **administrator**, and
that gate does not relax when sign-in is switched off. See
[Access control](#access-control).
:::

## Requirements

- A running Jellyfin server reachable from the container
- A Jellyfin API key and the user's **UUID**
- A Jellyfin **administrator** account for any file operation
- Media and downloads under **one** mount point — see
  [Why one mount](#why-one-mount)
- Node.js 24 LTS from source (22.5 is the hard floor, for `node:sqlite`)

## Running it

```bash
docker run -d \
  --name librarian \
  -p 127.0.0.1:3002:3000 \
  --user "$(id -u):$(id -g)" \
  -v ./librarian-data:/data \
  -v ./library:/library \
  -e LIBRARIAN_DATA_DIR=/data \
  -e JELLYFIN_URL=http://your-server:8096 \
  -e JELLYFIN_API_KEY=your-api-key \
  -e JELLYFIN_USER_ID=your-user-uuid \
  -e LIBRARIAN_DOWNLOADS_DIR=/library/downloads/complete \
  -e LIBRARIAN_MEDIA_DIR=/library/media/movies \
  getcoral/librarian:latest
```

Librarian serves on port `3000` inside the container and exposes `/healthz`.

For the full four-service stack — Jellyfin, Aurora, Tide and Librarian — with
the mount layout worked out, see
[Running a stack with Docker Compose](/getting-started/docker-compose/).

## Environment

Verified against `librarian/.env.example` and `librarian/src`.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `JELLYFIN_URL` | No | — | Jellyfin base URL. Must resolve from inside the container |
| `JELLYFIN_API_KEY` | No | — | API key from **Dashboard → API Keys** |
| `JELLYFIN_USER_ID` | No | — | The user's UUID, not their username |
| `JELLYFIN_USERNAME` | No | — | Optional, opens a real playback session |
| `JELLYFIN_PASSWORD` | No | — | Optional, paired with `JELLYFIN_USERNAME` |
| `LIBRARIAN_DATA_DIR` | No | `./data` | Where `librarian.sqlite` lives |
| `LIBRARIAN_REQUIRE_LOGIN` | No | `true` | Setting it pins the value and hides the UI toggle |
| `LIBRARIAN_DOWNLOADS_DIR` | No | — | *Seeds* a downloads root. Arrives switched off |
| `LIBRARIAN_MEDIA_DIR` | No | — | *Seeds* a media root. Arrives switched off |
| `CORAL_SERVICE_TOKEN` | No | — | Grants another module full access without issuing a token in the UI |
| `HOST` | No | `0.0.0.0` | Interface the server binds to |
| `PORT` | No | `3000` | Port the server listens on |

Leave the Jellyfin variables unset and configure at `/setup` instead; Librarian
persists the connection in SQLite.

## Access control

| Variable | Default | Effect |
|---|---|---|
| `LIBRARIAN_REQUIRE_LOGIN` | `true` | Pins the setting and removes the toggle from the UI |
| `CORAL_SERVICE_TOKEN` | unset | Full access for another module, never stored, not revocable from the Connections page |

`CORAL_SERVICE_TOKEN` is an escape hatch for operators who configure everything
through compose and never open a UI. It grants full access and cannot be revoked
from the interface. Prefer issuing tokens on the Connections page.

## Filesystem roots

Librarian only touches directories you have enabled.

`LIBRARIAN_DOWNLOADS_DIR` and `LIBRARIAN_MEDIA_DIR` **seed root records — they
do not grant permission**. A seeded root arrives switched off and a human turns
it on in the UI. A container that happens to have `/media` bind-mounted can do
nothing with it until somebody says so: a mounted directory is not permission to
write to it.

## Importing

The `/organize` page is the working surface. It lists finished downloads, builds
an **import plan**, and shows you what it will do before it does it. The plan
tells you, per file, whether the transfer will be a hardlink or a copy — check
that column, it is where a broken mount layout shows up.

Librarian never chowns anything. It is not going to start rewriting ownership on
your library.

### Why one mount

Librarian imports by hardlinking: the file appears in your library at zero extra
bytes and the torrent carries on seeding the same data.

A hardlink cannot cross a filesystem — but it also cannot cross a *mount point*,
even when both sides are the same filesystem. Bind-mounting `./media` and
`./downloads` separately is enough to break it:

```
/media     dev = 36
/downloads dev = 36     <- same device
link() -> EXDEV         <- refused anyway
```

Mount one tree instead, with media and downloads as directories inside it.
Awkward-looking paths, working hardlinks.

Nothing that inspects `statSync().dev` can predict this, which is why Librarian
decides by *attempting* the link rather than comparing device ids. If it does
fall back, nothing breaks — the import becomes a verified copy: correct, just
slower and twice the space. You will see "Copy" rather than "Hardlink" in the
import preview, which is the place to check.

### Path mappings

If Jellyfin and Librarian mount the same tree at different paths, the mappings
table translates between them. Mount everything at the same path in every
container and the table stays empty, which is how it is meant to be.

## Cross-module access

Librarian publishes a Coral module manifest at `/api/coral/manifest` and
implements the `library.refresh` capability, which asks Jellyfin to rescan after
an import. See [Module contracts](/getting-started/module-contracts/).

## From source

```bash
git clone https://github.com/Get-Coral/librarian.git
cd librarian
pnpm install
cp .env.example .env
pnpm dev
```

The SQLite database lives at `./data/librarian.sqlite` by default.

| Script | Purpose |
|---|---|
| `pnpm dev` | Dev server on `:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Run the production server (`node server.mjs`) |
| `pnpm typecheck` | TypeScript check |
| `pnpm check` | Biome lint + format check |
| `pnpm test` | Vitest |

## Related

- [Running a stack with Docker Compose](/getting-started/docker-compose/) — the mount layout, worked out
- [Tide](/modules/tide/) — the download client Librarian imports from
- [Module contracts](/getting-started/module-contracts/)
- [What Librarian is for](https://getcoral.dev/apps/librarian) — the overview on getcoral.dev
- [Get-Coral/librarian on GitHub](https://github.com/Get-Coral/librarian)
