# Contributing

Panfolio is a bilingual, local-first recipe PWA. Keep changes focused and describe the user-visible result in each pull request.

## Local development

Use Node.js 22.12 or newer and pnpm 10. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. Run `pnpm exec playwright install chromium webkit` before browser tests.

Before submitting a change, run:

```sh
pnpm test
pnpm eval
pnpm format:check
pnpm build
pnpm test:e2e
```

Include regression coverage for behavior changes. For installed PWA changes, distinguish desktop browser automation from actual device verification. The native iOS top-edge compositing workaround in `index.html` cannot be visually verified by desktop WebKit alone.

## Content and design

Follow the [content guide](docs/content-guide.md) and [visual direction](docs/visual-style.md). Keep Chinese and English interfaces and recipes aligned. Preserve recipe IDs, quantities and source links. Do not invent timings or nutrition data.

## Privacy and offline behavior

Never include personal notes in public URLs, sharing cards or logs. Recovery and cache cleanup must remain scoped to this deployment. Preserve saved recipes and notes during updates. Test offline and update behavior when changing service-worker infrastructure.

## Reporting issues

Include reproduction steps, expected and actual behavior, browser/OS versions, and whether the app is installed or running in a browser tab. Remove private notes from screenshots and exported files before attaching them.
