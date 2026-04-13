---
title: Tide
description: A torrent downloader for Jellyfin-adjacent media workflows with queue controls, piece maps, and self-hosted auth
---

## Tide

Tide is Coral's torrent download manager. It gives you a cleaner, self-hosted interface for adding torrents, managing queue order, limiting active downloads and seeders, adjusting file priorities, and inspecting live swarm health with an expandable piece map.

## Highlights

- **Quick add workflow** from the home board, including clipboard paste for copied magnet links
- **True queue enforcement** with max active downloads and max active seeders
- **Inline torrent details** with on-demand piece map, tracker state, and peer list
- **Per-file piece selection priorities** instead of metadata-only file toggles
- **Local SQLite persistence** for queue state, torrent controls, and app settings
- **Basic auth support** similar to Transmission for protecting the whole app
- **Configurable downloads directory** via `.env`

## Getting Started

### Prerequisites

- Node.js 18+
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
TIDE_AUTH_USERNAME=admin
TIDE_AUTH_PASSWORD=change-me
```

### Storage

Tide stores persistent state in SQLite at `./data/tide.sqlite` by default. That includes:

- global queue settings
- torrent control state
- restored torrent sessions

### Downloads Directory

Downloaded content goes to `TIDE_DOWNLOADS_DIR`. If that variable is missing, Tide falls back to `./data/downloads`.

### Basic Authentication

If both `TIDE_AUTH_USERNAME` and `TIDE_AUTH_PASSWORD` are set, Tide protects the entire UI and API behind HTTP basic auth.

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
  ghcr.io/get-coral/tide:latest
```

## Repository

[Get-Coral/tide on GitHub](https://github.com/Get-Coral/tide)
