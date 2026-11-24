# Panfolio

Your personal recipe collection and kitchen notebook.

Browse 20 Chinese recipe entries and collections, search names and ingredient text, save favorites, write personal notes, and read recipes section by section while cooking. Install the app on your home screen and revisit bundled recipe text offline after successful caching. External images and videos require a connection.

## App features

- Desktop sidebar and mobile bottom navigation; independent recipe and saved-shelf search/filter state.
- Recent recipes, dismissible first-use help, kitchen guides and device-specific installation instructions.
- Clean app and recipe sharing links, clipboard fallback, native sharing where supported, and locally generated bilingual PNG QR cards.
- Version checks on return/reconnect and a manual check in Settings. Updates provide progress, timeout/retry and completion feedback; activation must be confirmed before reload.
- Complete scoped precache validation, startup failure recovery and a standalone [recovery page](https://octopusgarage.github.io/panfolio/recover.html) that preserves personal data and neighboring deployments.

See the [TalkSprout parity audit](docs/parity-audit.md) for the complete comparison and domain mappings.

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

The recipe collection belongs to the project owner and was migrated from their existing cookbook. Original recipe text and video references are retained. Missing measurements, servings and nutritional values are not invented. Images remain externally hosted. Search does not automatically normalize simplified/traditional Chinese variants.

The interface supports Chinese and English, with English recipe titles and bilingual navigation, guides, installation, sharing and update feedback. Original recipe instructions remain Chinese. On-device installation and actual iPhone home-screen behavior should be checked on physical devices; WebKit automation is not a substitute for device testing.

## Shared infrastructure

PWA lifecycle, offline checks, sharing, clipboard coordination, app frame and gesture modules are adapted from [TalkSprout](https://github.com/OctopusGarage/talksprout) under the MIT License.
