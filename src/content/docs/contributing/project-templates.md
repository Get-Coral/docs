---
title: Project Templates
description: Building new Coral modules with project templates
---

## Creating a New Coral Module

Coral provides templates to help you build new modules. All Coral modules follow the same architecture and conventions.

## Template Repositories

### Coral Module Template

The standard template for building a new Coral module with TanStack Start, React, Tailwind CSS, and Jellyfin integration.

[Get started with the template](https://github.com/Get-Coral/template)

### What's Included

- **TanStack Start** - React SSR framework
- **File-based routing** - Simple route organization
- **Tailwind CSS v4** - Styling
- **TypeScript** - Full type safety
- **Jellyfin API integration** - Ready to connect
- **Docker** - Container deployment
- **GitHub Actions** - CI/CD workflows
- **Biome** - Linting and formatting
- **pnpm** - Package management

## Creating Your Module

### 1. Use the Template

```bash
# Click "Use this template" on GitHub
# Or clone and customize
git clone https://github.com/Get-Coral/template.git my-module
cd my-module
```

### 2. Rename Your Module

Replace `coral-module` throughout:

```bash
# In package.json
{
  "name": "@get-coral/my-module"
}

# In .github/workflows/docker-publish.yml
IMAGE_NAME=ghcr.io/Get-Coral/my-module

# In README.md
# My Module
```

### 3. Set Up Dependencies

```bash
pnpm install
```

### 4. Create Your App

The template includes:

```
src/routes/
├── index.tsx          # Home page
├── api/
│   └── example.ts     # API endpoint
└── components/        # Reusable components
```

Add your pages and components following TanStack Start conventions.

### 5. Configure Jellyfin Connection

```bash
# .env
JELLYFIN_URL=http://your-server:8096
JELLYFIN_API_KEY=your-api-key
JELLYFIN_USER_ID=your-user-id
```

Or use local SQLite setup like other modules.

### 6. Test Locally

```bash
pnpm dev
```

Runs on `http://localhost:3000`

## Module Structure

### Key Directories

- `src/routes/` - Page components and API routes
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities and helpers
- `src/integrations/` - External service integration
- `public/` - Static assets
- `.github/workflows/` - CI/CD pipelines

### Configuration Files

- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `biome.json` - Linting rules
- `vite.config.ts` - Build config
- `Dockerfile` - Container image
- `.env.example` - Environment template

## Development Workflows

### Local Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run linter
pnpm format       # Format code
pnpm type-check   # Check types
```

### Using TanStack Start

TanStack Start provides:

- **File-based routing** - Files in `src/routes/` become routes
- **API routes** - Create `src/routes/api/` endpoints
- **Server functions** - Call server code from client
- **React Server Components** - Components that run on server

### Building with Jellyfin

Import the client:

```ts
import { createClient, getLibraryItems } from '@get-coral/jellyfin'

const client = createClient({
  url: process.env.JELLYFIN_URL,
  apiKey: process.env.JELLYFIN_API_KEY,
  userId: process.env.JELLYFIN_USER_ID
})

const items = await getLibraryItems(client, {
  parentId: 'library-id'
})
```

## Styling with Tailwind

The template includes Tailwind CSS v4 with:

- Modern utility classes
- Dark mode support
- Responsive design
- Custom configuration

Edit `src/styles.css` to customize colors and theme.

## Docker Deployment

The template includes a `Dockerfile` for containerization:

```bash
# Build image
docker build -t my-module .

# Run container
docker run -p 3000:3000 \
  -e JELLYFIN_URL=http://jellyfin:8096 \
  -e JELLYFIN_API_KEY=key \
  -e JELLYFIN_USER_ID=id \
  my-module
```

## GitHub Actions

The template includes workflows for:

- **Docker publish** - Build and push to container registry
- **Release** - Automated release management (with release-please)
- **Tests** - Run tests on PR

Update `.github/workflows/` for your module.

## Publishing

### npm (for libraries)

If creating a library like the Jellyfin client:

1. Update `package.json` with public scope
2. Configure npm publishing in workflows
3. Create releases on GitHub
4. Package is published to npm

### Docker Registry

For applications and modules:

1. Configure container registry credentials
2. Docker image is built and pushed on release
3. Pull with `docker pull image-name:version`

### Vercel (optional)

For web applications:

1. Connect GitHub repo to Vercel
2. Set environment variables
3. Automatic deployments on push

## Example Implementations

Reference existing modules:

- [Aurora](https://github.com/Get-Coral/aurora) - Full video client
- [Fathom](https://github.com/Get-Coral/fathom) - Reading interface
- [KAPOW](https://github.com/Get-Coral/KAPOW) - Complex real-time app

## Maintenance

### Keeping Up

- Update dependencies regularly: `pnpm update`
- Monitor security advisories
- Update Tailwind CSS v4
- Update TanStack packages

### Upgrading TanStack Start

```bash
pnpm add -u @tanstack/start
pnpm add -u @tanstack/router
```

Check release notes for breaking changes.

## Getting Help

- Refer to [TanStack Start docs](https://tanstack.com/start)
- Check [Tailwind CSS v4 docs](https://tailwindcss.com)
- Open a GitHub Discussion
- Join Jellyfin community

## Next Steps

1. Clone or use the template
2. Rename your module
3. Build your feature
4. Deploy and share
5. Open a PR to list in Coral ecosystem

## Submit to Coral

When ready to share:

1. Push to GitHub
2. Create releases with version tags
3. [Submit to ecosystem](https://github.com/Get-Coral) for listing

---

Happy building! 🚀
