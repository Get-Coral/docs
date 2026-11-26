---
title: Aurora Cinema
description: Set up Aurora Cinema for Jellyfin or IPTV. Learn how to configure Docker, add IPTV sources, and build for TV, desktop, and Meta Quest.
---

Aurora Cinema is a media client for a Jellyfin server, your own IPTV sources, or both.

:::note[Shipping]
The setup below covers [Aurora Cinema 1.17.0](https://github.com/Get-Coral/aurora/releases/tag/v1.17.0).
:::

## Highlights

- **Jellyfin-powered home screen** with featured, continue watching, favorites, and recommendation rails
- **Embedded playback** with progress sync back to Jellyfin
- **Rich title detail views** with cast, related titles, and series episode context
- **Movie and series library pages** with genre browsing, sorting, and pagination
- **My List / Favorites workflow** backed by Jellyfin favorites
- **Multi-user profiles** with a Netflix-style profile picker for shared households
- **Optional required sign-in** with per-user Jellyfin sessions, so playback and watch progress are attributed to the right account
- **Admin dashboard** for managing users, parental controls, libraries, and active sessions
- **TV mode** with larger text and remote-friendly navigation, plus light/dark themes and translations (English, Dutch)
- **Local-first onboarding** backed by SQLite so self-hosting doesn't require an external database
- **PWA and Capacitor wrappers** for installable web, Android, and iOS builds

## Stack

- [TanStack Start](https://tanstack.com/start) - React SSR framework
- React 19
- [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query)
- Tailwind CSS v4
- [@get-coral/jellyfin](/libraries/jellyfin/) for all Jellyfin API access

## Running with Docker

The recommended way to self-host Aurora:

```bash
docker run -d -p 3000:3000 \
  -v aurora-data:/data \
  getcoral/aurora:latest
```

Open `http://localhost:3000` and follow the Jellyfin setup, or
[configure IPTV](#iptv-sources) and choose **Use Aurora with IPTV only**.
Keep the `/data` volume when recreating the container so Aurora retains its setup.

To upgrade an existing Compose service named `aurora`:

```bash
docker compose pull aurora
docker compose up -d aurora
```

Aurora serves on port `3000` and exposes `/healthz`, which returns non-200 until
the server is ready — useful as a Docker healthcheck.

For a full stack with Jellyfin, Tide and Librarian alongside it, see
[Running a stack with Docker Compose](/getting-started/docker-compose/).

## Local Development

### Prerequisites

- Node.js 24 LTS (Node 22.5+ is the hard floor — this module uses the
  built-in `node:sqlite` module, which does not exist on Node 18 or 20)
- pnpm
- A running Jellyfin server for Jellyfin development, or an IPTV source for IPTV-only setup

### Setup

```bash
git clone https://github.com/Get-Coral/aurora.git
cd aurora
pnpm install
cp .env.example .env   # optional: skips the in-app setup flow
pnpm dev
```

Aurora will be available at `http://localhost:3000`.

## Configuration

Configure Jellyfin in setup or via environment variables. Self-hosted IPTV
also needs a server-side origin allowlist. The variables below are checked
against [Aurora's tagged `.env.example`](https://github.com/Get-Coral/aurora/blob/v1.17.0/.env.example)
and runtime configuration.

| Variable | Purpose |
| --- | --- |
| `JELLYFIN_URL` | Jellyfin server URL |
| `JELLYFIN_API_KEY` | Jellyfin API key |
| `JELLYFIN_USER_ID` | UUID of the primary Jellyfin user |
| `JELLYFIN_USERNAME` / `JELLYFIN_PASSWORD` | Used for the playback session when sign-in is not required |
| `AURORA_REQUIRE_LOGIN` | `true` forces required sign-in and locks the toggle |
| `AURORA_MULTI_USER` | `true` forces multi-user profiles and locks the toggle |
| `AURORA_DATA_DIR` | Where the local SQLite database lives (default `./data`) |
| `AURORA_IPTV_ORIGINS` | Comma-separated provider origins. Required to enable IPTV on the self-hosted server |
| `AURORA_IPTV_STRICT_ORIGINS` | Set to `true` to require listed origins for redirects, media segments, and artwork as well |
| `AURORA_IPTV_FFMPEG` | Optional FFmpeg executable in the server environment for compatible playback of formats such as MKV and AVI |
| `AURORA_IPTV_FFPROBE` | Optional ffprobe executable path. Aurora normally looks beside FFmpeg |
| `AURORA_IPTV_SOURCE_KEY` | Optional 64-character hex key used to encrypt saved IPTV sources. Otherwise Aurora generates a key in the data directory |
| `HOST` | Interface the server binds to (default `0.0.0.0`) |
| `PORT` | Port the server listens on (default `3000`) |
| `AURORA_STREAM_TOKEN_SECRET` | Signing secret for AirPlay/Cast stream URLs. Generated and stored automatically if unset — set it to keep URLs valid across data directories. Changing it invalidates every stream URL already handed to a TV |
| `AURORA_DISABLE_SPA_PRERENDER` | Build-time. Skips SPA prerendering; the published image sets it |

`AURORA_APP_URL` is a build-time variable for the Capacitor native shells only
(`capacitor.config.ts`); it has no effect on the server.

`aurora/.env.example` still lists `PLEX_URL` and `PLEX_TOKEN`. Nothing reads
them — they are leftovers from a dropped experiment, and setting them does
nothing.

## IPTV sources

1. Set `AURORA_IPTV_ORIGINS` on the Aurora server and restart it. In Compose,
   add the variable under the Aurora service's `environment` and recreate the
   service. Use the provider's origin, such as `https://provider.example`.
   Include the scheme and any non-default port. Keep paths and credentials in
   the source settings.
2. Open **Settings → IPTV sources** as an administrator. For a fresh install
   without Jellyfin, choose **Use Aurora with IPTV only** during setup.
3. Add an **Xtream Codes** server with its credentials, an **M3U playlist URL**,
   or a **direct stream URL**. Add an optional XMLTV URL if your provider
   supplies a separate programme guide.
4. Open **Live TV** for channels and the guide. Open **Films** or **Series** for
   the provider’s on-demand catalog. If Jellyfin is also connected, its library
   appears in those same views.

The guide, catch-up and on-demand catalog depend on the IPTV source.
Use Jellyfin's own client for its tuner and DVR features.

If a provider redirects to other public origins for playback, check whether
strict origins are enabled. See the
[release README](https://github.com/Get-Coral/aurora/tree/v1.17.0#iptv-sources)
for provider-specific playback and FFmpeg options.

## User Profiles & Sign-In

Aurora supports shared households out of the box:

- **Profiles**: enable multi-user mode in Settings → User profiles (or `AURORA_MULTI_USER=true`). Everyone picks their own Jellyfin user on a profile screen when opening Aurora.
- **Required sign-in**: if your instance is reachable from the internet, enable it in Settings → Security (or `AURORA_REQUIRE_LOGIN=true`). Everyone must then sign in with their Jellyfin username and password before Aurora serves anything — sessions are validated against Jellyfin, stored server-side, and each user's playback runs under their own Jellyfin session.
- **Admin dashboard**: Jellyfin administrators can create, disable, and delete users, edit parental controls, trigger library scans, and watch active sessions from `/admin`.

## Playback

Move along the progress bar to preview a scene when thumbnails are available.
The bar also shows the buffered range. Click or drag the seek control to jump
to another point, including in Safari.

On Android phones, tablets and TVs, file-based IPTV films and episodes open in the native
player. The title’s artwork stays visible while the stream loads. For Dolby
audio that the device cannot decode, the native player can use its bundled
FFmpeg decoder. Self-hosted browser playback uses the server’s FFmpeg and
ffprobe settings for streams that need conversion.

## Deployment

Aurora ships as a Node server with a production Dockerfile. On every release the
GitHub Actions workflow publishes the image to **both** Docker Hub
(`getcoral/aurora`) and the GitHub Container Registry
(`ghcr.io/get-coral/aurora`). The examples here use Docker Hub.

```bash
pnpm build
pnpm start
```

`pnpm start` runs `node server.mjs` and is what the image runs.

### Native builds

Aurora also ships PWA and Capacitor wrappers for installable web, Android and
iOS builds. Those need JDK 21 and the `pnpm cap:*` scripts; the
[repository README](https://github.com/Get-Coral/aurora#readme) is the reference
for that workflow.

### Android TV and Google TV

The Android build has a TV launcher entry and remote navigation. Use the
directional pad and OK to browse the denser rows. When the native player’s
controls open, focus starts on Play. In the live player, Up/Down or the channel
buttons change channels. To test from source, select an Android TV device or
emulator and run `pnpm cap:run:android`. See the
[tagged native build instructions](https://github.com/Get-Coral/aurora/tree/v1.17.0#native-setup)
for packaging and dependencies.

### Desktop and Meta Quest

- **macOS and Windows** use the Tauri desktop build. Run `pnpm desktop:build`
  on the target platform after installing the prerequisites in the
  [desktop build guide](https://github.com/Get-Coral/aurora/tree/v1.17.0#desktop-app-macos--windows).
- **Meta Quest** uses a separate Android build flavor. With a developer-enabled
  headset connected, run `pnpm android:quest:install`. Aurora opens in a 2D
  panel. Select **Watch in the theater** in the player to enter an immersive
  environment. See [Meta Quest builds](https://github.com/Get-Coral/aurora/tree/v1.17.0#meta-quest-builds).

These instructions build from the tagged source. Store availability depends
on the platform's release process.

## Contributing

Aurora is open source and welcomes contributions. See the [Contributing](/contributing/getting-started/) guide for details.

## Related

- [Aurora vs the Jellyfin web client](https://getcoral.dev/compare/aurora-vs-jellyfin-web) — what the stock client still does better
- [Running a stack with Docker Compose](/getting-started/docker-compose/)
- [Marquee](/modules/marquee/) — the passive display counterpart
- [Jellyfin API Client](/libraries/jellyfin/) — the typed client Aurora is built on
- [Get-Coral/aurora on GitHub](https://github.com/Get-Coral/aurora)
