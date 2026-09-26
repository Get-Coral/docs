---
title: Coral UI
description: The shared React component library and design tokens behind every Coral module — five components, TypeScript-first, React 19.
---

`@get-coral/ui` is the shared design-system package for Coral modules. It ships
a small set of React components and a CSS custom-property token layer, so
Aurora, Fathom, Librarian and the rest look like one family without copying
component code between repositories.

It is deliberately small. Components arrive here once a second module needs
them, not before.

## Installation

```bash
pnpm add @get-coral/ui
# or
npm install @get-coral/ui
```

React 19 or newer is a peer dependency (`react` and `react-dom`, both `>=19`).

## Quick start

```tsx
import { CoralButton, CoralCard } from '@get-coral/ui'
import '@get-coral/ui/styles.css'

export function Example() {
  return (
    <CoralCard title="Shared UI">
      <CoralButton variant="primary">Launch</CoralButton>
    </CoralCard>
  )
}
```

The stylesheet is a separate export. Import it once, at your app root.

## Components

Every export, as of `@get-coral/ui` 1.0.2. Each component also exports its props
type (`CoralButtonProps`, `CoralCardProps`, and so on).

### `CoralButton`

Extends `ButtonHTMLAttributes<HTMLButtonElement>`.

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'neutral' \| 'danger'` | `'neutral'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

### `CoralCard`

Extends `HTMLAttributes<HTMLDivElement>`. Renders a `<section>` with an optional
header.

| Prop | Type |
|---|---|
| `title` | `ReactNode` |

### `CoralSection`

Extends `HTMLAttributes<HTMLElement>`. A titled page section.

| Prop | Type |
|---|---|
| `eyebrow` | `ReactNode` |
| `title` | `ReactNode` (required) |
| `subtitle` | `ReactNode` |
| `footer` | `ReactNode` |

### `CoralMediaCard`

Extends `HTMLAttributes<HTMLDivElement>`. A poster tile with an optional
progress bar, clamped to 0–100.

| Prop | Type |
|---|---|
| `title` | `ReactNode` (required) |
| `subtitle` | `ReactNode` |
| `description` | `ReactNode` |
| `imageUrl` | `string` |
| `imageAlt` | `string` |
| `badge` | `ReactNode` |
| `progress` | `number` |

### `CoralErrorState`

A full error or empty state with up to two actions. Also exports the
`CoralErrorAction` type.

| Prop | Type |
|---|---|
| `title` | `ReactNode` (required) |
| `code` | `ReactNode` |
| `eyebrow` | `ReactNode` |
| `description` | `ReactNode` |
| `primaryAction` | `CoralErrorAction` |
| `secondaryAction` | `CoralErrorAction` |

A `CoralErrorAction` is `{ label, href?, onClick?, variant?, target?, rel? }`.

## Design tokens

Tokens are exposed as CSS custom properties from `@get-coral/ui/styles.css`, so
you can consume them from plain CSS, Tailwind, or inline styles without
importing anything else.

## Releases

`@get-coral/ui` uses Release Please: push conventional commits to `main`, and
merging the generated release PR publishes to npm. Publishing uses **npm trusted
publishing (OIDC) with provenance** — there is no `NPM_TOKEN` secret.

## Related

- [NPM packages](/libraries/npm-packages/) — every published Coral package
- [Jellyfin API client](/libraries/jellyfin/) — the other half of a Coral module
- [Project templates](/contributing/project-templates/)
- [Get-Coral/coral-ui on GitHub](https://github.com/Get-Coral/coral-ui) · [npm](https://www.npmjs.com/package/@get-coral/ui)
