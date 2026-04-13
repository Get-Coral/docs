---
title: Coral UI
description: Shared React components and design tokens for Coral apps
---

## @get-coral/ui

`@get-coral/ui` is the shared design-system package for Coral repositories. It provides reusable React components and a common style token layer so modules can ship faster while keeping a consistent UI language.

## Version

- Current version: **0.1.0**

[![npm](https://img.shields.io/npm/v/@get-coral/ui?style=flat-square&color=ff6b6b)](https://www.npmjs.com/package/@get-coral/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-2dd4bf?style=flat-square)](https://opensource.org/licenses/MIT)

## Installation

```bash
pnpm add @get-coral/ui
# or
npm install @get-coral/ui
```

## Quick Start

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

## What It Includes

- Shared primitives for common interface patterns (buttons, cards, and more over time)
- Design tokens exposed through CSS custom properties
- TypeScript-first component APIs
- React 19 compatible peer dependency setup

## Why Use It

- Keep visual consistency across Aurora, Fathom, Librarian, and other modules
- Reduce duplicated component code between repositories
- Publish improvements once and adopt everywhere

## Publish Flow

`@get-coral/ui` is released with the same Release Please automation pattern as other Coral NPM packages:

- Push conventional commits to `main`
- Release Please opens or updates a release PR
- Merging the PR triggers NPM publish with `NPM_TOKEN`

## Links

- [GitHub Repository](https://github.com/Get-Coral/coral-ui)
- [npm Package](https://www.npmjs.com/package/@get-coral/ui)
- [NPM Packages Overview](/libraries/npm-packages/)
