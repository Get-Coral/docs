---
title: Jellyfin API Client
description: A fully typed TypeScript client for the Jellyfin API
---

## @get-coral/jellyfin

A modern, fetch-based Jellyfin API client with full TypeScript types and zero dependencies. Works in Node.js, browsers, and edge runtimes. It powers Aurora and the other Coral modules.

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
  userId: 'your-user-id',
})

const { Items } = await getLibraryItems(client, 'Movie', {
  limit: 24,
  sortBy: 'SortName',
  watchStatus: 'unwatched',
})

const movies = Items.map(item => fromJellyfin(client, item))
```

## Client Configuration

```ts
const client = createClient({
  url: string        // Jellyfin server URL (trailing slash stripped automatically)
  apiKey: string     // Jellyfin API key
  userId: string     // User ID (UUID)

  // Optional — for playback progress sync
  username?: string
  password?: string

  // Optional — a ready Jellyfin access token (e.g. from authenticateUserByName).
  // When set, playback auth uses it directly instead of re-authenticating.
  accessToken?: string

  // Optional — how this client identifies itself in Jellyfin's active sessions
  clientName?: string  // default: 'Coral'
  deviceName?: string  // default: 'Coral Web'
  deviceId?: string    // default: 'coral-web'
  version?: string     // default: '1.0.0'
})
```

## API Overview

The client is passed as the first argument to standalone functions, grouped roughly by area:

- **Items**: `getLibraryItems`, `getItem`, `getLatestMedia`, `getContinueWatching`, `getFavoriteItems`, `getWatchHistory`, `getMostPlayed`, `getSimilarItems`, `getFeaturedItem`, `searchItems`, `setFavorite`, `setPlayed`, `deleteItem`, `updateItem`, remote image helpers
- **Shows**: `getEpisodesForSeries`, `getNextUpForSeries`
- **Collections**: `getCollections`, `getCollectionItems`, `createCollection`, `addItemsToCollection`, `removeItemsFromCollection`, `searchCollectionItems`
- **Playback**: `createPlaybackSession`, `syncPlaybackState`
- **Authentication & sessions**: `authenticateUserByName`, `logoutUserSession`
- **URL builders**: `imageUrl`, `personImageUrl`, `streamUrl`, `transcodeUrl`, `subtitleUrl`
- **Mapper**: `fromJellyfin`, `fromJellyfinDetailed` — normalise raw `JellyfinItem`s into a UI-friendly `MediaItem` shape
- **Admin**: `getSystemInfo`, `getItemCounts`, `getActiveSessions`, `getUsers`, `getUserById`, `createUser`, `deleteUser`, `updateUserPolicy`, `getVirtualFolders`, `scanAllLibraries`, `scanLibrary`

See the [repository README](https://github.com/Get-Coral/Jellyfin#api-reference) for the full reference with options and return types.

## Authentication & Sessions

Build sign-in flows on top of Jellyfin's own accounts:

```ts
import { authenticateUserByName, logoutUserSession, createClient } from '@get-coral/jellyfin'

// Sign a user in with their Jellyfin username/password.
// Returns their identity and a real Jellyfin access token.
const { user, accessToken, sessionId } = await authenticateUserByName(client, 'alice', 'secret')

// Act as that user: playback and progress sync run under their token
const userClient = createClient({
  url,
  apiKey,
  userId: user.Id,
  accessToken,
  deviceId: 'my-app-session-1234',
})

// End the session again (revokes the token)
await logoutUserSession(client, accessToken)
```

Give every session a **unique `deviceId`** — Jellyfin revokes the previous token when the same user re-authenticates with the same device id, so a shared id makes concurrent sign-ins invalidate each other. `authenticateUserByName` throws a `JellyfinError` with status 401 for invalid credentials or disabled users.

## Playback Sync

```ts
import { createPlaybackSession, syncPlaybackState } from '@get-coral/jellyfin'

const session = await createPlaybackSession(client, itemId)

await syncPlaybackState(client, {
  itemId,
  playSessionId: session.playSessionId,
  positionTicks: 12_345,
  isPaused: false,
})
```

Playback endpoints authenticate as a real Jellyfin session, using either the configured `username`/`password` or a ready `accessToken`.

## Error Handling

All functions throw a `JellyfinError` on non-OK responses:

```ts
import { JellyfinError } from '@get-coral/jellyfin'

try {
  const item = await getItem(client, 'bad-id')
} catch (err) {
  if (err instanceof JellyfinError) {
    console.error(err.message) // 'Jellyfin API error on ...: 404 Not Found'
    console.error(err.status)  // 404
  }
}
```

## Jellyfin server compatibility

| Client | Jellyfin 10.x | Jellyfin 12.x |
| --- | --- | --- |
| `<= 1.9.0` | works | **broken** — every JSON call returns 401 |
| `> 1.9.0` | works | works |

Jellyfin 12 removed three auth mechanisms the client relied on. Verified against `jellyfin/jellyfin:12.1.0`:

| Request | Jellyfin 12 |
| --- | --- |
| `GET /Items?…&api_key=<key>` | 401 |
| `GET /Items` with `X-Emby-Token: <key>` | 401 |
| `POST /Users/AuthenticateByName` with `X-Emby-Authorization` | 400 |
| `GET /Items` with `Authorization: MediaBrowser Token="<key>"` | 200 |

Only the standard `Authorization` header is accepted, and it works on 10.x too — so newer client versions support both server generations.

### Symptoms on an affected version

Every JSON call fails, which in a module usually surfaces as a 500 on the home page with all data queries rejecting:

```
JellyfinError: Jellyfin API error on /Users/<id>/Items/Latest: 401 Unauthorized
JellyfinError: Jellyfin API error on /Users/<id>/Items/Resume: 401 Unauthorized
```

If you see this against a Jellyfin 12 server, upgrade `@get-coral/jellyfin`.

### Image and video URLs are unaffected

`imageUrl()`, `streamUrl()`, `transcodeUrl()` and `subtitleUrl()` still append `api_key`, deliberately — those strings are consumed by `<img src>` and video element sources, where a header cannot be attached. Jellyfin 12 serves image and video endpoints without authentication, and Jellyfin 10 still requires the parameter, so the same URL works on both.

## Contributing

Community contributions are welcome! See the [Contributing](/contributing/getting-started/) guide.

## Links

- [GitHub Repository](https://github.com/Get-Coral/Jellyfin)
- [npm Package](https://www.npmjs.com/package/@get-coral/jellyfin)
- [Jellyfin Docs](https://jellyfin.org/)
