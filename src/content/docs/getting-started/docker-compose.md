---
title: Running a stack with Docker Compose
description: A working Jellyfin, Aurora, Tide and Librarian stack — including the mount layout that makes hardlinked imports work.
---

Coral modules are independent containers. They connect to each other through a
shared Jellyfin server and, where it matters, a shared filesystem. This page is
a working example of that: Jellyfin, Aurora, Tide and Librarian, with
persistent storage.

## The shape of it

```
Tide downloads  ->  library/downloads/incomplete   (in progress, unscanned)
          done  ->  library/downloads/complete     (moved with a rename)
                      |
                      v
Librarian imports it into library/media/movies or library/media/tv
  (a hardlink: no extra disk, and the torrent keeps seeding)
                      |
                      v
Jellyfin scans media/ and finds it named the way it expects
                      |
                      v
Aurora reads Jellyfin at http://jellyfin:8096 and shows it
```

Each service has its own page: [Aurora](/modules/aurora/),
[Tide](/modules/tide/) and [Librarian](/modules/librarian/). The cross-module
link between Tide and Librarian is described in
[Module contracts](/getting-started/module-contracts/).

Aurora proxies all Jellyfin traffic server-side, so the browser never contacts
Jellyfin directly. That is why an internal service name works for
`JELLYFIN_URL` — it only has to resolve from inside Aurora's container.

## Directory layout

```
coral/
├── compose.yaml
├── .env
├── jellyfin/{config,cache}/
├── library/                 <- ONE mount, shared by the three that touch files
│   ├── media/{movies,tv}/
│   └── downloads/
│       ├── complete/        <- Tide writes here; Librarian imports from here
│       └── incomplete/
├── aurora-data/
├── tide-data/
└── librarian-data/
```

## compose.yaml

```yaml
name: coral

services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    restart: unless-stopped
    user: "${PUID}:${PGID}"
    ports:
      - "8096:8096"
    environment:
      TZ: ${TZ}
    volumes:
      - ./jellyfin/config:/config
      - ./jellyfin/cache:/cache
      # One mount. Add /library/media/movies and /library/media/tv as
      # libraries; do not add /library/downloads.
      - ./library:/library
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
    user: "${PUID}:${PGID}"
    ports:
      # loopback only unless you set TIDE_AUTH_USERNAME / TIDE_AUTH_PASSWORD
      - "127.0.0.1:3001:3000"
    environment:
      TIDE_DATA_DIR: /data
      TIDE_DOWNLOADS_DIR: /library/downloads/complete
      TIDE_MEMORY_LIMIT_MB: "4096"
      TIDE_MEMORY_PAUSE_MB: "3584"
      TIDE_MEMORY_RESUME_MB: "3072"
    volumes:
      - ./tide-data:/data
      - ./library:/library   # single mount: see note below
    mem_limit: 4g
    networks: [coral]

  librarian:
    image: getcoral/librarian:latest
    restart: unless-stopped
    user: "${PUID}:${PGID}"
    depends_on: [jellyfin]
    ports:
      - "127.0.0.1:3002:3000"
    environment:
      LIBRARIAN_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
      # Seeds the roots. They arrive switched off — turn them on in the UI.
      LIBRARIAN_DOWNLOADS_DIR: /library/downloads/complete
      LIBRARIAN_MEDIA_DIR: /library/media/movies
    volumes:
      - ./librarian-data:/data
      # The same single mount, at the same path, as Jellyfin and Tide.
      # See "One mount, not one per directory" below.
      - ./library:/library
    networks: [coral]

networks:
  coral:
    driver: bridge
```

## .env

```ini
TZ=Europe/Brussels

# Your own user, so the three containers that share files agree on ownership.
# id -u / id -g
PUID=1000
PGID=1000

# From Jellyfin: Dashboard -> API Keys
JELLYFIN_API_KEY=
# The user's UUID, not their username
JELLYFIN_USER_ID=
JELLYFIN_USERNAME=
JELLYFIN_PASSWORD=
```

## Details that matter

**Tide needs its complete and incomplete directories on one mount too**, for
the same reason and with the same symptom. It derives the in-progress
directory as a sibling of `TIDE_DOWNLOADS_DIR`, so
`/library/downloads/complete` implies `/library/downloads/incomplete`. Under
one `./library` mount a finished torrent is moved with a rename; split them
and every completed download becomes a full copy.

**One mount, not one per directory.** This is the detail that decides whether
imports cost nothing or cost a full copy, and it is not the one you would
guess.

Librarian imports by hardlinking: the file appears in your library at zero
bytes and the torrent carries on seeding the same data. A hardlink cannot
cross a filesystem — but it also cannot cross a *mount point*, even when both
sides are the same filesystem. Bind-mounting `./media` and `./downloads`
separately is enough to break it:

```
/media     dev = 36
/downloads dev = 36     <- same device
link() -> EXDEV         <- refused anyway
```

That is why everything here mounts one `./library` tree instead, with media
and downloads as directories inside it. Awkward-looking paths, working
hardlinks.

Two consequences worth knowing:

- Nothing that inspects `statSync().dev` can predict this, which is why
  Librarian decides by *attempting* a link rather than comparing device ids.
- If it does fall back, nothing breaks. The import becomes a verified copy —
  correct, just slower and twice the space. You will see "Copy" rather than
  "Hardlink" in the import preview, which is the place to check.

**The same path everywhere.** All three services mount that tree at
`/library`, so every module means the same thing by a path and nothing has to
be translated. Mount it somewhere different in each and you will be filling in
Librarian's path-mapping table by hand for no reason. It can do that; the
table is meant to stay empty.

**`user:` has to match across the three containers that share files.** Tide
writes a download, Librarian links it into the library, Jellyfin reads it. If
they run as different users, the second step fails on permissions. Set `PUID`
and `PGID` in `.env` to your own `id -u` and `id -g`. Librarian never chowns
anything — it is not going to start rewriting ownership on your library.

**Do not add `/library/downloads` as a Jellyfin library.** It is staging, not
a library. Point Jellyfin at `/library/media/movies` and `/library/media/tv`
and let Librarian move finished downloads into them — that is the whole point
of having it.

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
2. Open `http://localhost:8096` and complete the setup wizard and add your
   libraries — `/library/media/movies` and `/library/media/tv`

   Do **not** add `/library/downloads` as a library if you are running
   Librarian. That is what strands finished downloads in a "Downloads"
   library instead of filing them where they belong; Librarian imports them
   into the real ones. Without Librarian, add
   `/library/downloads/complete` and accept the stranding.
3. Create an API key under **Dashboard → API Keys**
4. Put the key, your user's **UUID** (not the username), your username and
   password, and your `PUID`/`PGID` into `.env`
5. `docker compose up -d`
6. Open Librarian at `http://localhost:3002`. **It will ask you to sign in.**
   Librarian requires a Jellyfin sign-in by default, and anything that touches
   the filesystem additionally requires that account to be a Jellyfin
   **administrator** — it moves and deletes files, so it does not default open
   the way Aurora and Tide do.
7. Connect it to Jellyfin, then turn on the two roots it seeded. Roots arrive
   switched off: a mounted directory is not permission to write to it.

`JELLYFIN_USER_ID` must be the UUID. The API key alone is enough to browse;
username and password additionally open a real playback session, which is what
makes watch progress sync back to Jellyfin.

## On macOS

Jellyfin cannot reach VideoToolbox from a Linux container, so transcoding is
CPU-only — Direct Play is fine, 4K transcoding is not. Jellyfin's real-time
library monitoring also depends on inotify, which is unreliable over macOS bind
mounts; rely on the scheduled scan or trigger one by hand.

## Related

- [Aurora](/modules/aurora/), [Tide](/modules/tide/), [Librarian](/modules/librarian/) — the three modules in this stack
- [Module contracts](/getting-started/module-contracts/) — how Tide tells Librarian a download finished
