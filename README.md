# Panfolio

Your personal recipe collection and kitchen notebook.

Browse your growing collection of recipes, search names and ingredient text, save favorites, write personal notes, and read recipes section by section while cooking. Install the app on your home screen and revisit bundled recipe text offline after successful caching. Recipe photos are downloaded at responsive sizes and cached as viewed; external videos require a connection.

## App features

- Desktop sidebar and mobile bottom navigation; independent recipe and saved-shelf search/filter state.
- Recent recipes, dismissible first-use help, a bilingual Kitchen essentials reference collection and device-specific installation instructions.
- Twelve reusable preparation, heat and seasoning references with search, categories, practical explanations and links back to recipes; application help lives in the User guide.
- Optional click-to-load source videos in recipe and kitchen-reference details, with YouTube/Bilibili selection where available and original-site fallback. Videos require connectivity and remain outside offline caches.
- Clean app and recipe sharing links, clipboard fallback, native sharing where supported, and locally generated bilingual PNG QR cards.
- Version checks on return/reconnect and a manual check in Settings. Updates provide progress, timeout/retry and completion feedback; activation must be confirmed before reload.
- Complete scoped precache validation, startup failure recovery and a standalone [recovery page](https://octopusgarage.github.io/panfolio/recover.html) that preserves personal data and neighboring deployments.

## Personal data

Favorites and notes stay in this browser. IndexedDB transactions serialize changes between windows; localStorage mirrors support migration and fallback. Open windows refresh through BroadcastChannel, storage events and foreground checks. Export JSON backups before clearing browser data. Import validates the entire file, merges favorites and preserves existing notes when both copies contain a note for the same recipe. There is no account or cloud synchronization.

## Development

Node.js 22.12+ and pnpm 10 are required.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm eval
pnpm format:check
pnpm build
pnpm exec playwright install chromium webkit
pnpm test:e2e
pnpm dev
```

Production assets support subdirectory hosting. GitHub Actions validates tests and builds before deploying to GitHub Pages. Updates wait for the user to select the update action.

## Recipe content

Add recipes to `src/recipes.json` as your collection grows. Each entry has a stable `id`, `title`, `body` (Markdown), `titleEn`, `bodyEn`, `description`, `descriptionEn`, plus optional `image` and `source` URL. Keep English titles with their recipes so reordering entries does not mix up translations. There is no fixed recipe count. Search, categories, totals and offline content update automatically when the app is rebuilt. Keep full-size images in `public/recipes/`. Build generates 480, 768 and 1200 pixel derivatives. Mobile image candidates are capped at 768 pixels, including high-density phones. Only requested image variants enter the bounded runtime cache; image files are not bulk-precached.

The interface supports Chinese and English, with English recipe titles and bilingual navigation, guides, installation, sharing and update feedback. Recipe instructions switch between simplified Chinese and English, with matching ingredient, method and tip sections. See the [content guide](docs/content-guide.md) and [translation evaluation evidence](evals/recipe-translations.json). `pnpm eval` checks bilingual structure, numbers, measured units, references and known terminology regressions. Translation checks provide regression coverage; changes still require editorial review. On-device installation and actual iPhone home-screen behavior should be checked on physical devices; WebKit automation is not a substitute for device testing.

## App interactions

Search enters a compact app state without remounting the input; Cancel and browser Back leave search and preserve shelf state. Mobile inputs use a 16px minimum to avoid focus zoom. Installed PWA windows suppress page pinch gestures while ordinary browser tabs retain zoom. Long pages expose a floating Back to top control, with reduced-motion support and clearance above mobile navigation.

## Contributing and support

Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, validation and review expectations. Report reproducible bugs through GitHub Issues. For vulnerabilities, follow [SECURITY.md](SECURITY.md).

## License

Application code is available under the [MIT License](LICENSE). Recipe source links and external media retain their respective ownership.
