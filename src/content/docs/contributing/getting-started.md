---
title: Getting Started Contributing
description: Set up a Coral repository locally, follow the shared tooling and commit conventions, and get a pull request merged.
---

## Contributing to Coral

The Coral ecosystem welcomes contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or building new modules — your help is appreciated.

## Quick Start

If you want to start a brand new Coral module instead of contributing to an existing one, scaffold it first:

```bash
pnpm create coral@latest my-module
npm create coral@latest my-module
bun create coral@latest my-module
```

That gives you the standard Coral app template with TypeScript, Biome, and release automation already configured. The dedicated [create-coral CLI guide](/getting-started/create-coral/) has the full setup flow.

### 1. Pick a Project

Choose where you want to contribute:

**Modules**

- **Aurora** — video client ([Get-Coral/aurora](https://github.com/Get-Coral/aurora))
- **Tide** — torrent client ([Get-Coral/tide](https://github.com/Get-Coral/tide))
- **Librarian** — download imports and library hygiene ([Get-Coral/librarian](https://github.com/Get-Coral/librarian))
- **Fathom** — reading interface ([Get-Coral/fathom](https://github.com/Get-Coral/fathom))
- **Marquee** — ambient display ([Get-Coral/marquee](https://github.com/Get-Coral/marquee))
- **KAPOW!** — karaoke queue ([Get-Coral/KAPOW](https://github.com/Get-Coral/KAPOW))
- **Encore** — the module scaffold ([Get-Coral/encore](https://github.com/Get-Coral/encore))

**Libraries and tooling**

- **Jellyfin client** — typed API client ([Get-Coral/jellyfin](https://github.com/Get-Coral/jellyfin))
- **Coral UI** — shared components ([Get-Coral/coral-ui](https://github.com/Get-Coral/coral-ui))
- **create-coral** — the scaffolder ([Get-Coral/create-coral](https://github.com/Get-Coral/create-coral))
- **template** — what create-coral clones ([Get-Coral/template](https://github.com/Get-Coral/template))
- **dev-standards** — shared Biome and TypeScript configs ([Get-Coral/dev-standards](https://github.com/Get-Coral/dev-standards))

If a module's page says *Early* or *Scaffold*, that is where help goes furthest.
See [Introduction](/getting-started/introduction/) for the current status of each.

### 2. Set Up Locally

```bash
# Clone the repository
git clone https://github.com/Get-Coral/<project>.git
cd <project>

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 3. Make Your Changes

- Create a new branch: `git checkout -b feature/your-feature`
- Make your changes
- Test thoroughly
- Commit with clear messages

### 4. Submit a Pull Request

- Push your branch to GitHub
- Create a Pull Request with a clear description
- Link any related issues
- Wait for review feedback

## Branch Strategy

- **main** - Production-ready code, and the branch releases cut from
- **feature/** - New features
- **fix/** - Bug fixes
- **docs/** - Documentation changes

## Commit Message Guidelines

Write clear commit messages:

```
fix: resolve video player pause issue

Fixes #123: Video player now correctly pauses when clicking pause button
on slow connections.

- Added network state check before sending pause command
- Added loading state UI
- Added test case
```

Format:
- `type: short description`
- Blank line
- Longer description if needed
- Issue references like `Fixes #123`

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting (no code change)
- `refactor:` - Code cleanup
- `test:` - Tests
- `ci:` - CI/CD configuration

## Code Style

All Coral projects share their tooling through
[`@get-coral/dev-standards`](https://github.com/Get-Coral/dev-standards):

- **[Biome](https://biomejs.dev)** — linting *and* formatting, via
  `@get-coral/biome-config`. Coral does not use ESLint or Prettier anywhere
- **TypeScript** — via `@get-coral/tsconfig`
- **Vitest** — tests

Run checks before submitting:

```bash
pnpm check      # Biome lint + format check
pnpm typecheck  # TypeScript
pnpm test       # Vitest
```

`pnpm lint` runs Biome with auto-fix. Note the script is `typecheck`, with no
hyphen.

## Testing

Include tests for new features:

```bash
pnpm test
```

## Documentation

Update documentation for:
- New features
- Configuration changes
- API additions
- Breaking changes

## Reporting Issues

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, versions)
- Relevant logs or error messages

## Getting Help

- Open a GitHub Discussion for questions
- Check existing issues first
- Join the [Jellyfin community](https://jellyfin.org/contact/)
- Ask on GitHub

## Code Review Process

1. **Submission** - PR is created and automated checks run
2. **Review** - Maintainers review code
3. **Feedback** - Suggestions or requests for changes
4. **Updates** - You make requested changes
5. **Approval** - PR is approved
6. **Merge** - Code is merged to main

Don't worry about feedback — it's how we maintain quality!

## License

Coral is MIT licensed. The published npm packages
(`@get-coral/jellyfin`, `@get-coral/ui`, `@get-coral/tsconfig`,
`@get-coral/biome-config`, `create-coral`) declare `"license": "MIT"`, and
Aurora, KAPOW! and Coral UI carry a `LICENSE` file.

Several module repositories do not yet carry one. If you are contributing to a
repository with no `LICENSE` file, ask before assuming — and adding the file is
itself a welcome pull request.

## Building a New Module

Want to create a new Coral module? Start with `pnpm create coral@latest`, then see [Project Templates](/contributing/project-templates/).

## Recognition

Contributors are recognized in:
- GitHub commit history
- Release notes
- README contributor sections
- Website acknowledgments

## Thank You!

Thank you for helping make Coral better! 🎉
