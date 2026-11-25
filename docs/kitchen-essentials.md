# Kitchen essentials

Kitchen essentials is a separate bilingual reference collection at `#essentials`. It extracts reusable preparation and cooking knowledge without removing instructions or tips from recipes. Application help remains at `#guides` under the name User guide, linked from the reference index.

## Organization

The initial collection contains twelve references in three populated categories: Ingredient preparation, Heat & doneness, and Seasoning & aroma. Storage & meal preparation is reserved for future sourced material and is not displayed as an empty category. Japanese chef series is the source collection, independent of the task-oriented categories.

Content lives in `src/kitchen-essentials.json`; category metadata and recipe association helpers live in `src/kitchen-essentials.ts`. Routes use stable reference IDs, for example `#essentials/soy-sauce-pan`. Existing recipe IDs, favorites and notes are unchanged. Reference pages link to associated recipes; recipes expose Related kitchen essentials.

## Editorial rules

Each entry has a localized title, summary, scope, practical steps, explanations, common mistakes, applicability limits, recipe IDs and YouTube sources. Keep both languages complete, with matching quantities and timings. Keep necessary operational detail. Avoid editorial statements about the extraction process in reader-facing content.

Shared explanations are written once per reference, while recipe tips retain their cooking context. Do not promote a source-specific instruction into a universal rule. In particular, preserve cold-pan chicken versus preheated salmon, off-heat butter versus near-doneness chicken basting, and hot-pan soy sauce aroma versus off-heat butter-soy sauce. Broccoli blanching and salmon salting times remain tied to those preparations.

The initial content is based on the reviewed SAMUKICHI captions and descriptions documented in `japanese-chef-series.md`. Source URLs are YouTube only in the reader-facing reference sections. Storage durations, thawing instructions and garlic-oil preservation guidance are not inferred from immediate cooking methods.

## Verification

Unit checks cover bilingual field completeness, unique IDs, populated categories, valid recipe associations, YouTube source domains and measured-value parity. Browser coverage verifies search, filtering, direct detail routes, English content, recipe round trips, empty results and mobile layout. Existing recipe and application checks continue to apply.
