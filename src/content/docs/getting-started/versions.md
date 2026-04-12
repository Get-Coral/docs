---
title: Versions
description: Current versions across Coral modules and libraries
---

## Version Matrix

This page is generated manually from each module's package metadata and changelog in this repository.

| Project | Current Version | Source |
|---|---:|---|
| Aurora | 1.4.0 | CHANGELOG.md (latest tagged release) |
| Fathom | 0.1.0 | package.json |
| Librarian | 0.1.0 | package.json |
| KAPOW | 1.0.0 | CHANGELOG.md |
| Encore | 0.1.0 | package.json |
| Marquee | 0.1.0 | package.json |
| @get-coral/jellyfin | 1.2.0 | package.json |
| create-coral | 0.1.0 | package.json |
| Coral Docs | 0.0.1 | docs/package.json |

## Notes

- Aurora currently has an `Unreleased` section above `1.4.0`; the latest shipped version is `1.4.0`.
- If a module does not define `version` in package.json, the latest release section in changelog is used.

## Update Process

When releasing a new version:

1. Update package version or changelog in the module.
2. Update this page in docs.
3. Optionally update the module page version section.

Last verified: 2026-04-12
