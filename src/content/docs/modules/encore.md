---
title: Encore
description: A Coral module template for building new applications
---

## Encore

Encore is a Coral ecosystem module built on TanStack Start, Tailwind v4, and the Jellyfin API. It serves as a template and foundation for building new Coral applications.

## Version

- Current version: **0.1.0**
- GHCR image: [`ghcr.io/get-coral/encore`](https://ghcr.io/get-coral/encore)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Get-Coral/encore.git
cd encore
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
JELLYFIN_URL=http://your-server:8096
JELLYFIN_API_KEY=your-api-key
JELLYFIN_USER_ID=your-user-id
```

4. Start development server:
```bash
pnpm dev
```

Encore runs on `http://localhost:3000`

## Stack

| Tool | Purpose |
|------|---------|
| [TanStack Start](https://tanstack.com/start) | Full-stack React framework |
| [TanStack Router](https://tanstack.com/router) | Type-safe file-based routing |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [Tailwind v4](https://tailwindcss.com) | Styling |
| [Biome](https://biomejs.dev) | Linting & formatting |
| [@get-coral/jellyfin](https://github.com/Get-Coral/jellyfin) | Jellyfin API client |
| [Vitest](https://vitest.dev) | Testing |

## Available Scripts

```bash
pnpm dev        # Start dev server on :3000
pnpm build      # Production build
pnpm start      # Run production server
pnpm typecheck  # TypeScript check
pnpm check      # Biome lint + format check
pnpm lint       # Biome lint with auto-fix
pnpm test       # Run tests
```

## Deployment

### Docker

```bash
# Build
docker build -t encore .

# Run
docker run -p 3000:3000 \
  -e JELLYFIN_URL=http://your-nas:8096 \
  -e JELLYFIN_API_KEY=your-key \
  -e JELLYFIN_USER_ID=your-user-id \
  encore
```

### CI/CD

Automated workflows handle:
- **ci.yml** - Run on every PR and push (typecheck, lint, test, build)
- **docker-publish.yml** - Publish to GHCR on release
- **release-please.yml** - Automated versioning and releases

## Contributing

See [Contributing](/contributing/getting-started/) to contribute to Encore.

## Repository

[Get-Coral/encore on GitHub](https://github.com/Get-Coral/encore)
