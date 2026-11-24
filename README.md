# Panfolio

Your personal recipe collection and kitchen notebook.

Browse 20 Chinese recipe entries and collections, search names and ingredient text, save favorites, write personal notes, and read recipes section by section while cooking. Install the app on your home screen and revisit bundled recipe text offline after successful caching. External images and videos require a connection.

## Personal data

Favorites and notes stay in this browser. Export JSON backups before clearing browser data. Import validates the entire file, merges favorites and preserves existing notes when both copies contain a note for the same recipe. There is no account or cloud synchronization.

## Development

Node.js 22.12+ and pnpm 10 are required.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm exec playwright install chromium webkit
pnpm test:e2e
pnpm dev
```

Production assets support subdirectory hosting. GitHub Actions validates tests and builds before deploying to GitHub Pages. Updates wait for the user to select the update action.

## Content provenance

Initial content was retrieved on 2026-11-24 from [CodeFarmer’s Recipe](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe). Each entry retains its source URL and original recipe text, including original video references. The instant-noodle entry is a collection of preparations. Missing measurements, servings and nutritional values are not invented. Search operates on original text; simplified/traditional Chinese variants are not automatically normalized.

Third-party recipe text and images remain the property of their respective authors. No blanket license is asserted for them; the application's MIT license covers original application code only. Review source permissions before redistributing content elsewhere. Images remain externally hosted rather than copied into this repository.

The current interface is Chinese. On-device installation and actual iPhone home-screen behavior should be checked on physical devices; WebKit automation is not a substitute for device testing.
