---
title: Librarian
description: A Coral module for organizing and enriching self-hosted media libraries
---

## Librarian

Librarian is the Coral module focused on media hygiene and enrichment. It provides tools for organizing, enriching, and maintaining your self-hosted Jellyfin media libraries.

Keep your media organized, metadata enriched, and everything running smoothly.

### What It Does

Librarian offers:
- **Library management** - Organize and optimize your collections
- **Metadata enrichment** - Enhance missing information
- **Duplicate detection** - Find and clean up duplicates
- **Quality assurance** - Tools for maintaining library health
- **Bulk operations** - Manage items across your library
- **Local connection** - SQLite-backed Jellyfin settings

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Running Jellyfin server

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Get-Coral/librarian.git
cd librarian
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables (optional):
```bash
JELLYFIN_URL=http://your-server:8096
JELLYFIN_API_KEY=your-api-key
JELLYFIN_USER_ID=your-user-id
```

If not set in environment, Librarian will prompt for connection on startup and store settings locally.

4. Start the development server:
```bash
pnpm dev
```

App runs at `http://localhost:3000`

## Features

### Library Organization

- **Organize by type** - Movies, TV shows, music, books
- **Create collections** - Group related content
- **Manage folders** - Physical library structure
- **Cleanup tools** - Remove orphaned files

### Metadata Management

- **Missing metadata** - Identify items needing information
- **Bulk editing** - Update multiple items at once
- **Match against sources** - Auto-populate from external APIs
- **Custom metadata** - Add your own tags and fields

### Library Health

- **Duplicate detection** - Find and manage duplicates
- **File validation** - Check format compatibility
- **Performance optimization** - Index and cache management
- **Backup tools** - Export library configuration

### Analytics

- **Library statistics** - Size, growth, composition
- **Format analysis** - What codecs and containers you use
- **Utilization metrics** - Storage and performance data

## Configuration

### Environment Variables

Set these for automatic connection:

```bash
JELLYFIN_URL=http://your-server:8096
JELLYFIN_API_KEY=your-api-key
JELLYFIN_USER_ID=your-user-id
```

### Local Storage

Connection settings are stored in SQLite at `./data/librarian.sqlite`.

## Development

Librarian is built with:
- [TanStack Start](https://tanstack.com/start)
- React 19
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS v4](https://tailwindcss.com)
- Jellyfin API

### Key Directories

- `src/routes/` - Page and API routes
- `src/components/` - UI components
- `src/lib/` - Utilities and helpers
- `src/data/` - Data storage

## Deployment

Deploy Librarian to:
- Vercel
- Docker (Dockerfile included)
- Self-hosted servers

Production build:
```bash
pnpm build
pnpm preview
```

## Learn More

- [Jellyfin API Client](/libraries/jellyfin/) - API integration details
- [Contributing](/contributing/getting-started/) - Contribute features

## Repository

[Get-Coral/librarian on GitHub](https://github.com/Get-Coral/librarian)
