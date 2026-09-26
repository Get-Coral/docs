---
title: Module contracts
description: How two Coral modules talk when Jellyfin cannot answer the question
---

## Why this exists

Coral's rule is that Jellyfin is the source of truth and modules never share a
database. That rule holds. But Jellyfin can scan a directory and it cannot
organise one, so "move this finished download into the Movies library" is a
sentence the Jellyfin API cannot express.

A module contract is the narrow exception: a small, versioned, opt-in
interface one module exposes and another may use.

## Three rules

**No link is required.** Every module runs alone and is useful alone. Tide
downloads without Librarian. Librarian organises without Tide. A contract
adds something when both are present; nothing degrades when they are not.

**No link is implicit.** Nothing is discovered, scanned, or auto-configured.
An operator pastes a URL and a token. Two modules on the same Docker network
that have not been introduced to each other stay strangers.

**Nothing Jellyfin can already answer gets a contract.** If the Jellyfin API
can tell you, ask Jellyfin. A contract is for the gap, and the gap is small.

## The manifest

Every module answers `GET /api/coral/manifest`.

```json
{
  "spec": 1,
  "module": { "id": "tide", "name": "Tide", "version": "1.3.0" },
  "auth": { "required": true, "schemes": ["bearer"] },
  "capabilities": [
    { "name": "downloads.list", "version": 1, "path": "/api/coral/downloads" },
    { "name": "downloads.events", "version": 1, "path": "/api/coral/events" }
  ]
}
```

A caller with **no credentials** gets `200` and an empty capability list. That
is deliberate: the flow is "paste a URL, see what this is, paste a token", and
a bare `401` would make the first step guesswork.

A caller whose **credentials do not work** gets `401`. That is a different
situation, and someone who pasted a typo needs to be able to tell it from a
module that has nothing to offer.

### Compatibility

- `spec` is a single integer describing the envelope.
- Each capability carries **its own** integer version, so one can move without
  disturbing the others.
- `path` is declared in the manifest. Never derive it from the capability name.
- **Parsers are lenient and additive-only.** Ignore fields you do not
  recognise rather than throwing. An old module must keep working against a
  newer one.

## Tokens

A token looks like `coral_<moduleid>_<random>`. It is shown once, stored only
as a sha256 hash, and compared in constant time.

**A token is a capability grant, not an account.** It carries no user
identity. Nothing behind it asks who it is, and nothing acts "as" anybody.

Scopes are `read` and `full`. `CORAL_SERVICE_TOKEN` is an escape hatch for
operators who configure everything through compose and never open a UI; it
grants full access and cannot be revoked from a settings page.

## Capabilities

Defined in spec 1:

| Capability | Exposed by | What it does |
|---|---|---|
| `downloads.list` | Tide | A point-in-time snapshot of what is downloading |
| `downloads.events` | Tide | The same snapshots as a stream |
| `library.refresh` | Librarian | Ask Jellyfin to rescan |

Librarian's manifest additionally carries a top-level `roots` array describing
the filesystem roots it has enabled. It is not part of the shared shape — a
caller should ignore fields it does not recognise.

A module advertises a capability only when it actually works. Librarian does
not offer `library.refresh` before it is connected to a Jellyfin. Advertising
something whose endpoint is missing is worse than omitting it, because the
caller can only find out by failing.

### Reserved

Named here so nobody else takes them. **None of these is implemented**, and a
module will not advertise one until it is:

`files.move`, `files.browse`, `library.import`, `downloads.webhook`.

### Never

These will not be defined. They are the shapes that turn a media stack into an
attack surface:

`users.*`, `settings.*`, `playback.*`, `files.delete`.

## Why pull and not push

Consumers subscribe; producers never call out.

Tide's event stream emits **full snapshots** rather than deltas, so it is
already a reconcile stream: a consumer that misses messages, or reconnects
after being down, converges from the next message it receives. Idempotency
falls out for free, because only the consumer knows what it has already acted
on.

A webhook would need a delivery queue, retries, a dead-letter path, replay
after downtime, a second credential pointing the opposite way, an HMAC secret
that cannot be verified until it silently fails, and network reachability from
the producer to the consumer — all to deliver knowledge the consumer already
has better access to.

**Honest gap:** if a torrent completes *and* is removed from Tide while the
consumer is down, the consumer never sees it. The file is still in
`downloads/complete`; import it by hand.

## Related

- [Tide](/modules/tide/) — exposes `downloads.list` and `downloads.events`
- [Librarian](/modules/librarian/) — exposes `library.refresh`
- [Running a stack with Docker Compose](/getting-started/docker-compose/) — the two of them wired together
