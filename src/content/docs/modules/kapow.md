---
title: KAPOW!
description: A comic-book karaoke queue for bars and parties. Guests join by QR code from their own phones, vote songs up, and a TV view drives the room.
---

KAPOW! is a karaoke queue system for bars, events and parties. The host opens a
room, guests join by scanning a QR code on their own phone with nothing to
install, everyone searches and votes songs up the queue, and a separate display
view drives the screen in the room.

:::note[Shipping]
Rooms, guest join, search, voting, host controls and the display view all work.
:::

:::caution[Not self-contained]
Unlike every other Coral module, KAPOW! is not a single container you point at
Jellyfin. It needs a **Supabase** project for its database and realtime layer,
and a **YouTube Data API v3** key for song search. Budget for both before you
start.
:::

## How It Works

1. **Host creates a room** → gets a host token, a 6-character join code, and a QR code
2. **Guests join via code or QR** → search YouTube for karaoke tracks → add to queue with their name
3. **Everyone votes** → highest-voted pending song rises to the top
4. **Host manages playback** from `/host/:code`, drives the TV display at `/display/:code`

## Features

### For Guests

- **Easy join** - Scan QR code or enter 6-digit code
- **Search YouTube** - Find any karaoke track
- **Queue songs** - Add to the session playlist
- **Vote collaboration** - Upvote songs you want to hear
- **Real-time updates** - See queue changes instantly

### For Hosts

- **Session management** - Create and control rooms
- **Playback control** - Play, pause, skip tracks
- **Queue management** - Reorder songs, remove bad entries
- **Control booth** - Dedicated host interface
- **Display mode** - TV-ready display for guests

### Technical Features

- **Real-time sync** - Built with Supabase subscriptions
- **YouTube integration** - Search the complete YouTube Music catalog
- **Drag-and-drop** - Reorder queue easily
- **Voting system** - Democratic song selection

## Stack

- [TanStack Start](https://tanstack.com/start) - React SSR framework with file-based routing
- [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) - Type-safe routing and server-state management
- [Supabase](https://supabase.com) - PostgreSQL database with realtime subscriptions for live queue/vote sync
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [dnd-kit](https://dndkit.com) - Drag-and-drop queue reordering
- **YouTube Data API v3** - Song search

## Getting Started

### Prerequisites

- Node.js 24 LTS
- pnpm (or npm/yarn)
- Supabase account
- YouTube Data API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Get-Coral/kapow.git
cd kapow
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your credentials to `.env`:

```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable / anon key>
YOUTUBE_API_KEY=<your YouTube Data API v3 key>
```

### Environment

Verified against `KAPOW/.env.example` and `KAPOW/src/lib/env.ts`.

| Variable | Required | Purpose |
|---|---|---|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable (anon) key |
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key, used for song search |
| `SUPABASE_DB_URL` | No | Direct database connection, for the migration scripts |
| `SUPABASE_DB_PASSWORD` | No | Database password. Used by `supabase link` and in CI — **not** read by the app |
| `HOST` | No | Interface the server binds to (default `0.0.0.0`) |
| `PORT` | No | Port the server listens on (default `3000`) |

`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` each accept aliases, so an
existing Supabase `.env` usually works unchanged:

- URL: `SUPABASE_URL`, `VITE_SUPABASE_URL`
- Key: `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_KEY`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_KEY`

### Database migrations

`supabase/migrations/` is the source of truth for the schema; `schema.sql` is a
reference snapshot. The `pnpm db:*` scripts (`db:start`, `db:reset`, `db:lint`,
`db:test`, `db:push:remote`) drive it. Publishing to a remote project needs the
`SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` CI secrets.

### Get Supabase Credentials

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and Anon key
3. Create a database password in project settings
4. Run migrations to set up tables

### Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable YouTube Data API v3
4. Create an API key
5. Add to your `.env`

### Start Development

```bash
pnpm dev
```

KAPOW runs on `http://localhost:3000`

## Running a Session

### As Host

1. Visit `http://localhost:3000`
2. Create a new room
3. Share the code or QR code with guests
4. Go to host control at `/host/:code?token=` — the host token from step 2 is
   required; the route will not open without it

### As Guest

1. Scan QR code or visit with the 6-digit code
2. Enter your name
3. Search for karaoke tracks
4. Add songs to queue
5. Vote on pending songs

## Routes

| Route | Description |
|---|---|
| `/` | Landing — create or join a room |
| `/room/:code` | Guest view — search songs, add to queue, vote |
| `/host/:code?token=` | Host control booth — manage queue, advance songs |
| `/display/:code` | TV display — now playing, full-screen comic mode |

## Deployment

KAPOW! publishes to `getcoral/kapow` on Docker Hub and
`ghcr.io/get-coral/kapow`.

:::caution[Check the image before you rely on it]
The Docker build currently copies the server output to `./dist` while the
container's start command points at `.output/server/index.mjs`. If the container
exits immediately on start, that is why — run from source until it is fixed, and
see [Get-Coral/KAPOW](https://github.com/Get-Coral/KAPOW) for status.
:::

Running from source:

```bash
pnpm build
pnpm start
```

Whichever way you deploy, Supabase and the YouTube API key have to be configured
for the environment, and YouTube's daily quota is the limit you will hit first
on a busy night.

## Architecture

### Database Schema

Supabase stores:
- **rooms** - Active karaoke sessions
- **queue** - Songs in the queue
- **votes** - Guest votes on songs
- **guests** - Participants in sessions

Real-time subscriptions push changes to all connected clients instantly.

### Real-time Updates

Uses Supabase realtime to push:
- New songs added to queue
- Vote changes
- Playback state changes
- Guest joins/leaves

## Learn More

- [TanStack Start Docs](https://tanstack.com/start)
- [Supabase Docs](https://supabase.com/docs)
- [Contributing](/contributing/getting-started/)

## Related

- [KAPOW! vs Karaoke Eternal](https://getcoral.dev/compare/kapow-vs-karaoke-eternal) — local library versus YouTube search
- [Encore](/modules/encore/) — the planned equivalent for Jellyfin music requests
- [Get-Coral/KAPOW on GitHub](https://github.com/Get-Coral/KAPOW)
