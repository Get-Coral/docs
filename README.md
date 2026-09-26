# Coral Documentation

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-ElianCodes-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/ElianCodes)
[![Discord](https://img.shields.io/discord/1495441903297237043?label=Discord&logo=discord&logoColor=white&color=5865F2)](https://discord.gg/M3wzFpGbzp)

Documentation site for the Coral ecosystem of Jellyfin modules.

**Live at:** [docs.getcoral.dev](https://docs.getcoral.dev)

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)

## Project Structure

```
docs/
├── src/
│   ├── assets/              # Images and static assets
│   ├── content/
│   │   ├── docs/            # Documentation pages
│   │   │   ├── getting-started/
│   │   │   ├── modules/     # Module documentation
│   │   │   ├── libraries/   # Library documentation
│   │   │   ├── contributing/
│   │   │   └── index.mdx    # Home page
│   │   └── content.config.ts
│   └── styles.css
├── public/                  # Static files
├── astro.config.mjs         # Astro configuration
├── vercel.json             # Vercel deployment config
├── package.json
└── tsconfig.json
```

## Development

### Install dependencies

```bash
pnpm install
```

### Start dev server

```bash
pnpm dev
```

Accessible at `http://localhost:4321`

### Build for production

```bash
pnpm build
```

### Preview production build

```bash
pnpm preview
```

## Deployment to Vercel

### Setup

1. **Connect repository** to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the Git repository
   - Select the `docs` directory as the root

2. **Configure domain**:
   - In Vercel project settings → Domains
   - Add `docs.getcoral.dev` as a domain
   - Update DNS records at your registrar:
     ```
     docs.getcoral.dev  CNAME  cname.vercel.com
     ```

3. **Environment variables** (if needed):
   - Set in Vercel project settings
   - None required for this static site

### Automatic Deployment

- Pushes to `main` automatically deploy
- Preview deployments on pull requests
- Rollbacks available in deployment history

### Manual Deployment

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy from docs directory
cd docs
vercel
```

## Documentation

Documentation is organized into sections:

- **Getting Started** - Intro, the Docker Compose stack, the CLI, module contracts
- **Modules** - Aurora, Tide, Librarian, Fathom, Marquee, KAPOW!, Encore
- **Libraries** - Jellyfin API client, Coral UI, published npm packages
- **Contributing** - How to contribute and build new modules

Before editing content, read [AGENTS.md](./AGENTS.md) — particularly the rule
about verifying claims against the source repositories.

## Adding Content

### Create a new page

Add a `.md` or `.mdx` file in `src/content/docs/`:

```markdown
---
title: Page Title
description: Page description
---

Your content here...
```

### Update sidebar

Edit `astro.config.mjs` to add to navigation:

```javascript
sidebar: [
  {
    label: 'Section',
    items: [
      { label: 'Page', slug: 'path/to/page' }
    ]
  }
]
```

### Add images

1. Place images in `src/assets/`
2. Reference in markdown:

```markdown
![Alt text](../../assets/image.png)
```

## Checks

```bash
pnpm build
pnpm check:links   # internal links resolve (run after a build)
pnpm check:env     # documented env vars match each module repo's .env.example
```

## Styling

Uses Starlight's component library, themed through `src/styles.css`:

```markdown
import { Card, CardGrid, Aside } from '@astrojs/starlight/components';

<Card title="Title">Content</Card>
<Aside type="note">Note content</Aside>
```

## Links

- [Astro Docs](https://docs.astro.build)
- [Starlight Docs](https://starlight.astro.build)
- [Coral Website](https://getcoral.dev)
- [Get-Coral GitHub](https://github.com/Get-Coral)

## License

MIT
