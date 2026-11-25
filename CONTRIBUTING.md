# Contributing

Panfolio is a bilingual, local-first recipe PWA. Keep changes focused and describe the user-visible result in each pull request.

## Local development

Use Node.js 24, pnpm 10 and Python 3.9+ for complete repository checks. Install MCP dependencies with `pnpm --dir mcp install --frozen-lockfile`. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. Run `pnpm exec playwright install chromium webkit` before browser tests.

Before submitting a change, run:

```sh
pnpm sync
pnpm docs:check
pnpm distribution:check
pnpm test
pnpm mcp:test
pnpm mcp:build
pnpm eval
pnpm format:check
pnpm build
pnpm test:e2e
```

Include regression coverage for behavior changes. For installed PWA changes, distinguish desktop browser automation from actual device verification. The native iOS top-edge compositing workaround in `index.html` cannot be visually verified by desktop WebKit alone.

For AI changes, follow [distribution maintenance](docs/distribution-maintenance.md). Increase only the shared distribution version, regenerate derived files and keep immutable releases intact.

## Content and design

Follow the [content guide](docs/content-guide.md) and [visual direction](docs/visual-style.md). Keep Chinese and English interfaces and recipes aligned. Preserve recipe IDs, quantities and source links. Do not invent timings or nutrition data.

## Privacy and offline behavior

Never include personal notes in public URLs, sharing cards or logs. Recovery and cache cleanup must remain scoped to this deployment. Preserve saved recipes and notes during updates. Test offline and update behavior when changing service-worker infrastructure.

## Reporting issues

Include reproduction steps, expected and actual behavior, browser/OS versions, and whether the app is installed or running in a browser tab. Remove private notes from screenshots and exported files before attaching them.
