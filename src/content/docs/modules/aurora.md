---
title: Aurora
description: A premium Jellyfin frontend built with TanStack Start and React
---

## Aurora UI

Aurora is a premium Jellyfin frontend built with TanStack Start and React. It keeps Jellyfin as the source of truth while layering on a more cinematic home experience, richer detail views, embedded playback, favorites, genre browsing, and translation-ready UI foundations.

## Version

- Current release: **1.4.0**
- Status: `Unreleased` changes are present on main
- GHCR image: [`ghcr.io/get-coral/aurora-ui`](https://ghcr.io/get-coral/aurora-ui)

### Highlights

- **Jellyfin-powered home screen** with featured, continue watching, favorites, and recommendation rails
- **Embedded playback** with progress sync back to Jellyfin
- **Rich title detail views** with cast, related titles, and series episode context
- **Movie and series library pages** with genre browsing, sorting, and pagination
- **My List / Favorites workflow** backed by Jellyfin favorites
- **Translation-ready UI** with locale files contributors can extend
- **Local-first onboarding** backed by SQLite so self-hosting doesn't require an external database

## Stack

- [TanStack Start](https://tanstack.com/start) - React SSR framework
- React 19
- [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query)
- Tailwind CSS v4
- Jellyfin API

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Running Jellyfin server

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Get-Coral/aurora.git
cd aurora
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Set your Jellyfin URL and credentials:
```
JELLYFIN_URL=http://your-server:8096
JELLYFIN_API_KEY=your-api-key
JELLYFIN_USER_ID=your-user-id
```

5. Start development server:
```bash
pnpm dev
```

Aurora will be available at `http://localhost:3000`

## Features in Detail

### Home Screen
- Personalized welcome with user avatars
- Featured content rail
- Continue watching recommendations
- Favorites collection
- New releases

### Browse & Search
- Browse by genre
- Full-text search
- Library browsing
- Advanced filtering and sorting

### Playback
- Embedded video player
- Progress tracking
- Resume from reading position
- Cast information
- Related content suggestions

### User Preferences
- Favorites management
- Playback preferences
- Theme customization
- Language selection

## Development

Aurora uses TanStack Start for server-side rendering with:
- File-based routing in `src/routes/`
- API endpoints for backend integration
- React Server Components for data fetching
- Client-side hydration for interactivity

### Key directories:
- `src/routes/` - Page components and API endpoints
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities and helpers
- `src/integrations/` - Third-party service integration

## Deployment

Aurora can be deployed to:
- Vercel
- Docker (Dockerfile included)
- Self-hosted servers

For production builds:
```bash
pnpm build
pnpm preview
```

## Contributing

Aurora is open source and welcomes contributions. See the [Contributing](/contributing/getting-started/) guide for details.

## Repository

[Get-Coral/aurora on GitHub](https://github.com/Get-Coral/aurora)
