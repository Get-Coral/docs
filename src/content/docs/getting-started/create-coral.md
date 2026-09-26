---
title: create-coral CLI
description: Scaffold a new Coral module from the official template — usage, flags, and what you get.
---

## What it is

`create-coral` is the official Coral scaffolding CLI. It pulls the latest `template/`, renames the module for you, and keeps the standard Coral setup intact:

- TypeScript by default
- Biome for linting and formatting
- Coral release automation and workflow files
- TanStack Start, Tailwind CSS, and Jellyfin-ready structure

## Create a Module

Use whichever package manager you prefer:

```bash
pnpm create coral@latest
npm create coral@latest
bun create coral@latest
```

You can also pass the module name directly:

```bash
pnpm create coral@latest my-module
npm create coral@latest my-module
bun create coral@latest my-module
```

If you want the explicit package form:

```bash
npx create-coral@latest my-module
```

## What the CLI Sets Up

The generated module already includes:

- TypeScript configuration
- Biome formatting and linting
- Vite and TanStack Start wiring
- Dockerfile and production server wrapper
- GitHub workflows for CI and release automation

## Interactive Flow

If you run the CLI without a target directory, it guides you through:

- target directory
- module name
- whether dependencies should be installed immediately

## After Scaffolding

```bash
cd my-module
pnpm install
cp .env.example .env
pnpm dev
```

Most Coral modules run locally on port `3000` by default unless you override it.

## When to Use the Template Manually

The CLI is the recommended path. Manual cloning of `Get-Coral/template` is mainly useful if you need to inspect or fork the raw starter before generating a module.

## Related Links

- [Project Templates](/contributing/project-templates/)
- [Contributing](/contributing/getting-started/)
- [create-coral on npm](https://www.npmjs.com/package/create-coral)
- [create-coral on GitHub](https://github.com/Get-Coral/create-coral)

## Options

```
pnpm create coral@latest my-module
pnpm create coral@latest
```

| Flag | Purpose |
|---|---|
| `--module-name <name>` | Override the module/package name |
| `--template-repo <org/repo>` | Use a custom template repository (default `Get-Coral/template`) |
| `--template-ref <ref>` | Template git ref: branch, tag or SHA (default `main`) |
| `--yes` | Skip prompts and use defaults |
| `--install` | Run `pnpm install` after scaffolding |
| `--no-install` | Skip `pnpm install` |
| `--help` | Show usage |

Non-interactive, for CI or a script:

```bash
pnpm create coral@latest my-module --yes --install
```

## Related

- [Project templates](/contributing/project-templates/) — what the scaffold contains and how to rename it
- [Encore](/modules/encore/) — a live, unmodified copy of the template
- [Contributing](/contributing/getting-started/) — tooling and commit conventions
