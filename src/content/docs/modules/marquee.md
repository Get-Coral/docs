---
title: Marquee
description: Turn a spare TV or tablet into an always-on Jellyfin display showing what is playing now and what was recently added. Nothing to click.
---

Marquee turns a spare TV, tablet or wall panel into an always-on display for a
Jellyfin server. It runs as one Docker container, polls Jellyfin over its HTTP
API, and shows what is playing right now, who is watching, and what was recently
added. There are no controls — it is a screen, not an app.

:::note[Early]
The display and its first-run setup flow work. The surface is deliberately
small: now playing and active sessions, recently added movies and shows, server
name and total library count. There is no playback control, no scheduling and no
multi-server support.
:::

## Requirements

- A running Jellyfin server reachable from the container
- A Jellyfin API key and the user's **UUID** (not their username)
- Node.js 24 LTS if you are running from source. Node 22.5 is the hard floor —
  Marquee uses the built-in `node:sqlite` module, which does not exist on Node
  18 or 20.

## Running it

```bash
docker run -d \
  --name marquee \
  -p 3000:3000 \
  -v ./marquee-data:/data \
  -e MARQUEE_DATA_DIR=/data \
  -e JELLYFIN_URL=http://your-server:8096 \
  -e JELLYFIN_API_KEY=your-api-key \
  -e JELLYFIN_USER_ID=your-user-uuid \
  getcoral/marquee:latest
```

Then point the display's browser at `http://<host>:3000` and leave it there.

You can skip every `JELLYFIN_*` variable and configure Marquee at `/setup`
instead — it stores the connection in its own SQLite database. The environment
variables exist so an operator who configures everything through compose never
has to open the UI.

Marquee exposes `/healthz`, which returns non-200 until the server is ready.

## Environment

Verified against `marquee/.env.example` and `marquee/src`.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `JELLYFIN_URL` | No | — | Jellyfin base URL. Must resolve from inside the container |
| `JELLYFIN_API_KEY` | No | — | API key from **Dashboard → API Keys** |
| `JELLYFIN_USER_ID` | No | — | The user's UUID, not their username |
| `JELLYFIN_USERNAME` | No | — | Optional. Opens a real playback session |
| `JELLYFIN_PASSWORD` | No | — | Optional, paired with `JELLYFIN_USERNAME` |
| `MARQUEE_DATA_DIR` | No | `./data` | Where the SQLite database lives |
| `HOST` | No | `0.0.0.0` | Interface the server binds to |
| `PORT` | No | `3000` | Port the server listens on |

Nothing is strictly required: with no Jellyfin variables set, Marquee redirects
to `/setup` on first run.

## Storage

Marquee keeps its Jellyfin connection and settings in a SQLite database under
`MARQUEE_DATA_DIR` (`/data` in the image, `./data` from source). Mount it if you
do not want to redo setup on every container replacement.

## From source

```bash
git clone https://github.com/Get-Coral/marquee.git
cd marquee
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

## Related

- [What Marquee is for](https://getcoral.dev/apps/marquee) — the overview on getcoral.dev
- [Aurora](/modules/aurora/) — the interactive frontend Marquee complements
- [Running a stack with Docker Compose](/getting-started/docker-compose/)
- [Get-Coral/marquee on GitHub](https://github.com/Get-Coral/marquee)
