# Working on these docs

This is the documentation site for the Coral ecosystem, at
[docs.getcoral.dev](https://docs.getcoral.dev). Astro + Starlight, deployed to
Vercel.

## The one rule

**Verify every factual claim against the source repository before you write it.**

These docs once described Encore as a working music-request app while its `src/`
was the unmodified template, listed six Librarian features that had no code
behind them at all, and omitted `LIBRARIAN_REQUIRE_LOGIN=true` — a default that
stops a first-run user dead. All of it read plausibly. None of it was true.

Repos are at `github.com/Get-Coral/<name>`, and usually checked out locally
alongside this one. Before documenting a feature, an environment variable or a
flag:

```bash
grep -rn "FEATURE_OR_VAR" ../<repo>/src
```

If it is not in the code, it does not go in the docs. A README is evidence, not
proof — several of them are stale in ways the code is not.

Where the two disagree, the code wins, and the README is worth an upstream
issue.

## Division of labour with getcoral.dev

- **getcoral.dev owns *why***: positioning, comparisons, what a module is for.
- **These docs own *how***: install, configure, operate, troubleshoot.

A module page opens with one self-contained sentence saying what the thing is
and what it needs, then goes operational. Link the marketing page under
*Related* rather than restating its pitch.

## Module status

`src/lib/modules.ts` records a status per module — `shipping`, `early` or
`scaffold` — and it drives the JSON-LD, the OG cards and the homepage. Every
module page repeats it in an aside near the top.

It exists so a reader can tell Aurora from Encore without cloning both. Keep it
honest: the repo changes first, this file follows. If a module gains a feature,
do not promote its status in anticipation.

Do not document planned work as though it ships. If it matters, put it in the
status aside as an explicit "not built yet".

## Page skeleton

Module pages follow the same order, so a reader learns it once:

1. One-sentence definition
2. Status aside (and any safety aside — auth defaults, data loss, cost)
3. Requirements
4. Running it (Docker first — that is how people actually deploy these)
5. Environment reference, as a table, marked *verified against `<repo>/.env.example`*
6. How it behaves — the parts that surprise people
7. From source
8. Related

## Checks

```bash
pnpm build
pnpm check:links   # internal links resolve (needs a build first)
pnpm check:env     # documented env vars match each repo's .env.example
```

`pnpm check:env` fetches `.env.example` from each module repo on GitHub and
fails when a variable is missing here. It is one-directional on purpose: docs
legitimately describe variables that code reads but `.env.example` omits, such
as `HOST` and `PORT`.

Variables that are declared upstream but read by nothing live in `KNOWN_DEAD` in
`scripts/check-env-drift.mjs`, each with a reason. Documenting them would imply
they work.

## SEO and structured data

Handled centrally; you should not need to touch it for a content change.

- `src/lib/site.ts` — URLs, names, `sameAs`. Nothing else should hardcode a domain.
- `src/lib/schema.ts` — the JSON-LD `@graph`. The `Organization` and `WebSite`
  `@id`s deliberately point at `getcoral.dev` so both hosts resolve to **one**
  entity rather than two with the same name.
- `src/components/Head.astro` — emits the graph, the OG tags and the fonts.
- `src/pages/[...slug]/og.png.ts` — one social card per page, rasterised at build.
- `src/pages/llms.txt.ts`, `llms-full.txt.ts`, `robots.txt.ts`,
  `.well-known/api-catalog.ts` — machine-readable surfaces.

Frontmatter `description` becomes the meta description, the OG description and
the `llms.txt` entry. Write it as a standalone sentence under ~155 characters —
not "Get started with X".
