# Panfolio

Your personal recipe collection and kitchen notebook.

Browse your growing collection of recipes, search names and ingredient text, save favorites, write personal notes, and read recipes section by section while cooking. Install the app on your home screen and revisit bundled recipe text offline after successful caching. Recipe photos are downloaded at responsive sizes and cached as viewed; external videos require a connection.

## App features

- Compact desktop navigation and mobile bottom navigation; three exclusive recipe categories (Chinese, Japanese chef series and Desserts) with keyword search.
- Recent reading, favorites, notes and explicit tried/repeat records, plus device-specific installation instructions.
- A bilingual Kitchen essentials collection with keyword search, complete operations, explanations, mistakes, applicability limits and links to related recipes; application help lives in the User guide.
- Optional click-to-load source videos in recipe and kitchen-reference details, with YouTube/Bilibili selection where available and original-site fallback. Videos require connectivity and remain outside offline caches.
- Clean app and recipe sharing links, clipboard fallback, native sharing where supported, and locally generated bilingual PNG QR cards.
- Version checks on return/reconnect and a manual check in Settings. Updates provide progress, timeout/retry and completion feedback; activation must be confirmed before reload.
- Complete scoped precache validation, startup failure recovery and a standalone [recovery page](https://octopusgarage.github.io/panfolio/recover.html) that preserves personal data and neighboring deployments.

## Use through an AI assistant

The portable [Panfolio skill](skills/panfolio/SKILL.md) lets a compatible assistant find dishes, guide a selected preparation, explain kitchen techniques and make source-based shopping checklists without installing the app. It reads the public repository's [Markdown cookbook](content/index.md) directly: Chinese and English indexes link to complete individual preparations and kitchen references. No terminal, Python, manifest parsing, Panfolio account or API key is required by the user. The assistant needs a tool that can read public HTTPS text.

Install with a compatible installer:

```sh
npx skills add OctopusGarage/panfolio --skill panfolio -g
```

The installer has its own Node requirements. Versioned ZIPs are distributed through [GitHub Releases](https://github.com/OctopusGarage/panfolio/releases); check the version, because v0.1.0 uses the older JSON/helper workflow. Current AI versions are defined in [distribution/config.json](distribution/config.json). Both packages and the MCP share one generated identity and cooking guidance; see [distribution maintenance](docs/distribution-maintenance.md).

Eligible ChatGPT accounts can import `panfolio-skill.zip` through **Plugins → Skills → Create → Upload from your computer**. `panfolio-chatgpt-plugin.zip` is a complete plugin package for the separate OpenAI plugin ZIP portal. These entry points and workspace availability differ; attaching a ZIP to an ordinary chat does not install it. See [ChatGPT installation](docs/chatgpt-plugin.md).

Try “Use Panfolio to guide me through asparagus pork rolls” or “看看三文鱼怎么煎”. The skill reads Markdown through GitHub Raw, with GitHub's rendered file as a bounded fallback. Release ZIPs pin links to their source commit; repository installs track main. It does not depend on GitHub Pages. A host unable to read either public URL cannot complete this online workflow. Actual account-side compatibility must be tested after publication; local package tests do not certify it.

`pnpm content:build` generates the checked-in `content/` tree from the reviewed application data. Run it after recipe/reference changes and commit the output. `pnpm content:check` rejects stale or extra Markdown files and runs during build and CI. Content is not maintained separately by hand. The previous `/ai/` JSON feed remains available for already released clients; the current skill does not use it.

## Use through MCP

A lightweight read-only Cloudflare MCP server is available at `https://panfolio-mcp.octopusgarage.workers.dev/mcp`. Add it as a remote Streamable HTTP server without authentication in a supported AI client. Its two tools provide a short guide and complete Markdown documents; the assistant can explore the cookbook without a separate browser or terminal. See [MCP connection and maintenance](docs/mcp-server.md) for client differences, deployment and verification. The service runs in the separate OctopusGarage Cloudflare account. Existing account prefixes and services were preserved.

## Personal data

Favorites and notes stay in this browser. IndexedDB transactions serialize changes between windows; localStorage mirrors support migration and fallback. Open windows refresh through BroadcastChannel, storage events and foreground checks. Export JSON backups before clearing browser data. Import validates the entire file, merges favorites and preserves existing notes when both copies contain a note for the same recipe. There is no account or cloud synchronization.

## Development

Node.js 24, pnpm 10 and Python 3.9+ are required for maintainer builds and archive tests. Python packages are not required. Neither the app nor the installed skill requires Python at runtime.

```sh
pnpm install --frozen-lockfile
pnpm --dir mcp install --frozen-lockfile
pnpm sync
pnpm test
pnpm content:check
pnpm distribution:check
pnpm docs:check
pnpm eval
pnpm mcp:test
pnpm mcp:build
pnpm format:check
pnpm build
pnpm exec playwright install chromium webkit
pnpm test:e2e
pnpm dev
```

Production assets support subdirectory hosting. On main, GitHub Actions validates and builds once, deploys Pages and the same MCP build, verifies live release identities, then publishes both ZIPs and their checksums to GitHub Releases. Changed release inputs require an AI version bump. PR checks receive no deployment secret. See [the maintenance contract](docs/distribution-maintenance.md) for retries and credential rotation. Updates wait for the user to select the update action.

## Recipe content

Add recipes to `src/recipes.json` as your collection grows. Each entry has a stable `id`, `title`, `body` (Markdown), `titleEn`, `bodyEn`, `description`, `descriptionEn`, plus optional `image` and `source` URL. Keep English titles with their recipes so reordering entries does not mix up translations. There is no fixed recipe count. Search, categories, totals and offline content update automatically when the app is rebuilt. Keep full-size images in `public/recipes/`. Build generates 480, 768 and 1200 pixel derivatives. Mobile image candidates are capped at 768 pixels, including high-density phones. Only requested image variants enter the bounded runtime cache; image files are not bulk-precached.

The interface supports Chinese and English, with English recipe titles and bilingual navigation, guides, installation, sharing and update feedback. Recipe instructions switch between simplified Chinese and English, with matching ingredient, method and tip sections. See the [content guide](docs/content-guide.md) and [translation evaluation evidence](evals/recipe-translations.json). `pnpm eval` checks bilingual structure, numbers, measured units, references and known terminology regressions. Translation checks provide regression coverage; changes still require editorial review. On-device installation and actual iPhone home-screen behavior should be checked on physical devices; WebKit automation is not a substitute for device testing.

## App interactions

Search enters a compact app state without remounting the input; Cancel and browser Back leave search and preserve shelf state. Mobile inputs use a 16px minimum to avoid focus zoom. Installed PWA windows suppress page pinch gestures while ordinary browser tabs retain zoom. Long pages expose a floating Back to top control, with reduced-motion support and clearance above mobile navigation.

## Contributing and support

Start with [the documentation guide](docs/README.md). Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, validation and review expectations. Report reproducible bugs through GitHub Issues. For vulnerabilities, follow [SECURITY.md](SECURITY.md).

## License

Application code is available under the [MIT License](LICENSE). Recipe source links and external media retain their respective ownership.
