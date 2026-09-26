---
title: Running a stack with Docker Compose
description: A working Jellyfin + Aurora + Tide stack, with the wiring between them explained
---

## Running a stack with Docker Compose

Coral modules are independent containers. They connect to each other through a
shared Jellyfin server and, where it matters, a shared filesystem. This page is
a working example of that: Jellyfin, Aurora and Tide, with persistent storage.

## The shape of it

```
Tide downloads  ->  downloads/incomplete   (in progress, hidden from Jellyfin)
          done  ->  downloads/complete     (moved with a rename)
                      |
                      v
Jellyfin scans downloads/complete as a library (mounted read-only)
                      |
                      v
Aurora reads Jellyfin at http://jellyfin:8096 and shows it
```

Aurora proxies all Jellyfin traffic server-side, so the browser never contacts
Jellyfin directly. That is why an internal service name works for
`JELLYFIN_URL` — it only has to resolve from inside Aurora's container.

## Directory layout

```
coral/
├── compose.yaml
├── .env
├── jellyfin/{config,cache}/
├── media/{movies,tv}/
├── downloads/
│   ├── complete/      <- Tide writes here; Jellyfin library
│   └── incomplete/
├── aurora-data/
└── tide-data/
```

## compose.yaml

```yaml
name: coral

services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    restart: unless-stopped
    ports:
      - "8096:8096"
    environment:
      TZ: ${TZ}
    volumes:
      - ./jellyfin/config:/config
      - ./jellyfin/cache:/cache
      - ./media:/media
      - ./downloads/complete:/downloads:ro   # completed only — no partial files
    networks: [coral]

  aurora:
    image: getcoral/aurora:latest
    restart: unless-stopped
    depends_on: [jellyfin]
    ports:
      - "3000:3000"
    environment:
      AURORA_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
      JELLYFIN_USERNAME: ${JELLYFIN_USERNAME}
      JELLYFIN_PASSWORD: ${JELLYFIN_PASSWORD}
    volumes:
      - ./aurora-data:/data
    networks: [coral]
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 5
      start_period: 20s

  tide:
    image: getcoral/tide:latest
    restart: unless-stopped
    ports:
      # loopback only unless you set TIDE_AUTH_USERNAME / TIDE_AUTH_PASSWORD
      - "127.0.0.1:3001:3000"
    environment:
      TIDE_DATA_DIR: /data
      TIDE_DOWNLOADS_DIR: /downloads/complete
      TIDE_MEMORY_LIMIT_MB: "4096"
      TIDE_MEMORY_PAUSE_MB: "3584"
      TIDE_MEMORY_RESUME_MB: "3072"
    volumes:
      - ./tide-data:/data
      - ./downloads:/downloads   # single mount: see note below
    mem_limit: 4g
    networks: [coral]

networks:
  coral:
    driver: bridge
```

## Details that matter

**Keep Tide's complete and incomplete directories on one mount.** Tide derives
its in-progress directory as a sibling of `TIDE_DOWNLOADS_DIR`, so
`/downloads/complete` implies `/downloads/incomplete`. Mounting `./downloads`
once means a finished torrent is moved with a rename. Mount them separately and
every completed download becomes a full file copy across devices instead.

**Jellyfin only sees the completed directory**, read-only. Partial files never
reach the scanner and cannot be half-imported.

**Both Aurora and Tide default to port 3000 inside their containers.** They are
separate containers, so only the host-side mapping has to differ.

**Cap Tide's memory.** Tide reads the container memory limit from cgroups and
pauses torrents as it approaches it. Without `mem_limit`, there is nothing for
it to read and nothing to pause against.

**Tide has no authentication by default.** The example binds it to `127.0.0.1`
for that reason. If you publish it on `0.0.0.0`, set `TIDE_AUTH_USERNAME` and
`TIDE_AUTH_PASSWORD` first.

## First run

Jellyfin has to exist before Aurora can be pointed at it.

1. `docker compose up -d jellyfin`
2. Open `http://localhost:8096` and complete the setup wizard, adding your
   libraries plus one pointing at `/downloads`
3. Create an API key under **Dashboard → API Keys**
4. Put the key, your user's **UUID** (not the username), and your username and
   password into `.env`
5. `docker compose up -d`

`JELLYFIN_USER_ID` must be the UUID. The API key alone is enough to browse;
username and password additionally open a real playback session, which is what
makes watch progress sync back to Jellyfin.

## On macOS

Jellyfin cannot reach VideoToolbox from a Linux container, so transcoding is
CPU-only — Direct Play is fine, 4K transcoding is not. Jellyfin's real-time
library monitoring also depends on inotify, which is unreliable over macOS bind
mounts; rely on the scheduled scan or trigger one by hand.
