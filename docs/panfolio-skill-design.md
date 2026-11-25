# Panfolio Markdown skill design

Source version: 0.2.0. The [runtime audit](panfolio-skill-runtime-audit.md) documents why the v0.1.0 JSON/helper workflow did not satisfy actual ChatGPT cooking requests.

## Consumer workflow

The skill points directly at public GitHub Raw Markdown indexes. The assistant selects a dish by its name or actual ingredient aliases, reads one preparation document and answers in the conversation language. Kitchen-reference requests use their own index. Follow-up cooking turns reuse the retrieved document. GitHub's rendered view of the same file is the single alternative route; neither route requires GitHub Pages, a shell or Python.

A specific dish uses an independent preparation file. A broad request can offer existing alternatives. A component or finish is labeled as such. Source quantities, ordering, cooking cues, explanations and real original-source links remain intact. Shared tips apply only to matching food and conditions; related links may be comparisons. No unsupported serving conversion, total time or dietary guarantee is inferred.

## Content organization

`content/index.md` links to Chinese and English recipe/reference indexes. Each recipe index has exactly the existing Chinese, Japanese chef series and Desserts categories. Kitchen references remain a separate collection. Reviewed discovery aliases aid matching; no removed filter taxonomy is introduced.

Stable paths use original recipe and preparation IDs:

- `content/{zh,en}/recipes/{recipe-id}.md`: parent recipe, choices and complete source text.
- `content/{zh,en}/preparations/{recipe-id}/{preparation-id}.md`: one selected method.
- `content/{zh,en}/references/{reference-id}.md`: operations, reasons, mistakes, scope, limits, sources and related recipes.

The current dataset generates 285 Markdown files: one landing index, four language-specific indexes, 88 parent documents, 130 preparation documents and 62 kitchen references. These are cookbook content, distinct from English-only developer documentation.

## One editorial source

`createMarkdownCookbook` derives readable views from the same reviewed exporter records and preparation selector as the app. `pnpm content:build` writes them into the tracked `content/` directory. `pnpm content:check` compares every byte and the full inventory; build and CI fail on stale files. Source and generated content must be committed together. Generation is a maintenance operation, not a requirement imposed on an installed skill user.

Both ZIP formats package the single `skills/panfolio` source, without consumer scripts or cookbook duplication. The plugin manifest is v0.2.0. The existing static JSON feed remains for v0.1.0 clients; it is not a prerequisite for the new skill. The consumer Python helper and its obsolete tests have been removed. Python remains a maintainer archive-build dependency only.

## Limits and verification

Public repository access is still required. An instruction file cannot grant networking. Missing content and failed retrieval must be distinguished; neither justifies inventing a Panfolio recipe. Ordinary lookup never accesses private browser data. The package software license excludes recipe/media ownership.

Local tests establish source parity, preparation boundaries, complete reference fields, stable links, deterministic archives and absence of consumer scripts. App regression tests cover the existing web application. Target-account ChatGPT retrieval and installed-package behavior must be verified separately after repository publication; local checks cannot certify them.
