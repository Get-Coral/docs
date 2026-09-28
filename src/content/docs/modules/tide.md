---
title: Tide
description: A torrent client with a web interface for self-hosted download boxes — real queue limits, per-file piece priorities and a memory guard.
---

Tide is a torrent client with a web interface, built for self-hosted download
boxes. It runs as one Docker container, enforces real active-download and
seeding limits, lets you set per-file piece priorities, and pauses torrents
automatically as it approaches its memory cap.

:::note[Shipping]
Queue controls, piece maps, seeding goals, SQLite-backed state, the memory guard
and optional Jellyfin sign-in are all implemented.
:::

## Highlights

- **Quick add workflow** from the home board, including clipboard paste for copied magnet links
- **True queue enforcement** with max active downloads and max active seeders
- **Inline torrent details** with on-demand piece map, tracker state, and peer list
- **Per-file piece selection priorities** instead of metadata-only file toggles
- **Default seeding goals** applied to every newly added torrent, so ratio and seed-time rules do not have to be set by hand each time
- **Local SQLite persistence** for queue state, torrent controls, and app settings
- **Optional Jellyfin sign-in** with management limited to Jellyfin administrators
- **Basic auth support** similar to Transmission for protecting the whole app
- **Configurable downloads directory** via `.env`

## Getting Started

### Prerequisites

- Node.js 24 LTS (Node 22.5+ is the hard floor — this module uses the
  built-in `node:sqlite` module, which does not exist on Node 18 or 20)
- pnpm
- A system that can run WebTorrent in Node

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Get-Coral/tide.git
cd tide
```

2. Install dependencies:

```bash
pnpm install
```

3. Create your local environment file:

```bash
cp .env.example .env
```

4. Configure the important settings:

```bash
TIDE_DOWNLOADS_DIR=./data/downloads
TIDE_DATA_DIR=./data
TIDE_AUTH_USERNAME=admin
TIDE_AUTH_PASSWORD=change-me
```

5. Start the app:

```bash
pnpm dev
```

Tide runs on `http://localhost:3000`.

## Configuration

### Environment Variables

Verified against `tide/.env.example` and `tide/src`.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `TIDE_DOWNLOADS_DIR` | No | `./data/downloads` | Where finished downloads land |
| `TORRENT_DOWNLOADS_DIR` | No | — | Legacy alias, still honoured when `TIDE_DOWNLOADS_DIR` is unset |
| `TIDE_DATA_DIR` | No | `./data` | Where `tide.sqlite` lives |
| `TIDE_AUTH_USERNAME` | No | — | HTTP basic auth. Both halves must be set |
| `TIDE_AUTH_PASSWORD` | No | — | HTTP basic auth |
| `TIDE_JELLYFIN_URL` | No | — | Jellyfin server used purely as an identity provider |
| `TIDE_REQUIRE_LOGIN` | No | stored setting | Forces the sign-in requirement on or off, overriding SQLite |
| `TIDE_MEMORY_LIMIT_MB` | No | cgroup cap | Overrides the detected container memory limit |
| `TIDE_MEMORY_PAUSE_MB` | No | — | Pause torrents above this RSS |
| `TIDE_MEMORY_RESUME_MB` | No | — | Resume only once RSS falls below this |
| `TIDE_MEMORY_CHECK_INTERVAL_MS` | No | `5000` | How often the guard re-checks memory |
| `CORAL_SERVICE_TOKEN` | No | — | Grants another module full access without issuing a token in the UI |
| `HOST` | No | `0.0.0.0` | Interface the server binds to |
| `PORT` | No | `3000` | Port the server listens on |

Tide serves on port `3000` and exposes `/healthz`.

### Storage

Tide stores persistent state in SQLite at `./data/tide.sqlite` by default. That includes:

- global queue settings
- torrent control state
- restored torrent sessions
- the Jellyfin connection and sign-in settings
- active sign-in sessions

### Downloads Directory

Downloaded content goes to `TIDE_DOWNLOADS_DIR`. If that variable is missing, Tide falls back to `./data/downloads`.

### Memory safety

Tide runs an RSS-based memory guard over torrent activity. If it can read the
container memory cap from cgroups, the guard enables itself; when RSS crosses
the pause threshold it pauses active torrents and disconnects peers, and
activity resumes only once RSS falls back below the lower resume threshold.

For an 8 GB container limit on a NAS, a reasonable starting point:

```bash
TIDE_MEMORY_LIMIT_MB=8192
TIDE_MEMORY_PAUSE_MB=7168
TIDE_MEMORY_RESUME_MB=6144
```

Without a `mem_limit` on the container there is nothing for Tide to read from
cgroups and nothing to pause against, so set one — or set
`TIDE_MEMORY_LIMIT_MB` explicitly.

## Cross-module access

Tide publishes a Coral module manifest at `/api/coral/manifest` and implements
the `downloads.list` and `downloads.events` capabilities, which is how
[Librarian](/modules/librarian/) learns that a download has finished. See
[Module contracts](/getting-started/module-contracts/).

## Access Control

Tide has two independent layers. Both are optional, and both are off by default.

### Basic Authentication

If both `TIDE_AUTH_USERNAME` and `TIDE_AUTH_PASSWORD` are set, Tide protects the entire UI and API behind HTTP basic auth. It is a blunt front door with a single shared credential, applied by the production server before a request ever reaches the app. It is not applied by `pnpm dev`.

### Jellyfin Sign-in

Added in 1.3.0. Tide can require a Jellyfin account instead of, or alongside, basic auth.

1. On `/manage`, set the **Jellyfin server URL** under *Access* (or set `TIDE_JELLYFIN_URL`). Tide verifies the URL against `/System/Info/Public` before storing it.
2. Turn on **Require a Jellyfin sign-in**. Tide refuses to enable this until a server answers, so you cannot lock yourself out of a Tide that has nowhere to authenticate.

Once sign-in is required:

| | Signed out | Signed in | Jellyfin administrator |
|---|---|---|---|
| Board, live updates, streaming, read-only API | No | Yes | Yes |
| `/manage`, adding and removing torrents, all settings | No | No | Yes |

**Tide stores no Jellyfin API key** — only the server URL. Authentication goes through Jellyfin's `AuthenticateByName` endpoint, which is signed with a client header rather than a server credential, so there is nothing server-wide for Tide to hold or leak. Signing out of Tide also revokes the Jellyfin access token it was issued.

Sessions are stored in the same SQLite database as the rest of Tide's state and survive restarts.

:::caution[Locked out?]
Start Tide with `TIDE_REQUIRE_LOGIN=false`. The environment variable overrides the stored setting in both directions, so it drops the requirement without touching the database.
:::

## Features

### Queue Management

- Set queue order per torrent
- Limit max active downloads
- Limit max active seeders
- Pause and resume torrents
- Reannounce trackers on demand

### Transfer Controls

- Global download and upload limits
- Per-torrent speed limits
- Ratio-based stop rules
- Seed-time stop rules
- Default ratio and seed-time goals applied to newly added torrents, with per-torrent overrides

### File & Piece Controls

- Toggle files on and off
- Apply file priority levels
- Convert priorities into piece selection behavior
- Inspect a compact piece map before opening full details

### Swarm Details

- Tracker status
- Peer list
- Piece completion overview
- Availability indicators

## Deployment

Tide can run:

- locally during development
- in Docker
- on a self-hosted server

Example Docker environment:

```bash
docker run -p 3000:3000 \
  -e TIDE_DOWNLOADS_DIR=/downloads \
  -e TIDE_AUTH_USERNAME=admin \
  -e TIDE_AUTH_PASSWORD=change-me \
  getcoral/tide:latest
```

## Related

- [Running a stack with Docker Compose](/getting-started/docker-compose/) — Tide feeding Librarian, with the mount layout worked out
- [Librarian](/modules/librarian/) — imports what Tide finishes
- [Module contracts](/getting-started/module-contracts/) — Tide is the worked example
- [Tide vs qBittorrent](https://getcoral.dev/compare/tide-vs-qbittorrent) — an honest comparison
- [Get-Coral/tide on GitHub](https://github.com/Get-Coral/tide)
