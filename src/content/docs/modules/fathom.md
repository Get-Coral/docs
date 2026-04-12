---
title: Fathom
description: A reading module for Jellyfin. Books, manga, comics, and PDFs in a calm interface
---

## Fathom

Fathom is the Coral reading room. It connects to Jellyfin and turns reading libraries into a cleaner browsing experience with a featured shelf, recent additions, library browsing, collection browsing, and rich title details with metadata.

A cover-first interface designed for a calm, focused reading experience.

### What It Is

Fathom provides:
- **Featured shelf** - Curated reading selections
- **Recent additions** - New books, manga, comics
- **Library browsing** - Organized by collections
- **Collection browsing** - Group related content
- **Title detail** - Complete metadata and contributor information
- **Local connection** - SQLite-backed Jellyfin settings, with `.env` support

### Supported Media

- Books (EPUB, PDF, etc.)
- Manga
- Comics
- Audiobooks and more

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Running Jellyfin server with reading library

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Get-Coral/fathom.git
cd fathom
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
JELLYFIN_URL=http://your-server:8096
JELLYFIN_API_KEY=your-api-key
JELLYFIN_USER_ID=your-user-id
```

Connection details can also be configured in the web UI on first run, and will be stored locally in SQLite.

4. Start the development server:
```bash
pnpm dev
```

Fathom runs on `http://localhost:3000`

## Configuration

Fathom supports the same connection model as other Coral modules.

### Environment Variables

```bash
JELLYFIN_URL=http://your-server:8096
JELLYFIN_API_KEY=your-api-key
JELLYFIN_USER_ID=your-user-id
```

If these are not set, Fathom will open a setup screen on first run and store the connection details locally.

### Local Storage

Connection settings are stored in SQLite at `./data/fathom.sqlite` for a self-hosted setup without external database requirements.

## Features

### Browse
- View all reading libraries
- Browse by collection
- Search across your library
- Filter by media type

### Discover
- Featured and highlighted titles
- Recent additions
- Curated collections
- Recommendation algorithms

### Reading Management
- Track reading progress
- Mark as favorites
- Create personal collections
- Rating and reviews

### Library Metadata
- Full book information
- Contributors and authors
- Descriptions and summaries
- Cover art and thumbnails

## Development

Fathom is built with:
- [TanStack Start](https://tanstack.com/start)
- React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- Jellyfin API

### Project Structure

- `src/routes/` - Page components
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities and helpers
- `src/data/` - Data directory for SQLite

## Deployment

Deploy Fathom to:
- Vercel
- Docker
- Self-hosted servers

For production:
```bash
pnpm build
pnpm preview
```

## Learn More

- [Jellyfin API Client](/libraries/jellyfin/) - Building custom reading interfaces
- [Contributing](/contributing/getting-started/) - Extend Fathom

## Repository

[Get-Coral/fathom on GitHub](https://github.com/Get-Coral/fathom)
