---
title: Jellyfin API Client
description: A fully typed TypeScript client for the Jellyfin API
---

## @get-coral/jellyfin

A modern, fetch-based Jellyfin API client with full TypeScript types. No dependencies. Works in Node.js, browsers, and edge runtimes (Cloudflare Workers, Vercel Edge, etc).

[![npm](https://img.shields.io/npm/v/@get-coral/jellyfin?style=flat-square&color=ff6b6b)](https://www.npmjs.com/package/@get-coral/jellyfin)
[![License: MIT](https://img.shields.io/badge/License-MIT-2dd4bf?style=flat-square)](https://opensource.org/licenses/MIT)

## Installation

```bash
pnpm add @get-coral/jellyfin
# or
npm install @get-coral/jellyfin
```

## Quick Start

```ts
import { createClient, getLibraryItems, fromJellyfin } from '@get-coral/jellyfin'

const client = createClient({
  url: 'http://192.168.1.10:8096',
  apiKey: 'your-api-key',
  userId: 'your-user-id'
})

// Fetch library items
const items = await getLibraryItems(client, {
  libraryId: 'library-id',
  limit: 50
})

// Transform Jellyfin data to typed objects
const movies = items.map(fromJellyfin.movie)
```

## Features

### Type-Safe API
- Full TypeScript support
- Strongly typed responses
- IntelliSense support
- No `any` types

### Zero Dependencies
- Tiny bundle size
- Uses native `fetch` API
- No external dependencies
- Fast installation

### Works Everywhere
- Node.js
- Browser
- Cloudflare Workers
- Vercel Edge Functions
- Deno
- And other edge runtimes

### Comprehensive Coverage
- Browse libraries
- Get items and collections
- Fetch user sessions
- Update playback state
- Search functionality
- And much more

## Core API

### Client Creation

```ts
import { createClient } from '@get-coral/jellyfin'

const client = createClient({
  url: 'http://your-jellyfin-server:8096',
  apiKey: 'your-api-key',
  userId: 'your-user-id'
})
```

### Common Operations

```ts
import { 
  getLibraries,
  getLibraryItems,
  getItem,
  getNextUp,
  getContinueWatching,
  search,
  fromJellyfin
} from '@get-coral/jellyfin'

// Get all libraries
const libraries = await getLibraries(client)

// Get items from a library
const items = await getLibraryItems(client, {
  parentId: 'library-id',
  limit: 50
})

// Get a specific item
const item = await getItem(client, 'item-id')

// Get continue watching
const continuing = await getContinueWatching(client)

// Get next up (for series)
const nextUp = await getNextUp(client, {
  parentId: 'series-id'
})

// Search
const results = await search(client, {
  searchTerm: 'test',
  limit: 20
})

// Transform to typed objects
const movie = fromJellyfin.movie(item)
const series = fromJellyfin.series(item)
```

### Update Operations

```ts
import { updatePlaybackState, markFavorite } from '@get-coral/jellyfin'

// Update user playback progress
await updatePlaybackState(client, {
  itemId: 'item-id',
  positionTicks: 12345,
  isPaused: false
})

// Mark as favorite
await markFavorite(client, {
  itemId: 'item-id',
  isFavorite: true
})
```

## Data Transformation

Transform raw Jellyfin API responses to typed objects:

```ts
import { fromJellyfin } from '@get-coral/jellyfin'

const jellyfinItem = await getItem(client, 'item-id')

// Convert to strongly-typed objects
const movie = fromJellyfin.movie(jellyfinItem)
const series = fromJellyfin.series(jellyfinItem)
const episode = fromJellyfin.episode(jellyfinItem)
const person = fromJellyfin.person(jellyfinItem)
```

Each transformer:
- Validates the data structure
- Extracts relevant fields
- Provides TypeScript types
- Handles missing data gracefully

## Advanced Usage

### Authentication in Node.js

```ts
import { authenticate } from '@get-coral/jellyfin'

const token = await authenticate(client, {
  username: 'your-username',
  password: 'your-password'
})

// Use token for authenticated requests
```

### Working with Edge Runtimes

```ts
import { createClient } from '@get-coral/jellyfin'

// Works with Vercel Edge Functions
export default async (req: Request) => {
  const client = createClient({
    url: process.env.JELLYFIN_URL,
    apiKey: process.env.JELLYFIN_API_KEY,
    userId: process.env.JELLYFIN_USER_ID
  })
  
  const items = await getLibraryItems(client, {
    limit: 10
  })
  
  return Response.json(items)
}
```

## Error Handling

```ts
try {
  const item = await getItem(client, 'invalid-id')
} catch (error) {
  if (error instanceof JellyfinError) {
    console.error('Jellyfin API error:', error.message)
  }
}
```

## Performance Tips

- Use `limit` and `startIndex` for pagination
- Cache responses appropriate to your use case
- Use filter parameters to reduce data transfer
- Consider using `includeFields` to limit response size

## Contributing

Community contributions are welcome! See the [Contributing](/contributing/getting-started/) guide.

## License

MIT

## Links

- [GitHub Repository](https://github.com/Get-Coral/jellyfin)
- [npm Package](https://www.npmjs.com/package/@get-coral/jellyfin)
- [Jellyfin Docs](https://jellyfin.org/)
