---
title: Tide
description: A torrent downloader for Jellyfin-adjacent media workflows with queue controls, piece maps, and optional Jellyfin sign-in
---

## Tide

Tide is Coral's torrent download manager. It gives you a cleaner, self-hosted interface for adding torrents, managing queue order, limiting active downloads and seeders, adjusting file priorities, and inspecting live swarm health with an expandable piece map.

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

```bash
TIDE_DOWNLOADS_DIR=./data/downloads
TIDE_DATA_DIR=./data

# Optional HTTP basic auth
TIDE_AUTH_USERNAME=admin
TIDE_AUTH_PASSWORD=change-me

# Optional Jellyfin sign-in. The URL can also be set from the UI.
TIDE_JELLYFIN_URL=https://jellyfin.example.com
TIDE_REQUIRE_LOGIN=true
```

### Storage

Tide stores persistent state in SQLite at `./data/tide.sqlite` by default. That includes:

- global queue settings
- torrent control state
- restored torrent sessions
- the Jellyfin connection and sign-in settings
- active sign-in sessions

### Downloads Directory

Downloaded content goes to `TIDE_DOWNLOADS_DIR`. If that variable is missing, Tide falls back to `./data/downloads`.

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

## Repository

[Get-Coral/tide on GitHub](https://github.com/Get-Coral/tide)
