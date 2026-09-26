---
title: Aurora
description: A premium Jellyfin frontend built with TanStack Start and React
---

## Aurora UI

Aurora is a premium Jellyfin frontend built with TanStack Start and React. It keeps Jellyfin as the source of truth while layering on a more cinematic home experience, richer detail views, embedded playback, favorites, genre browsing, and translation-ready UI foundations.

### Highlights

- **Jellyfin-powered home screen** with featured, continue watching, favorites, and recommendation rails
- **Embedded playback** with progress sync back to Jellyfin
- **Rich title detail views** with cast, related titles, and series episode context
- **Movie and series library pages** with genre browsing, filtering, sorting, and pagination
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
  ghcr.io/get-coral/aurora:latest
```

Open `http://localhost:3000` and complete the onboarding flow once — Aurora persists the Jellyfin connection in `/data/aurora.sqlite`. Alternatively, skip onboarding by passing the Jellyfin environment variables below.

## Local Development

### Prerequisites

- Node.js 24 LTS (Node 22.5+ is the hard floor — this module uses the
  built-in `node:sqlite` module, which does not exist on Node 18 or 20)
- pnpm
- A running Jellyfin server

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

All configuration can be done through the in-app setup and settings screens; environment variables are optional overrides.

| Variable | Purpose |
| --- | --- |
| `JELLYFIN_URL` | Jellyfin server URL |
| `JELLYFIN_API_KEY` | Jellyfin API key |
| `JELLYFIN_USER_ID` | UUID of the primary Jellyfin user |
| `JELLYFIN_USERNAME` / `JELLYFIN_PASSWORD` | Used for the playback session when sign-in is not required |
| `AURORA_REQUIRE_LOGIN` | `true` forces required sign-in and locks the toggle |
| `AURORA_MULTI_USER` | `true` forces multi-user profiles and locks the toggle |
| `AURORA_DATA_DIR` | Where the local SQLite database lives (default `./data`) |

## User Profiles & Sign-In

Aurora supports shared households out of the box:

- **Profiles**: enable multi-user mode in Settings → User profiles (or `AURORA_MULTI_USER=true`). Everyone picks their own Jellyfin user on a profile screen when opening Aurora.
- **Required sign-in**: if your instance is reachable from the internet, enable it in Settings → Security (or `AURORA_REQUIRE_LOGIN=true`). Everyone must then sign in with their Jellyfin username and password before Aurora serves anything — sessions are validated against Jellyfin, stored server-side, and each user's playback runs under their own Jellyfin session.
- **Admin dashboard**: Jellyfin administrators can create, disable, and delete users, edit parental controls, trigger library scans, and watch active sessions from `/admin`.

## Deployment

Aurora ships as a Node server with a production Dockerfile. The GitHub Actions workflows build and publish the container to GitHub Container Registry on every release.

```bash
pnpm build
pnpm start
```

## Contributing

Aurora is open source and welcomes contributions. See the [Contributing](/contributing/getting-started/) guide for details.

## Repository

[Get-Coral/aurora on GitHub](https://github.com/Get-Coral/aurora)
