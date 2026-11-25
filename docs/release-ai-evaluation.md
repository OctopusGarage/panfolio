# Application release evaluation — 2026-11-25

Historical record: the later three-category simplification supersedes facet and tag recommendations here. Follow [the current maintenance guide](discovery-guide.md).

## Method and release gate

This evaluation combines two independent AI source reviews, AI inspection of actual desktop and phone pages, deterministic content/model evaluation, accessibility checks and browser scenarios. A release is allowed only after all defined gates pass and confirmed defects are fixed and retested. AI judgment is recorded as findings and evidence, not a fabricated numeric quality score.

The reviewed working tree includes 44 recipe entries, 31 kitchen references, their covers, the discovery redesign and local My kitchen features. The review covers this application release; it does not claim to rewatch every original video.

## Coverage

| Area                          | Acceptance criteria and evidence                                                                                                                                                                                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery                     | Independent facets; bilingual aliases; one-preparation ingredient intersection; alternative ingredient boundaries; parent-deduplicated counts; reversible zero results; recipe/reference scopes. Model tests and discovery browser tests.                                          |
| Reading and cooking           | Complete source text remains accessible; selected preparation includes its ingredients and shared steps; bilingual recipe content; explicit cooking choice; recipe/reference/list return state. Content, preparation and browser tests.                                            |
| Kitchen knowledge             | Positive topics do not index source counterexamples as recommendations; standalone lessons remain separate; reference/detail links and original video metadata remain valid. Reference model and browser tests.                                                                    |
| My kitchen                    | Favorites, tried/repeat, notes, private-tag search, recent reading and saved searches. Search query/focus survive detail round trips; saved chef-series searches retain their collection restriction.                                                                              |
| Persistence and privacy       | Full kitchen backup export/import into an isolated browser context; legacy backup merge; existing-note precedence; invalid recipe IDs rejected without mutation; concurrent-tab status writes; actionable storage-failure feedback. Private data stays outside public URLs.        |
| Source video and sharing      | Explicit player load, provider switching, close/navigation teardown, offline behavior; protected links, QR decode and private-data exclusion. Existing browser and unit suites.                                                                                                    |
| Offline and recovery          | Scoped caches, readiness evidence, recovery without deleting unrelated caches or notes, update failure feedback and one-time activation reload. Existing unit/browser suites.                                                                                                      |
| Responsive UI                 | 320, 390, 768 and 1280 CSS-pixel widths; Chinese and English; eight routes per combination; Chromium and WebKit. No horizontal document/content overflow, page exceptions or automated WCAG A/AA violations.                                                                       |
| Interaction and accessibility | Native filter dialog, background controls remaining inert, Escape/focus return, draft cancel/Back/apply, committed result counts, keyboard checks and language switching. WebKit may temporarily return focus to browser chrome/body; background controls must remain unreachable. |
| Visual judgment               | Actual desktop recipe grid and phone My kitchen/reference filter pages inspected for hierarchy, alignment, readable controls, useful spacing, natural image treatment and stable navigation. Automated card ratio/alignment and safe-area tests complement this inspection.        |

The responsive matrix checks Library, Kitchen essentials, My kitchen, Settings, Guides, chef series, a multi-preparation recipe and a standalone reference: 128 browser/page combinations. Existing recipe-specific tests additionally exercise all new recipes and reviewed video mappings.

## Findings corrected before release

1. Mobile mixed-search Apply counts omitted kitchen references. The button now counts exactly the result types in its draft scope.
2. Mobile Clear all retained the temporary search scope. It now restores the original destination, including the appropriate facet groups.
3. My kitchen query state was lost when its component unmounted for recipe reading. Query state now lives above the detail route; return restores query and card focus.
4. Applying a saved chef-series search lost its collection restriction. Saved searches now retain an optional validated collection context, independently of cuisine and author tags.

Targeted regressions reproduced the affected behavior before fixes and passed after fixes. The initial strict keyboard assertion incorrectly treated WebKit's native browser-chrome focus cycle as background-page focus; the corrected evaluation verifies that no background control receives focus while the modal is open.

## Final verification

- `pnpm test`: 56 unit tests passed.
- `pnpm eval` and `pnpm eval:report`: 44 bilingual recipes validated; translation evidence refreshed.
- `pnpm build`: passed strict TypeScript checking and production build.
- `pnpm test:e2e`: 132 browser tests passed across Chromium and WebKit.
- `pnpm format:check` and `git diff --check`: passed.

Repeat the additional release scenarios with `pnpm exec playwright test tests/ui-ux-eval.spec.ts tests/release-data-eval.spec.ts`; the full browser command includes them automatically.

## Boundaries

No confirmed release-blocking issue remains in the exercised scenarios once the final gates pass. Automated accessibility checks do not substitute for every assistive-technology combination. External YouTube/Bilibili streaming and the protected-share service retain their own availability restrictions; tests verify integration behavior, not universal third-party playback availability. Numeric cooking-duration, nutrition and dietary claims are intentionally outside discovery metadata when unsupported by sources. The existing production bundle-size advisory remains a future optimization, not a failed build or measured interaction regression.
