---
title: Getting Started Contributing
description: How to contribute to the Coral ecosystem
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

- **Aurora** - Video client ([github.com/Get-Coral/aurora](https://github.com/Get-Coral/aurora))
- **Fathom** - Reading interface ([github.com/Get-Coral/fathom](https://github.com/Get-Coral/fathom))
- **Librarian** - Library management ([github.com/Get-Coral/librarian](https://github.com/Get-Coral/librarian))
- **KAPOW** - Karaoke manager ([github.com/Get-Coral/KAPOW](https://github.com/Get-Coral/KAPOW))
- **Jellyfin Client** - API library ([github.com/Get-Coral/jellyfin](https://github.com/Get-Coral/jellyfin))
- **Ecosystem** - Any module or library

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

- **main** - Production-ready code
- **develop** - Development branch (if used)
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

All Coral projects use:

- **Biome** - Linting and formatting
- **TypeScript** - Type checker
- **ESLint** - Code quality

Run checks before submitting:

```bash
pnpm lint
pnpm type-check
pnpm format
```

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

By contributing, you agree to license your contributions under the project's license:
- Most Coral projects: **MIT**
- Some may vary — check the LICENSE file

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
