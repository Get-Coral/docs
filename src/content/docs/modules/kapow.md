---
title: KAPOW
description: Comic-book karaoke queue manager for group entertainment
---

## KAPOW

KAPOW is a comic-book karaoke queue manager. Hosts spin up a room, guests scan a QR code and search for tracks, the crowd votes songs up the queue, and the host runs the night from a dedicated control booth.

Perfect for parties, events, and group entertainment nights.

### How It Works

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

- Node.js 18+
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

4. Add your credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_DB_PASSWORD=your-db-password
YOUTUBE_API_KEY=AIzaS...
```

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
4. Go to host control at `/host/:code`

### As Guest

1. Scan QR code or visit with the 6-digit code
2. Enter your name
3. Search for karaoke tracks
4. Add songs to queue
5. Vote on pending songs

## Deployment

Deploy KAPOW to:
- Vercel
- Docker
- Self-hosted servers

Configure Supabase connection for production and ensure YouTube API limits are set appropriately.

Production build:
```bash
pnpm build
pnpm preview
```

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

## Repository

[Get-Coral/KAPOW on GitHub](https://github.com/Get-Coral/KAPOW)
