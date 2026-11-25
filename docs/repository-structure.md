# Repository structure and cleanup decisions

Reviewed 2026-11-25. Keep infrastructure and editorial content separate without moving stable recipe IDs, public Markdown paths or consumer package locations.

## Ownership boundaries

The root package owns the React application and maintainer tooling. `mcp/` intentionally has a separate package and lockfile: its SDK and Cloudflare dependencies must not enter the app bundle. `src/` contains canonical reviewed data alongside the selectors used by both app and exporters; moving those records solely for visual directory symmetry would create unnecessary migration work.

`content/` is a generated public API for AI readers. It remains checked in so GitHub Raw links resolve without Pages. `skills/` and `distribution/plugins/` are generated consumer artifacts, not second editorial sources. `distribution/` owns versions, package names, guidance, branding sources, generated host manifests and identity. Plugin READMEs are package resources; the main README remains the product/developer entry point.

`public/recipes/` retains full-size originals. Responsive derivatives, `dist/`, dependencies, local browser test output, MCP build snapshots and downloadable archives are reproducible ignored output. Branding originals belong in `distribution/branding/`; public exports and package copies are checked by hashes. Do not delete source artwork or recipe images as apparent duplicates.

## Consolidated maintainer directories

Plugin manifest sources and package resources live in `distribution/plugins/`; archive layouts and filenames remain unchanged. Original AI branding lives in `distribution/branding/`, with runtime exports in `public/branding/`. Translation evaluation baselines live in `tests/fixtures/editorial/`, alongside the checks that consume them. These changes remove three root directories without changing Skill discovery, cookbook URLs or deployed MCP endpoints.

Keep `skills/` at the root for installer discovery. Keep `mcp/` isolated rather than introducing a single-child services wrapper. Do not move the web app into a new workspace just to reduce the visible root listing. Ignored `dist/`, `node_modules/` and browser test output are local products, not additional source ownership boundaries.

## Documentation organization

The documentation index separates current operational guides from source records that still support recipe content. Superseded proposals, temporary plans and old evaluation transcripts are removed from the current tree and remain available in Git history. Current guides link to the authoritative maintenance contracts instead of repeating release procedures.

The initial standalone AI HTML concept was retired when the React implementation became authoritative. Temporary implementation plans and browser helpers are not repository sources. The README now prioritizes app use, AI installation, development and directory ownership, leaving detailed cache behavior and operational procedures to their focused guides.

## Cleanup policy

Delete only reproducible local caches/output when needed; never delete browser notes, credentials, original media or still-relevant source evidence as cleanup. Keep generated release ZIPs out of Git. Keep compatibility aliases until an explicit migration retires old links. Avoid mass-renaming modules or relocating hundreds of Markdown files without a concrete functional reason.

Validation covers generated-content parity, bilingual/source regression checks, all-document MCP reads, host archive structure, browser/offline/accessibility behavior and documentation links. The normal release gates remain mandatory; cleanup does not bypass them.
